import type { APIRoute } from "astro";
import {
	CommandRequestSchema,
	type Problem,
} from "../../../components/field/field-types";
import { buildEnvelope, sendCommand } from "../../../lib/field-api";
import { logServer } from "../../../lib/server-log";

export const prerender = false;

/** Forms cap payload size before sending (OPS-08); this is the server's cap. */
const MAX_BODY_BYTES = 64 * 1024;
const ROUTE = "/api/field/commands";

function json(status: number, body: unknown): Response {
	return new Response(JSON.stringify(body), {
		status,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
}

/**
 * Same-origin carrier for the PRD §A7 envelope. The browser posts a
 * `CommandRequest`; this route adds the actor from the Clerk session (never
 * from the body — ARCH-01), the `request_id`, `api_version` and release, and
 * forwards it to `POST /api/v1/commands`. It returns the backend's reply or
 * problem unchanged and writes one log line (OBS-01). It has no idea what a
 * command means (ARCH-05).
 */
export const POST: APIRoute = async (context) => {
	const started = Date.now();
	const request_id = crypto.randomUUID();
	const { userId } = context.locals.auth();
	const done = (status: number, code: string, extra: object = {}) => {
		logServer({
			level: status >= 500 ? "error" : "info",
			route: ROUTE,
			request_id,
			code,
			actor_id: userId ?? null,
			latency_ms: Date.now() - started,
			...extra,
		});
	};
	const fail = (status: number, problem: Problem) => {
		done(status, problem.code);
		return json(status, { ...problem, request_id });
	};

	if (!userId) {
		return fail(401, {
			code: "UNAUTHENTICATED",
			title: "Sign in to continue",
			detail: "Your session is missing or expired.",
			retryable: false,
		});
	}

	const length = Number(context.request.headers.get("content-length") ?? 0);
	if (length > MAX_BODY_BYTES) {
		return fail(413, {
			code: "REJECTED",
			title: "Command too large",
			detail: `The body may be at most ${MAX_BODY_BYTES} bytes.`,
			retryable: false,
		});
	}
	const text = await context.request.text();
	if (text.length > MAX_BODY_BYTES) {
		return fail(413, {
			code: "REJECTED",
			title: "Command too large",
			detail: `The body may be at most ${MAX_BODY_BYTES} bytes.`,
			retryable: false,
		});
	}
	let raw: unknown;
	try {
		raw = JSON.parse(text);
	} catch {
		raw = null;
	}
	const parsed = CommandRequestSchema.safeParse(raw);
	if (!parsed.success) {
		return fail(422, {
			code: "INVALID_COMMAND",
			title: "Command not understood",
			detail: parsed.error.issues
				.map((i) => `${i.path.join(".") || "body"}: ${i.message}`)
				.join("; "),
			retryable: false,
			field: parsed.error.issues[0]?.path.join(".") || undefined,
		});
	}

	const envelope = buildEnvelope({
		userId,
		request: parsed.data,
		requestId: request_id,
		page: new URL(context.request.headers.get("referer") ?? "/", context.url)
			.pathname,
	});
	const result = await sendCommand(envelope);
	if (!result.ok) {
		done(result.status, result.problem.code, {
			verb: envelope.verb,
			workspace_id: envelope.workspace_id,
		});
		return json(result.status, result.problem);
	}
	done(result.status, result.data.result, {
		verb: envelope.verb,
		workspace_id: envelope.workspace_id,
		saved: result.data.saved.length,
	});
	return json(result.status, result.data);
};
