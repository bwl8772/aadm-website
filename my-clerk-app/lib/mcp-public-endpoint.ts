/** Default MCP host (Streamable HTTP JSON-RPC lives at `/mcp`). */
const DEFAULT_MCP_ORIGIN = "https://mcp.aadm.io";

/** Ensure JSON-RPC URL ends with `/mcp` when env is origin-only (e.g. `https://mcp.aadm.io`). */
export function normalizeMcpRpcUrl(raw: string | undefined): string {
  const fallback = `${DEFAULT_MCP_ORIGIN}/mcp`;
  const v = raw?.trim();
  if (!v) return fallback;
  try {
    const u = new URL(v);
    if (u.pathname === "/" || u.pathname === "") {
      return `${u.origin}/mcp`;
    }
    return `${u.origin}${u.pathname.replace(/\/+$/, "")}`;
  } catch {
    return fallback;
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
