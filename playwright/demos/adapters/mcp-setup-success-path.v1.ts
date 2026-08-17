/**
 * mcp-setup — public Hosted MCP page: endpoint → two ways → credentials CTA.
 * MUST NOT surface raw tokens; Sign in / Get access only.
 */
import type { DemoSuccessPathV1 } from "./demo-path-types.v1.ts";

export const MCP_SETUP_SUCCESS_PATH_V1 = {
	tour: "mcp-setup",
	version: 1,
	authMode: "public",
	audienceOutcome:
		"Viewer can point an IDE at the hosted MCP URL, sees Bearer vs OAuth as two ways, and knows credentials live after Sign in → /member.",
	stations: [
		{
			sceneId: "1-mcp-hero",
			title: "MCP hero",
			path: "/mcp",
			intent: "Orient on Hosted MCP as the subscriber endpoint story.",
			beats: [
				{
					id: "mcp-hero-orient",
					verb: "Reading",
					affordance: "Connect to the AADM MCP",
					locatorHint: "#mcp-hero-heading",
				},
				{
					id: "mcp-connection-steps-link",
					verb: "Reading",
					affordance: "Connection steps",
					locatorHint: "a[href='#two-ways']",
				},
				{
					id: "mcp-connection-steps-click",
					verb: "Clicking",
					affordance: "Connection steps",
					locatorHint: "a[href='#two-ways']",
					commit: true,
				},
			],
		},
		{
			sceneId: "2-endpoint",
			title: "MCP server URL",
			path: "/mcp",
			intent: "Show the public Streamable HTTP URL region (no secret values).",
			beats: [
				{
					id: "endpoint-heading",
					verb: "Reading",
					affordance: "MCP endpoint section",
					locatorHint: "#mcp-endpoint-heading",
				},
			],
		},
		{
			sceneId: "3-two-ways",
			title: "Two ways to connect",
			path: "/mcp#two-ways",
			intent: "Bearer (API key) vs OAuth — choose a path without inventing credentials.",
			beats: [
				{
					id: "two-ways-heading",
					verb: "Reading",
					affordance: "Two ways heading",
					locatorHint: "#two-ways-heading",
				},
			],
		},
		{
			sceneId: "4-bearer-path",
			title: "Bearer path (public copy)",
			path: "/mcp",
			intent: "Explain ak_… Bearer for Cursor/Windsurf/curl — placeholders only.",
			beats: [
				{
					id: "bearer-heading",
					verb: "Reading",
					affordance: "Connect with Bearer",
					locatorHint: "#connect-bearer-heading",
				},
				{
					id: "bearer-sign-in-read",
					verb: "Reading",
					affordance: "Sign in to AADM (Bearer section)",
					locatorHint: "section[aria-labelledby='connect-bearer-heading'] a:has-text('Sign in to AADM')",
					notes: "Do not click through to portal on this public tour unless chaining to member-credentials.",
				},
			],
		},
		{
			sceneId: "5-oauth-path",
			title: "OAuth path (public copy)",
			path: "/mcp",
			intent: "Explain Connectors OAuth Client ID — sign-in for the real ID.",
			beats: [
				{
					id: "oauth-heading",
					verb: "Reading",
					affordance: "Connect with OAuth",
					locatorHint: "#connect-oauth-heading",
				},
				{
					id: "oauth-sign-in-read",
					verb: "Reading",
					affordance: "Sign in for your client ID",
					locatorHint: "text=Sign in for your client ID",
				},
			],
		},
		{
			sceneId: "6-credentials-cta",
			title: "Toward member credentials",
			path: "/mcp",
			intent: "End on a clear Sign in / Get access affordance toward /member after auth.",
			beats: [
				{
					id: "get-access-read",
					verb: "Reading",
					affordance: "Get access (hero or included section)",
					locatorHint: "#get-access",
				},
				{
					id: "sign-in-read",
					verb: "Reading",
					affordance: "Sign in to AADM",
					locatorHint: "a:has-text('Sign in to AADM')",
					notes:
						"Public tour ends here. Authenticated continuation is member-credentials (do not gut that tour into this one).",
				},
			],
		},
	],
} as const satisfies DemoSuccessPathV1;

export const MCP_SETUP_REQUIRED_SCENE_IDS = [
	"1-mcp-hero",
	"2-endpoint",
	"3-two-ways",
	"4-bearer-path",
	"5-oauth-path",
	"6-credentials-cta",
] as const;
