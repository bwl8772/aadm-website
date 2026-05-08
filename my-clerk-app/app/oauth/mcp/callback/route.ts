import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import {
	clerkOAuthClientId,
	clerkOAuthClientSecret,
	mcpOAuthRedirectUri,
} from "@/lib/mcp-oauth-config";
import { exchangeAuthorizationCode } from "@/lib/mcp-oauth-token";

const STATE_COOKIE = "mcp_oauth_state";
const VERIFIER_COOKIE = "mcp_oauth_code_verifier";

function escapeHtml(s: string): string {
	return s
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;");
}

export async function GET(request: Request) {
	const url = new URL(request.url);
	const error = url.searchParams.get("error");
	const errorDescription = url.searchParams.get("error_description");

	if (error) {
		const errRes = new NextResponse(
			`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>MCP OAuth error</title></head><body><h1>OAuth error</h1><p>${escapeHtml(error)}</p>${errorDescription ? `<p>${escapeHtml(errorDescription)}</p>` : ""}<p><a href="/dashboard/tokens">Back to tokens</a></p></body></html>`,
			{ status: 400, headers: { "content-type": "text/html; charset=utf-8" } },
		);
		errRes.cookies.delete(STATE_COOKIE);
		errRes.cookies.delete(VERIFIER_COOKIE);
		return errRes;
	}

	const code = url.searchParams.get("code");
	const state = url.searchParams.get("state");

	const jar = await cookies();
	const cookieState = jar.get(STATE_COOKIE)?.value;
	const codeVerifier = jar.get(VERIFIER_COOKIE)?.value;

	if (!code || !state || !cookieState || state !== cookieState) {
		const bad = new NextResponse(
			`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>MCP OAuth</title></head><body><h1>Invalid session</h1><p>Missing or mismatched OAuth state. Start again from <a href="/oauth/mcp/start">/oauth/mcp/start</a>.</p></body></html>`,
			{ status: 400, headers: { "content-type": "text/html; charset=utf-8" } },
		);
		bad.cookies.delete(STATE_COOKIE);
		bad.cookies.delete(VERIFIER_COOKIE);
		return bad;
	}

	const clientId = clerkOAuthClientId();
	if (!clientId) {
		return NextResponse.json(
			{ error: "missing_config", message: "CLERK_OAUTH_CLIENT_ID is not set." },
			{ status: 503 },
		);
	}

	const redirectUri = mcpOAuthRedirectUri(request.url);
	const clientSecret = clerkOAuthClientSecret();

	const exchanged = await exchangeAuthorizationCode({
		code,
		redirectUri,
		codeVerifier: codeVerifier ?? undefined,
		clientId,
		clientSecret,
	});

	if (!exchanged.ok) {
		const detail = exchanged.body.error_description ?? exchanged.body.error ?? "unknown";
		const fail = new NextResponse(
			`<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Token exchange failed</title></head><body><h1>Token exchange failed</h1><p>${escapeHtml(String(detail))}</p><p><a href="/oauth/mcp/start">Try again</a></p></body></html>`,
			{
				status: exchanged.status >= 400 ? exchanged.status : 502,
				headers: { "content-type": "text/html; charset=utf-8" },
			},
		);
		fail.cookies.delete(STATE_COOKIE);
		fail.cookies.delete(VERIFIER_COOKIE);
		return fail;
	}

	const { access_token, expires_in, refresh_token, scope } = exchanged.data;
	const tokenPreview =
		access_token.length > 16
			? `${access_token.slice(0, 12)}…${access_token.slice(-8)}`
			: "(short token)";

	const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>MCP OAuth — token ready</title>
</head>
<body style="font-family: system-ui, sans-serif; max-width: 42rem; margin: 2rem auto; padding: 0 1rem;">
  <h1>MCP access token</h1>
  <p>Use this value as <code>Authorization: Bearer &lt;access_token&gt;</code> when calling your AADM MCP URL (with <code>CLERK_OAUTH_CLIENT_ID</code> set on the MCP server).</p>
  <p><strong>Preview:</strong> <code>${escapeHtml(tokenPreview)}</code></p>
  ${typeof expires_in === "number" ? `<p><strong>Expires in:</strong> ${expires_in} seconds</p>` : ""}
  ${scope ? `<p><strong>Scope:</strong> ${escapeHtml(scope)}</p>` : ""}
  ${refresh_token ? `<p>A refresh token was issued (offline_access). Store it securely if your client supports refresh.</p>` : ""}
  <label for="token"><strong>Full access token</strong></label>
  <textarea id="token" readonly rows="6" style="width:100%; font-family: monospace; font-size: 12px;">${escapeHtml(access_token)}</textarea>
  <p><button type="button" id="copy">Copy token</button></p>
  <p><a href="/dashboard/tokens">Dashboard tokens</a> · <a href="/oauth/mcp/start">New OAuth session</a></p>
  <script>
    document.getElementById("copy").onclick = function () {
      var t = document.getElementById("token");
      t.select();
      document.execCommand("copy");
    };
  </script>
</body>
</html>`;

	const res = new NextResponse(html, {
		status: 200,
		headers: { "content-type": "text/html; charset=utf-8" },
	});
	res.cookies.delete(STATE_COOKIE);
	res.cookies.delete(VERIFIER_COOKIE);
	return res;
}
