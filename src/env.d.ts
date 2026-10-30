/// <reference types="astro/client" />
/// <reference types="node" />

declare namespace App {
	interface Locals {
		/** Server-made id for this request's log line and error pages (CTX-05). */
		requestId?: string;
		/**
		 * Set by src/middleware.ts when a private route is unsigned but the browser
		 * holds Clerk cookies the server could not verify. Pages render
		 * `SessionGatePage` and nothing private. `reason` is Clerk's auth reason
		 * (a code, never a token).
		 */
		sessionGate?: {
			state: "recover" | "stop";
			request_id: string;
			reason: string | null;
		};
	}
}
