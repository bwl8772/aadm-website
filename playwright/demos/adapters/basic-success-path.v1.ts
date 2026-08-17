/**
 * basic — public-page smoke only (exception tour).
 * Proves marketing host responds; does not substitute for marketing-home / mcp-setup.
 */
import type { DemoSuccessPathV1 } from "./demo-path-types.v1.ts";

export const BASIC_SUCCESS_PATH_V1 = {
	tour: "basic",
	version: 1,
	authMode: "public",
	audienceOutcome:
		"Viewer sees the marketing home loads; unsigned /member is gated (redirect / portal), not a credentials leak.",
	stations: [
		{
			sceneId: "1-home-smoke",
			title: "Home smoke",
			path: "/",
			intent: "Confirm `/` paints the AADM home hero.",
			beats: [
				{
					id: "home-goto-read",
					verb: "Reading",
					affordance: "Home hero",
					locatorHint: "main h1",
				},
			],
		},
		{
			sceneId: "2-member-unsigned",
			title: "Unsigned member gate",
			path: "/member",
			intent: "Unsigned `/member` does not expose API keys or OAuth Client ID.",
			beats: [
				{
					id: "member-unsigned-read",
					verb: "Reading",
					affordance: "Sign-in gate or Account Portal redirect",
					locatorHint: "URL leaves /member credentials UI OR Clerk sign-in chrome",
					notes: "No credential panes visible while signed out.",
				},
			],
		},
	],
} as const satisfies DemoSuccessPathV1;

export const BASIC_REQUIRED_SCENE_IDS = [
	"1-home-smoke",
	"2-member-unsigned",
] as const;
