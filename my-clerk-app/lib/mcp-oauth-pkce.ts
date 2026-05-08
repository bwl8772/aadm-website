import { createHash, randomBytes } from "node:crypto";

function base64UrlEncode(buf: Buffer): string {
	return buf
		.toString("base64")
		.replace(/\+/g, "-")
		.replace(/\//g, "_")
		.replace(/=+$/, "");
}

/** RFC 7636 code_verifier (43–128 chars from unreserved set). */
export function generateCodeVerifier(): string {
	return base64UrlEncode(randomBytes(32));
}

export function codeChallengeS256(codeVerifier: string): string {
	const hash = createHash("sha256").update(codeVerifier).digest();
	return base64UrlEncode(hash);
}

export function generateOAuthState(): string {
	return base64UrlEncode(randomBytes(24));
}
