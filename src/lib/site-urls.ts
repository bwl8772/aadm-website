/** Shared env-derived URLs for marketing pages (`import.meta.env`).
 *
 * Two different “MCP” URLs (do not conflate):
 *
 * - **Marketing** — public copy and CTAs live at **`https://aadm.io/mcp`** (main site path).
 *   Override with `PUBLIC_MCP_QUICKSTART_URL` when needed (e.g. local preview: `http://localhost:4321/mcp`).
 * - **MCP service** — Streamable HTTP JSON-RPC at **`https://mcp.aadm.io/mcp`** (append `/mcp` when env is origin-only).
 *   Set host with `PUBLIC_MCP_REPO_URL`; defaults to `https://mcp.aadm.io`.
 *
 * Clerk: `PUBLIC_CLERK_PUBLISHABLE_KEY` + `CLERK_SECRET_KEY` only for auth.
 *
 * Account Portal URLs (sign-in / sign-up / user) are configured in the Clerk Dashboard
 * (`accounts.aadm.io`); we only hard-code the user page link for signed-in CTAs.
 */

/** Clerk Account Portal user page (configured in Clerk Dashboard, hard-coded for signed-in CTAs). */
export const URL_ACCOUNT_USER = 'https://accounts.aadm.io/user';

export function trim(v: string | undefined): string {
	return typeof v === 'string' ? v.trim() : '';
}

/**
 * Streamable HTTP MCP URL for IDE configs (`~/.cursor/mcp.json`, Claude Code, Claude Desktop).
 * Appends `/mcp` when `PUBLIC_MCP_REPO_URL` is origin-only; preserves a non-root path when set.
 */
export function resolveHostedMcpRpcUrl(endpoint: string): string {
	const raw = endpoint.trim() || 'https://mcp.aadm.io';
	try {
		const u = new URL(raw);
		const path = u.pathname.replace(/\/+$/, '');
		if (path && path !== '/') {
			return `${u.origin}${path}`;
		}
		return `${u.origin}/mcp`;
	} catch {
		return 'https://mcp.aadm.io/mcp';
	}
}

/** Origin only (e.g. discovery `GET /`) derived from a hosted MCP RPC URL. */
export function hostedMcpOrigin(rpcUrl: string): string {
	try {
		return new URL(rpcUrl).origin;
	} catch {
		return 'https://mcp.aadm.io';
	}
}

/** Normalize MCP **service** origin: the host you `POST` to (e.g. `https://mcp.aadm.io`). */
export function normalizeMcpRpcUrl(raw: string): string {
	const DEFAULT = 'https://mcp.aadm.io';
	const v = raw.trim();
	if (!v) return DEFAULT;
	try {
		const u = new URL(v);
		return `${u.origin}${u.pathname === '/' ? '' : u.pathname.replace(/\/+$/, '')}`;
	} catch {
		return DEFAULT;
	}
}

export type SiteUrlConfig = {
	urlStandard: string;
	/** MCP service host origin (e.g. `https://mcp.aadm.io`). */
	urlMcpEndpoint: string;
	/** Streamable HTTP JSON-RPC URL clients POST to (includes `/mcp` when origin-only). */
	urlMcpRpcUrl: string;
	/** Public marketing page for MCP (default production: `https://aadm.io/mcp`). */
	urlMcpMarketing: string;
	urlMcpCustomerDocs: string;
	hasMcpMarketingLink: boolean;
	healthUrl: string;
	discoveryUrl: string;
	curlInit: string;
	/** AADM Config v1 JSON Schema (`$schema` in `.aadm/config.json`). */
	aadmConfigSchemaUrl: string;
};

/** Default when `PUBLIC_STANDARD_REPO_URL` is unset — public standard repo (override per deploy). */
export const DEFAULT_STANDARD_REPO_URL = 'https://github.com/bwl8772/aadm-standard';

/** JSON Schema for `.aadm/config.json` — served from this marketing site (`/schemas/…`). */
export function aadmConfigSchemaUrl(env: ImportMetaEnv): string {
	const marketing = trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	try {
		return `${new URL(marketing).origin}/schemas/aadm-config.v1.schema.json`;
	} catch {
		return 'https://aadm.io/schemas/aadm-config.v1.schema.json';
	}
}

/** @deprecated Use `aadmConfigSchemaUrl(import.meta.env)` — kept for static imports. */
export const AADM_CONFIG_SCHEMA_URL = 'https://aadm.io/schemas/aadm-config.v1.schema.json';

/** @deprecated Marketing site does not publish OAuth Client ID — use accounts dashboard. */
export function maskPublicMcpOAuthClientId(id: string): string {
	const t = trim(id);
	if (t.length === 0) return '';
	if (t.length <= 5) return t;
	const hidden = t.length - 5;
	const dots = Math.min(hidden, 36);
	return `${t.slice(0, 5)}${'•'.repeat(dots)}`;
}

export function getSiteUrlConfig(env: ImportMetaEnv): SiteUrlConfig {
	const urlStandard = trim(env.PUBLIC_STANDARD_REPO_URL) || DEFAULT_STANDARD_REPO_URL;
	const urlMcpRaw = trim(env.PUBLIC_MCP_REPO_URL);
	const urlMcpEndpoint = normalizeMcpRpcUrl(urlMcpRaw || 'https://mcp.aadm.io');
	const urlMcpRpcUrl = resolveHostedMcpRpcUrl(urlMcpEndpoint);
	const urlMcpMarketing =
		trim(env.PUBLIC_MCP_QUICKSTART_URL) || 'https://aadm.io/mcp';
	const urlMcpCustomerDocs = trim(env.PUBLIC_MCP_CUSTOMER_DOCS_URL);
	const hasMcpMarketingLink = urlMcpMarketing.length > 0 && !urlMcpMarketing.startsWith('#');

	let healthUrl = '';
	let discoveryUrl = '';
	try {
		if (urlMcpEndpoint) {
			const u = new URL(urlMcpEndpoint);
			healthUrl = `${u.origin}/health`;
			discoveryUrl = `${u.origin}/`;
		}
	} catch {
		/* ignore invalid PUBLIC_MCP_REPO_URL */
	}

	const curlInit = urlMcpRpcUrl
		? `curl -s -X POST ${urlMcpRpcUrl} \\
  -H "Content-Type: application/json" \\
  -H "Accept: application/json, text/event-stream" \\
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2024-11-05","capabilities":{},"clientInfo":{"name":"smoke","version":"1.0.0"}}}'`
		: '';

	return {
		urlStandard,
		urlMcpEndpoint,
		urlMcpRpcUrl,
		urlMcpMarketing,
		urlMcpCustomerDocs,
		hasMcpMarketingLink,
		healthUrl,
		discoveryUrl,
		curlInit,
		aadmConfigSchemaUrl: aadmConfigSchemaUrl(env),
	};
}
