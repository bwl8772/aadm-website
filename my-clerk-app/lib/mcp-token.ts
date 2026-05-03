/** AADM MCP access token lifetime from issuance (activation). */
export const MCP_TOKEN_TTL_MS = 365 * 24 * 60 * 60 * 1000;

export function expiresAtFromNow(): string {
  return new Date(Date.now() + MCP_TOKEN_TTL_MS).toISOString();
}

/** Legacy rows may omit `expiresAt`; treat as createdAt + TTL. */
export function resolveExpiresAt(token: { createdAt: string; expiresAt?: string }): string {
  if (token.expiresAt && typeof token.expiresAt === "string" && token.expiresAt.length > 0) {
    return token.expiresAt;
  }
  return new Date(new Date(token.createdAt).getTime() + MCP_TOKEN_TTL_MS).toISOString();
}

export function isTokenExpired(expiresAtIso: string): boolean {
  return new Date(expiresAtIso).getTime() <= Date.now();
}
