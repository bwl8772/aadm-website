/** Clerk OAuth application ids created by this user (stored in Clerk `privateMetadata`). */
export const USER_OAUTH_APPS_METADATA_KEY = "userOAuthApps";

export interface UserOAuthAppRef {
	id: string;
	name: string;
	createdAt: string;
}

export const MAX_USER_OAUTH_APPS = 10;

export function parseUserOAuthAppRefs(meta: unknown): UserOAuthAppRef[] {
	if (!Array.isArray(meta)) return [];
	return meta.filter(
		(x): x is UserOAuthAppRef =>
			typeof x === "object" &&
			x !== null &&
			typeof (x as UserOAuthAppRef).id === "string" &&
			typeof (x as UserOAuthAppRef).name === "string",
	);
}

export function isValidOAuthRedirectUri(uri: string): boolean {
	try {
		const u = new URL(uri.trim());
		if (u.protocol === "https:") return true;
		if (u.protocol === "http:" && u.hostname === "localhost") return true;
		return false;
	} catch {
		return false;
	}
}
