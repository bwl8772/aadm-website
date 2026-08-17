/**
 * marketing-home — public value stations + click path.
 * Primary story: home hero → Connect production agents → Hosted MCP land.
 */
import type { DemoSuccessPathV1 } from "./demo-path-types.v1.ts";

export const MARKETING_HOME_SUCCESS_PATH_V1 = {
	tour: "marketing-home",
	version: 1,
	authMode: "public",
	audienceOutcome:
		"Viewer believes AADM is an open standard plus a hosted MCP, and knows the next click is Connect production agents → /mcp.",
	stations: [
		{
			sceneId: "1-home-hero",
			title: "Home hero",
			path: "/",
			intent: "Orient on brand + two-product story (open standard + Hosted MCP).",
			beats: [
				{
					id: "home-hero-orient",
					verb: "Reading",
					affordance: "Home hero headline",
					locatorHint: "main h1 (home)",
				},
				{
					id: "home-hero-two-products",
					verb: "Reading",
					affordance: "Two products · one story note",
					locatorHint: "text=Two products · one story",
				},
			],
		},
		{
			sceneId: "2-three-lanes",
			title: "Three lanes",
			path: "/",
			intent: "Show Navigator / Investigator / Sentinel as equal workflows.",
			beats: [
				{
					id: "lanes-heading",
					verb: "Reading",
					affordance: "Three workflows heading",
					locatorHint: "text=Three workflows",
				},
				{
					id: "lanes-navigator",
					verb: "Reading",
					affordance: "Navigator lane card",
					locatorHint: "text=Navigator",
				},
				{
					id: "lanes-investigator",
					verb: "Reading",
					affordance: "Investigator lane card",
					locatorHint: "text=Investigator",
				},
				{
					id: "lanes-sentinel",
					verb: "Reading",
					affordance: "Sentinel lane card",
					locatorHint: "text=Sentinel",
				},
			],
		},
		{
			sceneId: "3-primary-cta",
			title: "Connect production agents",
			path: "/",
			intent: "Commit the primary CTA toward Hosted MCP marketing.",
			beats: [
				{
					id: "cta-read",
					verb: "Reading",
					affordance: "Connect production agents",
					locatorHint: "a[href]:has-text('Connect production agents')",
				},
				{
					id: "cta-click",
					verb: "Clicking",
					affordance: "Connect production agents",
					locatorHint: "a[href]:has-text('Connect production agents')",
					commit: true,
					notes: "Lands on /mcp (or PUBLIC_MCP_QUICKSTART_URL).",
				},
			],
		},
		{
			sceneId: "4-mcp-land",
			title: "Hosted MCP land",
			path: "/mcp",
			intent: "Prove the CTA delivered the viewer to Hosted MCP — stable end frame.",
			beats: [
				{
					id: "mcp-hero-read",
					verb: "Reading",
					affordance: "MCP hero heading",
					locatorHint: "#mcp-hero-heading",
				},
				{
					id: "mcp-nav-chip",
					verb: "Reading",
					affordance: "Hosted MCP nav chip active",
					locatorHint: "nav a[aria-label*='MCP marketing'], a[aria-label*='Hosted MCP']",
				},
			],
		},
	],
} as const satisfies DemoSuccessPathV1;

/** Locked scene order for order QA. */
export const MARKETING_HOME_REQUIRED_SCENE_IDS = [
	"1-home-hero",
	"2-three-lanes",
	"3-primary-cta",
	"4-mcp-land",
] as const;
