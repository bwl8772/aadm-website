/** First 5 characters visible; remainder shown as bullets (OAuth Client IDs are public). */
export function maskMcpOAuthClientId(id: string): string {
	const t = id.trim();
	if (t.length === 0) return "";
	if (t.length <= 5) return t;
	const hidden = t.length - 5;
	const dots = Math.min(hidden, 36);
	return `${t.slice(0, 5)}${"•".repeat(dots)}`;
}
