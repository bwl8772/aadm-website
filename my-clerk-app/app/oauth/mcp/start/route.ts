import { NextResponse } from "next/server";

import {
	clerkOAuthClientId,
	clerkOAuthIssuer,
	mcpOAuthRedirectUri,
	mcpOAuthScopes,
} from "@/lib/mcp-oauth-config";
import { codeChallengeS256, generateCodeVerifier, generateOAuthState } from "@/lib/mcp-oauth-pkce";

const STATE_COOKIE = "mcp_oauth_state";
const VERIFIER_COOKIE = "mcp_oauth_code_verifier";
const COOKIE_MAX_AGE = 600;

function cookieSecure(requestUrl: string): boolean {
	try {
		return new URL(requestUrl).protocol === "https:";
	} catch {
		return process.env.NODE_ENV === "production";
	}
}

/**
 * Begins Clerk OAuth (authorization code + PKCE) for MCP access tokens.
 * Register redirect URI: same origin + `/oauth/mcp/callback` (or MCP_OAUTH_REDIRECT_URI).
 */
export async function GET(request: Request) {
	const clientId = clerkOAuthClientId();
	if (!clientId) {
		return NextResponse.json(
			{
				error: "missing_config",
				message:
					"Set CLERK_OAUTH_CLIENT_ID for the Clerk OAuth application used by MCP.",
			},
			{ status: 503 },
		);
	}

	const redirectUri = mcpOAuthRedirectUri(request.url);
	const issuer = clerkOAuthIssuer();
	const state = generateOAuthState();
	const codeVerifier = generateCodeVerifier();
	const codeChallenge = codeChallengeS256(codeVerifier);

	const authorize = new URL(`${issuer}/oauth/authorize`);
	authorize.searchParams.set("client_id", clientId);
	authorize.searchParams.set("redirect_uri", redirectUri);
	authorize.searchParams.set("response_type", "code");
	authorize.searchParams.set("scope", mcpOAuthScopes());
	authorize.searchParams.set("state", state);
	authorize.searchParams.set("code_challenge", codeChallenge);
	authorize.searchParams.set("code_challenge_method", "S256");

	const secure = cookieSecure(request.url);
	const res = NextResponse.redirect(authorize.toString());

	res.cookies.set(STATE_COOKIE, state, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: COOKIE_MAX_AGE,
	});
	res.cookies.set(VERIFIER_COOKIE, codeVerifier, {
		httpOnly: true,
		secure,
		sameSite: "lax",
		path: "/",
		maxAge: COOKIE_MAX_AGE,
	});

	return res;
}
