const DEFAULT_MCP_ORIGIN = "https://mcp.aadm.io";

/** Normalize MCP service host (origin + optional non-root path). */
export function normalizeMcpRpcUrl(raw: string | undefined): string {
  const v = raw?.trim();
  if (!v) return DEFAULT_MCP_ORIGIN;
  try {
    const u = new URL(v);
    return `${u.origin}${u.pathname === "/" ? "" : u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return DEFAULT_MCP_ORIGIN;
  }
}

/**
 * Streamable HTTP JSON-RPC URL for IDE / connector configs.
 * Appends `/mcp` when the env value is origin-only; preserves an explicit path.
 */
export function resolveHostedMcpRpcUrl(endpoint: string): string {
  const raw = endpoint.trim() || DEFAULT_MCP_ORIGIN;
  try {
    const u = new URL(raw);
    const path = u.pathname.replace(/\/+$/, "");
    if (path && path !== "/") {
      return `${u.origin}${path}`;
    }
    return `${u.origin}/mcp`;
  } catch {
    return `${DEFAULT_MCP_ORIGIN}/mcp`;
  }
}

/** MCP JSON-RPC URL for dashboard copy (explicit env wins, then repo-style env, then default). */
export function mcpRpcUrlForNextApp(): string {
  const explicit = process.env.NEXT_PUBLIC_MCP_HTTP_URL?.trim();
  if (explicit) return resolveHostedMcpRpcUrl(explicit);
  const repo = process.env.NEXT_PUBLIC_MCP_REPO_URL?.trim();
  if (repo) return resolveHostedMcpRpcUrl(repo);
  return resolveHostedMcpRpcUrl(DEFAULT_MCP_ORIGIN);
}
