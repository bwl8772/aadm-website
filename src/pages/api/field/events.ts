import type { APIRoute } from "astro";
import {
	eventsPath,
	FIELD_API_VERSION,
	fieldApiUrl,
} from "../../../lib/field-api";
import { logServer, releaseId } from "../../../lib/server-log";

export const prerender = false;

const ROUTE = "/api/field/events";

/**
 * Same-origin relay for the backend's `view.invalidated` stream (every
 * contract's "Live updates"). The browser opens `EventSource` here with a
 * scope; this route checks the session, opens the backend stream with the
 * request headers every backend call carries, and pipes the bytes through.
 * No backend configured → 204, which tells `EventSource` to stop for good.
 */
export const GET: APIRoute = async (context) => {
	const request_id = crypto.randomUUID();
	const { userId } = context.locals.auth();
	const log = (level: "info" | "warn", code: string) =>
		logServer({
			level,
			route: ROUTE,
			request_id,
			code,
			actor_id: userId ?? null,
		});

	if (!userId) {
		log("info", "unauthenticated");
		return new Response(null, {
			status: 401,
			headers: { "Cache-Control": "no-store" },
		});
	}
	const scope = context.url.searchParams.get("scope");
	const id = context.url.searchParams.get("id");
	const path =
		scope === "home" || scope === "engagement" || scope === "workspace"
			? eventsPath(scope, id)
			: null;
	const base = fieldApiUrl();
	if (!path) {
		log("info", "rejected");
		return new Response(null, {
			status: 400,
			headers: { "Cache-Control": "no-store" },
		});
	}
	if (!base) {
		log("info", "events_off");
		return new Response(null, {
			status: 204,
			headers: { "Cache-Control": "no-store" },
		});
	}

	let upstream: Response;
	try {
		upstream = await fetch(`${base}${path}`, {
			headers: {
				Accept: "text/event-stream",
				"X-Request-Id": request_id,
				"X-Api-Version": FIELD_API_VERSION,
				"X-Release": releaseId(),
				"X-Actor-Id": userId,
			},
			signal: context.request.signal,
		});
	} catch {
		log("warn", "unavailable");
		return new Response(null, {
			status: 503,
			headers: { "Cache-Control": "no-store", "Retry-After": "10" },
		});
	}
	if (!upstream.ok || !upstream.body) {
		log("warn", `upstream_${upstream.status}`);
		return new Response(null, {
			status: upstream.status === 404 ? 404 : 503,
			headers: { "Cache-Control": "no-store", "Retry-After": "10" },
		});
	}
	log("info", "ok");
	return new Response(upstream.body, {
		status: 200,
		headers: {
			"Content-Type": "text/event-stream; charset=utf-8",
			"Cache-Control": "no-store",
			Connection: "keep-alive",
			"X-Accel-Buffering": "no",
		},
	});
};
