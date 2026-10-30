/**
 * The one backend door for Field (docs/ENGINEERING_RULES.md "One backend
 * door"): only server code calls `aadm-backend`, every call carries
 * `request_id`, `api_version` and the release id (CTX-05, API-06, OPS-01) and
 * has a timeout (OPS-08). The base URL is server-only (`FIELD_API_URL`,
 * never `PUBLIC_`); unset turns Field commands off and `/health` says so
 * (ENV-03).
 */
import {
	type CommandReply,
	CommandReplySchema,
	type CommandRequest,
	type Problem,
	ProblemSchema,
} from "../components/field/field-types";
import { releaseId } from "./server-log";

/** The backend API version this release speaks (ARCH-21). */
export const FIELD_API_VERSION = "1";
const COMMAND_TIMEOUT_MS = 10_000;
const HEALTH_TIMEOUT_MS = 3_000;
const HEALTH_TTL_MS = 60_000;

export function fieldApiUrl(): string | null {
	const raw = process.env.FIELD_API_URL?.trim();
	if (!raw) return null;
	return raw.replace(/\/+$/, "");
}

/** PRD §A7 command envelope, built on the server from the session (ARCH-01). */
export type CommandEnvelope = {
	verb: string;
	workspace_id: string | null;
	engagement_id: string | null;
	actor: { kind: "person"; id: string };
	client: "web";
	source_ref: { page: string };
	target: CommandRequest["target"] | null;
	input: Record<string, unknown>;
	idempotency_key: string;
	request_id: string;
	api_version: string;
	base_generated_at: string | null;
};

export function buildEnvelope(args: {
	userId: string;
	request: CommandRequest;
	requestId: string;
	page: string;
}): CommandEnvelope {
	const { request } = args;
	return {
		verb: request.command,
		workspace_id: request.workspace_id ?? null,
		engagement_id: request.engagement_id ?? null,
		actor: { kind: "person", id: args.userId },
		client: "web",
		source_ref: { page: args.page },
		target: request.target ?? null,
		input: request.input ?? {},
		idempotency_key: request.idempotency_key,
		request_id: args.requestId,
		api_version: FIELD_API_VERSION,
		base_generated_at: request.base_generated_at ?? null,
	};
}

export type BackendResult<T> =
	| { ok: true; status: number; data: T }
	| { ok: false; status: number; problem: Problem };

function problem(
	status: number,
	code: string,
	title: string,
	detail: string,
	retryable: boolean,
	requestId: string,
): BackendResult<never> {
	return {
		ok: false,
		status,
		problem: { code, title, detail, retryable, request_id: requestId },
	};
}

function backendHeaders(requestId: string): Record<string, string> {
	return {
		Accept: "application/json",
		"Content-Type": "application/json",
		"X-Request-Id": requestId,
		"X-Api-Version": FIELD_API_VERSION,
		"X-Release": releaseId(),
	};
}

/**
 * `POST /api/v1/commands`. Returns the parsed reply or a problem; the caller
 * never sees a raw body. Unconfigured, unreachable and malformed are separate
 * problems so the screen can tell them apart (ARCH-25, RES-05).
 */
export async function sendCommand(
	envelope: CommandEnvelope,
): Promise<BackendResult<CommandReply>> {
	const base = fieldApiUrl();
	const rid = envelope.request_id;
	if (!base) {
		return problem(
			503,
			"UNAVAILABLE",
			"Field commands are off",
			"This release has no Field backend configured, so nothing can be sent.",
			false,
			rid,
		);
	}
	let res: Response;
	try {
		res = await fetch(`${base}/api/v1/commands`, {
			method: "POST",
			headers: backendHeaders(rid),
			body: JSON.stringify(envelope),
			signal: AbortSignal.timeout(COMMAND_TIMEOUT_MS),
		});
	} catch (err) {
		const timedOut = err instanceof Error && err.name === "TimeoutError";
		return problem(
			timedOut ? 504 : 503,
			timedOut ? "INDETERMINATE" : "UNAVAILABLE",
			timedOut ? "Outcome unknown" : "Field backend did not answer",
			timedOut
				? "The backend did not answer in time. Check before trying again."
				: "The backend could not be reached.",
			!timedOut,
			rid,
		);
	}
	let json: unknown = null;
	try {
		json = await res.json();
	} catch {
		json = null;
	}
	if (!res.ok) {
		const parsed = ProblemSchema.safeParse(json);
		if (parsed.success) {
			return {
				ok: false,
				status: res.status,
				problem: { request_id: rid, ...parsed.data },
			};
		}
		return problem(
			502,
			"MALFORMED_RESPONSE",
			"Something broke on our side",
			`The backend answered ${res.status} without a readable problem.`,
			false,
			rid,
		);
	}
	const reply = CommandReplySchema.safeParse(json);
	if (!reply.success) {
		return problem(
			502,
			"MALFORMED_RESPONSE",
			"Something broke on our side",
			"The backend reply did not match the command contract.",
			false,
			rid,
		);
	}
	return {
		ok: true,
		status: res.status,
		data: { request_id: rid, ...reply.data },
	};
}

/** SSE paths per contract: My Field, one engagement, one workspace. */
export function eventsPath(
	scope: "home" | "engagement" | "workspace",
	id: string | null,
): string | null {
	if (scope === "home") return "/api/v1/field/home/events";
	if (!id) return null;
	return scope === "engagement"
		? `/api/v1/engagements/${encodeURIComponent(id)}/events`
		: `/api/v1/workspaces/${encodeURIComponent(id)}/events`;
}

export type BackendHealth = {
	configured: boolean;
	reachable: boolean | null;
	/** The backend's `api_version` (OPS-03); null until reached. */
	api_version: string | null;
	/** This release speaks this version; the backend must serve it or N-1 (ARCH-21). */
	wants_api_version: string;
};

let healthCache: { until: number; value: BackendHealth } | null = null;

/** Cached backend `/health` read for the website's own `/health`. */
export async function backendHealth(): Promise<BackendHealth> {
	const base = fieldApiUrl();
	if (!base) {
		return {
			configured: false,
			reachable: null,
			api_version: null,
			wants_api_version: FIELD_API_VERSION,
		};
	}
	if (healthCache && healthCache.until > Date.now()) return healthCache.value;
	let value: BackendHealth = {
		configured: true,
		reachable: false,
		api_version: null,
		wants_api_version: FIELD_API_VERSION,
	};
	try {
		const res = await fetch(`${base}/health`, {
			headers: backendHeaders(crypto.randomUUID()),
			signal: AbortSignal.timeout(HEALTH_TIMEOUT_MS),
		});
		if (res.ok) {
			const body = (await res.json().catch(() => null)) as {
				api_version?: unknown;
			} | null;
			value = {
				...value,
				reachable: true,
				api_version:
					typeof body?.api_version === "string" ? body.api_version : null,
			};
		}
	} catch {
		/* unreachable: reported, never thrown */
	}
	healthCache = { until: Date.now() + HEALTH_TTL_MS, value };
	return value;
}
