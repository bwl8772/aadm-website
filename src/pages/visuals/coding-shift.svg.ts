import type { APIRoute } from "astro";
import { codingShiftSvg } from "../../lib/coding-shift-svg";

export const prerender = false;

/** Standalone copy of the /about "Where the work goes" visual, for download or embedding. */
export const GET: APIRoute = () =>
	new Response(codingShiftSvg({ standalone: true }), {
		status: 200,
		headers: {
			"Content-Type": "image/svg+xml; charset=utf-8",
			"Cache-Control": "public, max-age=3600",
		},
	});
