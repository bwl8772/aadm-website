/// <reference types="astro/client" />
/// <reference types="node" />

declare namespace App {
	interface Locals {
		/** True when satellite handshake is in progress — member page shows sync shell only. */
		satelliteSyncPending?: boolean;
	}
}
