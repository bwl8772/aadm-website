import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";
import {
	type CommandReply,
	CommandReplySchema,
	type CommandRequest,
	type FieldActionLink,
	type Problem,
	ProblemSchema,
} from "./field-types";

/**
 * Browser side of Field commands and live updates. The browser never calls
 * the backend: it posts to the same-origin `/api/field/commands` carrier and
 * listens on `/api/field/events` (docs/ENGINEERING_RULES.md "One backend
 * door"). After a command the page re-reads the view — it never patches its
 * own copy (every contract §"Commands").
 */

const COMMANDS_PATH = "/api/field/commands";
const EVENTS_PATH = "/api/field/events";
/** The reply's `next_step` survives the re-read so the person sees it once. */
const NEXT_STEP_KEY = "field.next_step";

/** What a screen knows that every command on it needs. */
export type CommandScope = {
	engagement_id?: string;
	workspace_id?: string;
	/** `generated_at` of the view: the base a click was made against. */
	generated_at?: string;
};

const CommandScopeContext = createContext<CommandScope>({});

export function CommandScopeProvider({
	value,
	children,
}: {
	value: CommandScope;
	children: ReactNode;
}) {
	return (
		<CommandScopeContext.Provider value={value}>
			{children}
		</CommandScopeContext.Provider>
	);
}

export function useCommandScope(): CommandScope {
	return useContext(CommandScopeContext);
}

export type CommandOutcome =
	| { ok: true; reply: CommandReply }
	| { ok: false; problem: Problem };

/* Commands in flight across the page: a `view.invalidated` waits for them. */
let inFlight = 0;
let reloadWhenIdle = false;

function finishOne() {
	inFlight = Math.max(0, inFlight - 1);
	if (inFlight === 0 && reloadWhenIdle) {
		reloadWhenIdle = false;
		window.location.reload();
	}
}

/** Re-read the page: now, or as soon as no command is in flight. */
export function rereadView(): void {
	if (inFlight > 0) {
		reloadWhenIdle = true;
		return;
	}
	window.location.reload();
}

export function stashNextStep(line: string): void {
	try {
		window.sessionStorage.setItem(NEXT_STEP_KEY, line);
	} catch {
		/* storage off: the line is simply not shown after the re-read */
	}
}

export function takeNextStep(): string | null {
	try {
		const line = window.sessionStorage.getItem(NEXT_STEP_KEY);
		if (line !== null) window.sessionStorage.removeItem(NEXT_STEP_KEY);
		return line;
	} catch {
		return null;
	}
}

/**
 * Sends one server-offered action as a command. The idempotency key is made
 * once per click and reused on a retry of that click (ARCH-08).
 */
export async function sendFieldCommand(
	action: FieldActionLink,
	scope: CommandScope,
	idempotencyKey: string,
): Promise<CommandOutcome> {
	if (action.kind !== "command" || !action.command) {
		return {
			ok: false,
			problem: {
				code: "INVALID_COMMAND",
				title: "Not a command",
				detail: "This control has no command to send.",
				retryable: false,
			},
		};
	}
	const body: CommandRequest = {
		command: action.command,
		target: action.target
			? {
					kind: action.target_kind ?? "item",
					id: action.target,
					expected_version: action.expected_version,
				}
			: undefined,
		input: action.input,
		idempotency_key: idempotencyKey,
		engagement_id: scope.engagement_id,
		workspace_id: scope.workspace_id,
		base_generated_at: scope.generated_at,
	};
	inFlight += 1;
	try {
		const res = await fetch(COMMANDS_PATH, {
			method: "POST",
			credentials: "same-origin",
			headers: {
				"Content-Type": "application/json",
				Accept: "application/json",
			},
			body: JSON.stringify(body),
		});
		const json: unknown = await res.json().catch(() => null);
		if (res.ok) {
			const reply = CommandReplySchema.safeParse(json);
			if (reply.success) return { ok: true, reply: reply.data };
		} else {
			const problem = ProblemSchema.safeParse(json);
			if (problem.success) return { ok: false, problem: problem.data };
		}
		return {
			ok: false,
			problem: {
				code: "MALFORMED_RESPONSE",
				title: "Something broke on our side",
				detail: `The reply (HTTP ${res.status}) did not match the contract.`,
				retryable: false,
			},
		};
	} catch {
		return {
			ok: false,
			problem: {
				code: "UNAVAILABLE",
				title: "Could not reach aadm.io",
				detail: "The request did not leave the browser or got no answer.",
				retryable: true,
			},
		};
	} finally {
		finishOne();
	}
}

/**
 * Click → pending → outcome, for one action. On success the reply's
 * `next_step` is stashed and the view re-read; on a problem the caller shows
 * `title`, `detail` and `request_id` (RES-04) and may retry with the same key.
 */
export function useCommand(action: FieldActionLink) {
	const scope = useContext(CommandScopeContext);
	const [pending, setPending] = useState(false);
	const [problem, setProblem] = useState<Problem | null>(null);
	const keyRef = useRef<string | null>(null);

	const run = useCallback(
		async (retry = false) => {
			if (pending) return;
			if (!retry || !keyRef.current) keyRef.current = crypto.randomUUID();
			setPending(true);
			setProblem(null);
			const outcome = await sendFieldCommand(action, scope, keyRef.current);
			if (outcome.ok) {
				stashNextStep(outcome.reply.next_step);
				rereadView();
				return;
			}
			if (
				outcome.problem.code === "STALE_VIEW" ||
				outcome.problem.code === "STALE_VERSION"
			) {
				// Contract "Stale": re-read, then the person sees what changed.
				rereadView();
				return;
			}
			setProblem(outcome.problem);
			setPending(false);
		},
		[action, scope, pending],
	);

	return { run, pending, problem };
}

/**
 * Subscribes to `view.invalidated` for this screen's scope and re-reads the
 * view (after any command in flight). A 204 from the relay means live updates
 * are off for this release; `EventSource` then stops on its own.
 */
export function useViewInvalidated(
	scope: "home" | "engagement" | "workspace",
	id?: string,
): void {
	useEffect(() => {
		if (typeof EventSource === "undefined") return;
		const url = new URL(EVENTS_PATH, window.location.origin);
		url.searchParams.set("scope", scope);
		if (id) url.searchParams.set("id", id);
		const source = new EventSource(url.toString(), { withCredentials: true });
		const onInvalidated = () => rereadView();
		source.addEventListener("view.invalidated", onInvalidated);
		return () => {
			source.removeEventListener("view.invalidated", onInvalidated);
			source.close();
		};
	}, [scope, id]);
}
