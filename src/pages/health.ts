import type { APIRoute } from "astro";
import { clerkKeyStatus } from "../lib/clerk-health";
import { backendHealth } from "../lib/field-api";
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
	const [clerk, backend] = await Promise.all([
		clerkKeyStatus(import.meta.env),
		backendHealth(),
	]);
	const ok = clerk.ok;
	const body = {
		status: ok ? "ok" : "degraded",
		service: "aadm-website",
		release: releaseId(),
		env: process.env.AADM_ENV ?? null,
		clerk,
		field_fixtures: import.meta.env.PUBLIC_FIELD_FIXTURES === "1",
		/** Field backend: configured, reachable and its `api_version` (ARCH-21, OPS-03). Off is not a failure (ENV-03). */
		backend,
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
