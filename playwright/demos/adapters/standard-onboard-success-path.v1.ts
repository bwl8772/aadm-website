/**
 * standard-onboard — FIRST / lead tour (top of the click-walk catalog).
 *
 * Path: aadm.io → Open standard → GitHub UDALI + L1–L22 → back →
 * Create account (speak to viewer: your name / your email) → /member →
 * Connectors OAuth (look only — NEVER click Client ID / Copy client ID).
 *
 * HARD FORBID: do not click “Copy client ID”, do not focus/select the Client ID
 * code so the full value is revealed on camera, do not narrate the Client ID.
 *
 * Canonical URLs:
 * - https://aadm.io/standard
 * - https://github.com/bwl8772/aadm-standard
 * - UDALI personas: …/blob/main/docs/udali-personas.md
 * - Layers L1–L22: …/blob/main/docs/udali-22-layer-model.md
 * - Connectors OAuth: /member/mcp-oauth
 */
import type { DemoSuccessPathV1 } from "./demo-path-types.v1.ts";

export const STANDARD_REPO_URL =
	"https://github.com/bwl8772/aadm-standard";
export const STANDARD_UDALI_PERSONAS_URL =
	`${STANDARD_REPO_URL}/blob/main/docs/udali-personas.md`;
export const STANDARD_UDALI_LAYERS_URL =
	`${STANDARD_REPO_URL}/blob/main/docs/udali-22-layer-model.md`;

/** Viewer-facing VO lines (speak to the person watching — not the operator’s name). */
export const STANDARD_ONBOARD_VIEWER_LINES = {
	home: "Start here on aadm.io.",
	openStandard: "Open the standard.",
	browseSections: "Browse the sections.",
	udali: "Open UDALI on GitHub.",
	layers: "Here are the UDALI layers — L1 through L22.",
	returnHome: "Come back to aadm.io.",
	createAccount: "Create your account.",
	yourName: "Enter your name.",
	yourEmail: "Enter your email.",
	yourPassword: "Choose your password.",
	continueSignup: "Continue.",
	member: "You’re in the member area.",
	connectorsOauth:
		"Open Connectors OAuth — this is for Claude Code and claude.ai.",
	connectorsLookOnly:
		"Look here — do not click Client ID. Copy it later when you’re ready, off-camera if needed.",
} as const;

