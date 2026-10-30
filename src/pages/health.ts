import type { APIRoute } from "astro";
import { clerkKeyStatus } from "../lib/clerk-health";
import { logServer, releaseId } from "../lib/server-log";

export const prerender = false;

/**
 * Deploy health (docs/INVARIANTS.md OPS-01, OPS-03, ENV-03). Railway polls this
 * before cutover (railway.toml), so a release whose Clerk keys are missing,
 * from different instances, or rejected by Clerk answers 503 and never goes
 * live. Reports state only — never a key value.
 */
export const GET: APIRoute = async () => {
	const started = Date.now();
	const request_id = crypto.randomUUID();
	const clerk = await clerkKeyStatus(import.meta.env);
	const ok = clerk.ok;
	const body = {
		status: ok ? "ok" : "degraded",
		service: "aadm-website",
		release: releaseId(),
		clerk,
		field_fixtures: import.meta.env.PUBLIC_FIELD_FIXTURES === "1",
		/** Backend `api_version` reached (ARCH-21) — none wired yet. */
		backend: null,
		request_id,
	};
	if (!ok) {
		logServer({
			level: "error",
			route: "/health",
			request_id,
			code: "clerk_keys",
			latency_ms: Date.now() - started,
			clerk,
		});
	}
	return new Response(JSON.stringify(body), {
		status: ok ? 200 : 503,
		headers: {
			"Content-Type": "application/json; charset=utf-8",
			"Cache-Control": "no-store",
		},
	});
};
