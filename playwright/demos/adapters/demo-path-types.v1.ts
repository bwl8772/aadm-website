/**
 * Shared types for aadm-website narrated demo walk contracts.
 * Product-agnostic shapes only — locators stay in tour-specific success-path files.
 */

export type DemoUxVerb = "Reading" | "Clicking" | "Typing" | "Asking";

export type DemoAuthMode = "public" | "authenticated";

/** One atomic presenter move inside a station. */
export type DemoPathBeat = {
	/** Stable beat id within the tour (for UX logs). */
	id: string;
	verb: DemoUxVerb;
	/** Human-visible control or region name. */
	affordance: string;
	/**
	 * Locator / selection hint for adapters (not a Playwright Locator).
	 * Prefer role + name / id already in the product.
	 */
	locatorHint: string;
	/** True when the beat commits navigation or a durable UI change. */
	commit?: boolean;
	notes?: string;
};

/** Viewer-clear product moment the shipping cut MUST hit. */
export type DemoValueStation = {
	/** Locked scene id — order QA MUST fail if removed from the walkthrough. */
	sceneId: string;
	title: string;
	/** Path on marketing host, hash, or "account-portal" for Clerk. */
	path: string;
	intent: string;
	beats: readonly DemoPathBeat[];
};

export type DemoSuccessPathV1 = {
	tour: string;
	version: 1;
	authMode: DemoAuthMode;
	audienceOutcome: string;
	/** Ordered value stations — fill the walk; do not gut. */
	stations: readonly DemoValueStation[];
};

export function requiredSceneIds(path: DemoSuccessPathV1): string[] {
	return path.stations.map((s) => s.sceneId);
}
