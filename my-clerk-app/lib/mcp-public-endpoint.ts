/** Default MCP host — the endpoint is the origin itself, not `/mcp`. */
const DEFAULT_MCP_ORIGIN = "https://mcp.aadm.io";

/** Normalize MCP URL to origin (+ optional non-root path). Do NOT append `/mcp`. */
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

/** MCP URL for dashboard copy / clipboard (explicit env wins, then repo-style env, then default). */
export function mcpRpcUrlForNextApp(): string {
  const explicit = process.env.NEXT_PUBLIC_MCP_HTTP_URL?.trim();
  if (explicit) return normalizeMcpRpcUrl(explicit);
  const repo = process.env.NEXT_PUBLIC_MCP_REPO_URL?.trim();
  if (repo) return normalizeMcpRpcUrl(repo);
  return normalizeMcpRpcUrl(undefined);
}
