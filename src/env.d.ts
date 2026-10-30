/// <reference types="astro/client" />
/// <reference types="node" />

declare namespace App {
	interface Locals {
		/** True when /member is waiting for clerk-js to attach the session — sync shell only. */
		satelliteSyncPending?: boolean;
	}
}
