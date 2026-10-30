/**
 * One JSON log line per server decision (docs/INVARIANTS.md OBS-01). Never a
 * token, cookie, email or env value (PRIV-01) — ids and codes only.
 */

export type ServerLogEntry = {
	level: "info" | "warn" | "error";
	route: string;
	request_id: string;
	/** Result code: `ok`, `unauthenticated`, `auth_recover`, `auth_unconfirmed`, … */
	code: string;
	latency_ms?: number;
	/** Clerk user id, never an email. */
	actor_id?: string | null;
	workspace_id?: string | null;
	/** Short, secret-free extras (a Clerk reason, a count). */
	[key: string]: unknown;
};

const SERVICE = "aadm-website";

/** Immutable release id (OPS-01): Railway's commit SHA, else `RELEASE_ID`, else `dev`. */
export function releaseId(): string {
	return (
		process.env.RAILWAY_GIT_COMMIT_SHA?.slice(0, 12) ||
		process.env.RELEASE_ID ||
		"dev"
	);
}

export function logServer(entry: ServerLogEntry): void {
	const line = JSON.stringify({
		ts: new Date().toISOString(),
		service: SERVICE,
		release: releaseId(),
		workspace_id: null,
		actor_id: null,
		...entry,
	});
	if (entry.level === "error") console.error(line);
	else console.log(line);
}