export const STANDARD_ONBOARD_SUCCESS_PATH_V1 = {
	tour: "standard-onboard",
	version: 1,
	authMode: "authenticated",
	audienceOutcome:
		"Viewer opens the public standard, sees UDALI + layers on GitHub, returns to create their account (your name / your email), then visits Connectors OAuth without revealing the Client ID.",
	stations: [
		{
			sceneId: "1-home",
			title: "Start on aadm.io",
			path: "/",
			intent: STANDARD_ONBOARD_VIEWER_LINES.home,
			beats: [
				{
					id: "home-orient",
					verb: "Reading",
					affordance: "Home hero",
					locatorHint: "main h1",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.home}” Short pause.`,
				},
				{
					id: "nav-open-standard-read",
					verb: "Reading",
					affordance: "Open standard (nav)",
					locatorHint: "a[href='/standard'], a[aria-label*='Open AADM standard']",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.openStandard}”`,
				},
				{
					id: "nav-open-standard-click",
					verb: "Clicking",
					affordance: "Open standard (nav)",
					locatorHint: "a[href='/standard'], a[aria-label*='Open AADM standard']",
					commit: true,
				},
			],
		},
		{
			sceneId: "2-standard-page",
			title: "Open standard page",
			path: "/standard",
			intent: "Scroll the directory; show six sections briefly.",
			beats: [
				{
					id: "standard-hero",
					verb: "Reading",
					affordance: "The standard, in public",
					locatorHint: "main h1",
				},
				{
					id: "browse-sections-click",
					verb: "Clicking",
					affordance: "Browse sections",
					locatorHint: "a[href='#sections']",
					commit: true,
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.browseSections}”`,
				},
				{
					id: "sections-scroll",
					verb: "Reading",
					affordance: "Six sections list",
					locatorHint: "#sections",
					notes: "Short scroll; pointer moves — no teleport.",
				},
			],
		},
		{
			sceneId: "3-udali-github",
			title: "UDALI on GitHub",
			path: STANDARD_UDALI_PERSONAS_URL,
			intent: STANDARD_ONBOARD_VIEWER_LINES.udali,
			beats: [
				{
					id: "udali-card-read",
					verb: "Reading",
					affordance: "UDALI section card",
					locatorHint: "#sections text=UDALI",
				},
				{
					id: "udali-open-github",
					verb: "Clicking",
					affordance: "Open on GitHub (UDALI)",
					locatorHint:
						"#sections a[href*='udali-personas']:has-text('Open on GitHub'), a[href*='udali-personas.md']",
					commit: true,
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.udali}” Prod may still open /standards — then goto personas URL.`,
				},
				{
					id: "github-personas-scroll",
					verb: "Reading",
					affordance: "udali-personas.md body",
					locatorHint: "GitHub blob view for docs/udali-personas.md",
					notes: "Short scroll; drive the mouse.",
				},
			],
		},
		{
			sceneId: "4-layers-github",
			title: "UDALI layers (L1–L22)",
			path: STANDARD_UDALI_LAYERS_URL,
			intent: STANDARD_ONBOARD_VIEWER_LINES.layers,
			beats: [
				{
					id: "layers-nav-or-goto",
					verb: "Clicking",
					affordance: "udali-22-layer-model.md",
					locatorHint:
						"a[href*='udali-22-layer-model'], or goto layers URL",
					commit: true,
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.layers}”`,
				},
				{
					id: "layers-scroll",
					verb: "Reading",
					affordance: "Layer lattice headings",
					locatorHint: "GitHub blob view for docs/udali-22-layer-model.md",
					notes: "Short pause + scroll.",
				},
			],
		},
		{
			sceneId: "5-return-aadm",
			title: "Return to aadm.io",
			path: "/",
			intent: STANDARD_ONBOARD_VIEWER_LINES.returnHome,
			beats: [
				{
					id: "return-home",
					verb: "Clicking",
					affordance: "Navigate back to aadm.io home",
					locatorHint: "goto https://aadm.io/",
					commit: true,
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.returnHome}”`,
				},
				{
					id: "create-account-nav-read",
					verb: "Reading",
					affordance: "Create account",
					locatorHint: "a:has-text('Create account'), a:has-text('Get access')",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.createAccount}” Signed-out required.`,
				},
				{
					id: "create-account-nav-click",
					verb: "Clicking",
					affordance: "Create account / Get access",
					locatorHint: "a:has-text('Create account'), #get-access, a:has-text('Get access')",
					commit: true,
				},
			],
		},
		{
			sceneId: "6-create-account",
			title: "Create account — your name / your email",
			path: "account-portal/sign-up",
			intent:
				"Show the sign-up page. Speak to the viewer: enter your name, your email, your password. End frame MAY hold on this page.",
			beats: [
				{
					id: "signup-page-orient",
					verb: "Reading",
					affordance: "Sign-up form",
					locatorHint: "Clerk Account Portal sign-up",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.createAccount}” Hold with short pause — this is a key frame.`,
				},
				{
					id: "signup-name-type",
					verb: "Typing",
					affordance: "Your name",
					locatorHint: "Clerk sign-up name fields",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.yourName}” Type demo values from DEMO_SIGNUP_*; never narrate secrets.`,
				},
				{
					id: "signup-email-type",
					verb: "Typing",
					affordance: "Your email",
					locatorHint: "Clerk sign-up email",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.yourEmail}”`,
				},
				{
					id: "signup-password-type",
					verb: "Typing",
					affordance: "Your password",
					locatorHint: "Clerk sign-up password",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.yourPassword}” allowSecret; MUST NOT log. Soft-skip Typing if DEMO_SIGNUP_PASSWORD unset — still show the field.`,
				},
				{
					id: "signup-continue-read",
					verb: "Reading",
					affordance: "Continue",
					locatorHint: "Clerk sign-up primary button",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.continueSignup}” Optional click for full signup; highlight cut MAY stop before submit.`,
				},
			],
		},
		{
			sceneId: "7-member-shell",
			title: "Member shell",
			path: "/member",
			intent: STANDARD_ONBOARD_VIEWER_LINES.member,
			beats: [
				{
					id: "member-land",
					verb: "Reading",
					affordance: "Member area / Bearer how-to",
					locatorHint: "#bearer-how-to-heading, text=Member area",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.member}” Soft-skip if still on signup (highlight ends at 6).`,
				},
			],
		},
		{
			sceneId: "8-connectors-oauth",
			title: "Connectors OAuth (look only)",
			path: "/member/mcp-oauth",
			intent: STANDARD_ONBOARD_VIEWER_LINES.connectorsOauth,
			beats: [
				{
					id: "oauth-nav-read",
					verb: "Reading",
					affordance: "Connectors OAuth (left nav)",
					locatorHint: "text=Connectors OAuth",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.connectorsOauth}” MUST visit this station.`,
				},
				{
					id: "oauth-nav-click",
					verb: "Clicking",
					affordance: "Connectors OAuth (left nav)",
					locatorHint: "text=Connectors OAuth",
					commit: true,
				},
				{
					id: "oauth-heading-read",
					verb: "Reading",
					affordance: "Connectors OAuth heading",
					locatorHint: ".member-oauth-page h1, text=Connectors OAuth",
					notes: `VO: “${STANDARD_ONBOARD_VIEWER_LINES.connectorsLookOnly}”`,
				},
				{
					id: "oauth-help-read",
					verb: "Reading",
					affordance: "Connection help (Claude)",
					locatorHint: "#oauth-help-claude",
					notes:
						"HARD FORBID: do NOT click “Copy client ID”, “Client ID”, or the masked code to copy. Do NOT select/highlight the Client ID value. Masked display in the pane is OK if already on screen — never enlarge or copy it.",
				},
			],
		},
	],
} as const satisfies DemoSuccessPathV1;

/** Locked scene order — order QA MUST fail if any disappear. */
export const STANDARD_ONBOARD_REQUIRED_SCENE_IDS = [
	"1-home",
	"2-standard-page",
	"3-udali-github",
	"4-layers-github",
	"5-return-aadm",
	"6-create-account",
	"7-member-shell",
	"8-connectors-oauth",
] as const;

/** Documented capture exception vs default `narrated`. */
export const STANDARD_ONBOARD_CAPTURE_HINTS = {
	profile: "fast" as const,
	targetDurationMs: 20_000,
	shortPauseMs: 400,
	baseUrlProduction: "https://aadm.io",
	standardPage: "https://aadm.io/standard",
	standardRepo: STANDARD_REPO_URL,
	/** MUST visit; MUST NOT click Client ID / Copy client ID. */
	connectorsOauthPath: "/member/mcp-oauth",
	forbidClientIdClick: true,
} as const;
