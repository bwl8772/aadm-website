/**
 * member-credentials — authenticated: Account Portal → /member tabs.
 * Bearer how-to is above UserProfile (not a fifth left tab).
 * Left nav order: API keys → Connectors OAuth → Profile → Security.
 */
import type { DemoSuccessPathV1 } from "./demo-path-types.v1.ts";

/** Mirror src/lib/member-area.ts — keep demos free of Astro src imports. */
const MEMBER_AREA_PATH = "/member";
const MEMBER_API_KEYS_SEGMENT = "api-keys";
const MEMBER_MCP_OAUTH_SEGMENT = "mcp-oauth";

export const MEMBER_CREDENTIALS_SUCCESS_PATH_V1 = {
	tour: "member-credentials",
	version: 1,
	authMode: "authenticated",
	audienceOutcome:
		"Viewer can sign in, find Bearer how-to + API keys, copy OAuth Client ID help, and confirm Profile/Security without leaking secrets on camera.",
	stations: [
		{
			sceneId: "1-sign-in",
			title: "Account Portal sign-in",
			path: "account-portal",
			intent: "Authenticate via Clerk Account Portal (accounts.aadm.io / portal URLs).",
			beats: [
				{
					id: "portal-email-read",
					verb: "Reading",
					affordance: "Email field",
					locatorHint: "Clerk Account Portal email input",
				},
				{
					id: "portal-email-type",
					verb: "Typing",
					affordance: "Email field",
					locatorHint: "Clerk Account Portal email input",
					notes: "Use disposable test user only. MUST NOT log the address in timeline if treated as PII policy requires.",
				},
				{
					id: "portal-continue-click",
					verb: "Clicking",
					affordance: "Continue / Sign in",
					locatorHint: "Clerk primary continue button",
					commit: true,
				},
				{
					id: "portal-password-type",
					verb: "Typing",
					affordance: "Password field",
					locatorHint: "Clerk password input",
					notes: "allowSecret for type only — MUST NOT appear in logs, timeline, or VO.",
				},
				{
					id: "portal-submit",
					verb: "Clicking",
					affordance: "Sign in submit",
					locatorHint: "Clerk sign-in submit",
					commit: true,
				},
			],
		},
		{
			sceneId: "2-member-shell",
			title: "Member shell + Bearer how-to",
			path: MEMBER_AREA_PATH,
			intent: "Land on /member; Bearer how-to sits above UserProfile (not a left tab).",
			beats: [
				{
					id: "member-land",
					verb: "Reading",
					affordance: "Member credentials shell",
					locatorHint: ".clerk-member-profile",
				},
				{
					id: "bearer-how-to",
					verb: "Reading",
					affordance: "Use an API key as a Bearer token",
					locatorHint: "#bearer-how-to-heading",
				},
				{
					id: "bearer-copy-json-read",
					verb: "Reading",
					affordance: "Copy JSON (mcp.json placeholder)",
					locatorHint: "button:has-text('Copy JSON')",
					notes: "Snippet uses ak_… placeholder — do not paste a live key into VO.",
				},
			],
		},
		{
			sceneId: "3-api-keys",
			title: "API keys",
			path: `${MEMBER_AREA_PATH}/${MEMBER_API_KEYS_SEGMENT}`,
			intent: "Open Clerk API keys surface — create/revoke UI visible; do not film raw ak_… values.",
			beats: [
				{
					id: "api-keys-nav-read",
					verb: "Reading",
					affordance: "API keys (left nav)",
					locatorHint: "Clerk UserProfile nav item for apiKeys / text≈API keys",
				},
				{
					id: "api-keys-nav-click",
					verb: "Clicking",
					affordance: "API keys (left nav)",
					locatorHint: "Clerk UserProfile nav item for apiKeys",
					commit: true,
				},
				{
					id: "api-keys-pane",
					verb: "Reading",
					affordance: "API keys pane",
					locatorHint: "Clerk apiKeys page content",
					notes: "Soft-skip create/revoke commits on public cuts; Reading is enough for shipping story.",
				},
			],
		},
		{
			sceneId: "4-connectors-oauth",
			title: "Connectors OAuth",
			path: `${MEMBER_AREA_PATH}/${MEMBER_MCP_OAUTH_SEGMENT}`,
			intent: "Show OAuth Client ID region + connection help (Claude / Cursor pointers).",
			beats: [
				{
					id: "oauth-nav-read",
					verb: "Reading",
					affordance: "Connectors OAuth (left nav)",
					locatorHint: "text=Connectors OAuth",
				},
				{
					id: "oauth-nav-click",
					verb: "Clicking",
					affordance: "Connectors OAuth (left nav)",
					locatorHint: "text=Connectors OAuth",
					commit: true,
				},
				{
					id: "oauth-heading",
					verb: "Reading",
					affordance: "Connectors OAuth heading",
					locatorHint: ".member-oauth-page h1",
				},
				{
					id: "oauth-client-id-look-only",
					verb: "Reading",
					affordance: "Client ID region (look only)",
					locatorHint: ".member-oauth-page code, text=Client ID",
					notes:
						"HARD FORBID: do NOT click “Copy client ID” or “Client ID”. Do not select/copy the value. Masked display OK.",
				},
				{
					id: "oauth-help-claude",
					verb: "Reading",
					affordance: "Connecting to Claude",
					locatorHint: "#oauth-help-claude",
				},
			],
		},
		{
			sceneId: "5-profile",
			title: "Profile",
			path: MEMBER_AREA_PATH,
			intent: "Open account/profile — look, don’t mutate secrets.",
			beats: [
				{
					id: "profile-nav-read",
					verb: "Reading",
					affordance: "Profile (left nav)",
					locatorHint: "Clerk UserProfile nav label=account / Profile",
				},
				{
					id: "profile-nav-click",
					verb: "Clicking",
					affordance: "Profile (left nav)",
					locatorHint: "Clerk UserProfile nav label=account",
					commit: true,
				},
				{
					id: "profile-pane",
					verb: "Reading",
					affordance: "Profile pane",
					locatorHint: "Clerk account page content",
				},
			],
		},
		{
			sceneId: "6-security",
			title: "Security",
			path: MEMBER_AREA_PATH,
			intent: "Open security — look only; MUST NOT change password or demote seed personas.",
			beats: [
				{
					id: "security-nav-read",
					verb: "Reading",
					affordance: "Security (left nav)",
					locatorHint: "Clerk UserProfile nav label=security",
				},
				{
					id: "security-nav-click",
					verb: "Clicking",
					affordance: "Security (left nav)",
					locatorHint: "Clerk UserProfile nav label=security",
					commit: true,
				},
				{
					id: "security-pane",
					verb: "Reading",
					affordance: "Security pane",
					locatorHint: "Clerk security page content",
				},
			],
		},
	],
} as const satisfies DemoSuccessPathV1;

export const MEMBER_CREDENTIALS_REQUIRED_SCENE_IDS = [
	"1-sign-in",
	"2-member-shell",
	"3-api-keys",
	"4-connectors-oauth",
	"5-profile",
	"6-security",
] as const;
