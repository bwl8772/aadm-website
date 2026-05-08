import { clerkOAuthIssuer } from "./mcp-oauth-config";

export type TokenSuccess = {
	access_token: string;
	token_type: string;
	expires_in?: number;
	refresh_token?: string;
	scope?: string;
	id_token?: string;
};

export type TokenErrorBody = {
	error?: string;
	error_description?: string;
};

export async function exchangeAuthorizationCode(params: {
	code: string;
	redirectUri: string;
	codeVerifier?: string;
	clientId: string;
	clientSecret?: string;
}): Promise<{ ok: true; data: TokenSuccess } | { ok: false; status: number; body: TokenErrorBody }> {
	const issuer = clerkOAuthIssuer();
	const tokenUrl = `${issuer}/oauth/token`;

	const body = new URLSearchParams({
		grant_type: "authorization_code",
		code: params.code,
		redirect_uri: params.redirectUri,
		client_id: params.clientId,
	});

	if (params.clientSecret) {
		body.set("client_secret", params.clientSecret);
	}
	if (params.codeVerifier) {
		body.set("code_verifier", params.codeVerifier);
	}

	const res = await fetch(tokenUrl, {
		method: "POST",
		headers: {
			"Content-Type": "application/x-www-form-urlencoded",
		},
		body: body.toString(),
	});

	let json: TokenSuccess & TokenErrorBody;
	try {
		json = (await res.json()) as TokenSuccess & TokenErrorBody;
	} catch {
		return {
			ok: false,
			status: res.status || 502,
			body: { error: "invalid_token_response", error_description: "Non-JSON body from token endpoint" },
		};
	}

	if (!res.ok) {
		return {
			ok: false,
			status: res.status,
			body: {
				error: json.error ?? "token_exchange_failed",
				error_description: json.error_description,
			},
		};
	}

	if (typeof json.access_token !== "string" || json.access_token.length === 0) {
		return {
			ok: false,
			status: 502,
			body: { error: "invalid_token_response" },
		};
	}

	return {
		ok: true,
		data: {
			access_token: json.access_token,
			token_type: json.token_type ?? "Bearer",
			expires_in: json.expires_in,
			refresh_token: json.refresh_token,
			scope: json.scope,
			id_token: json.id_token,
		},
	};
}
