import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { mcpOAuthScopes } from "@/lib/mcp-oauth-config";
import {
	MAX_USER_OAUTH_APPS,
	USER_OAUTH_APPS_METADATA_KEY,
	isValidOAuthRedirectUri,
	parseUserOAuthAppRefs,
	type UserOAuthAppRef,
} from "@/lib/user-oauth-apps";

const MAX_REDIRECT_URIS = 16;

function serializeApp(app: {
	id: string;
	name: string;
	clientId: string;
	redirectUris: string[];
	isPublic: boolean;
	scopes: string;
	createdAt: number;
	authorizeUrl: string;
	tokenFetchUrl: string;
	discoveryUrl: string;
}) {
	return {
		id: app.id,
		name: app.name,
		clientId: app.clientId,
		redirectUris: app.redirectUris,
		isPublic: app.isPublic,
		scopes: app.scopes,
		createdAt: app.createdAt,
		authorizeUrl: app.authorizeUrl,
		tokenFetchUrl: app.tokenFetchUrl,
		discoveryUrl: app.discoveryUrl,
	};
}

export async function GET() {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const refs = parseUserOAuthAppRefs(user.privateMetadata?.[USER_OAUTH_APPS_METADATA_KEY]);

	const applications: ReturnType<typeof serializeApp>[] = [];
	const staleIds: string[] = [];

	for (const ref of refs) {
		try {
			const app = await client.oauthApplications.get(ref.id);
			applications.push(serializeApp(app));
		} catch {
			staleIds.push(ref.id);
		}
	}

	if (staleIds.length > 0) {
		const kept = refs.filter((r) => !staleIds.includes(r.id));
		await client.users.updateUserMetadata(userId, {
			privateMetadata: {
				...(typeof user.privateMetadata === "object" && user.privateMetadata !== null
					? (user.privateMetadata as Record<string, unknown>)
					: {}),
				[USER_OAUTH_APPS_METADATA_KEY]: kept,
			},
		});
	}

	return NextResponse.json({ applications });
}

export async function POST(request: Request) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body: unknown = await request.json();
	if (!body || typeof body !== "object") {
		return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
	}

	const nameRaw = (body as { name?: unknown }).name;
	const redirectRaw = (body as { redirectUris?: unknown }).redirectUris;
	const publicRaw = (body as { public?: unknown }).public;

	if (typeof nameRaw !== "string" || !nameRaw.trim()) {
		return NextResponse.json({ error: "Name is required" }, { status: 400 });
	}
	const name = nameRaw.trim();
	if (name.length > 256) {
		return NextResponse.json({ error: "Name must be 256 characters or less" }, { status: 400 });
	}

	let redirectUris: string[] = [];
	if (redirectRaw !== undefined && redirectRaw !== null) {
		if (!Array.isArray(redirectRaw) || !redirectRaw.every((u) => typeof u === "string")) {
			return NextResponse.json({ error: "redirectUris must be an array of strings" }, { status: 400 });
		}
		redirectUris = redirectRaw.map((u) => u.trim()).filter(Boolean);
	}
	if (redirectUris.length > MAX_REDIRECT_URIS) {
		return NextResponse.json(
			{ error: `At most ${MAX_REDIRECT_URIS} redirect URIs allowed` },
			{ status: 400 },
		);
	}
	for (const uri of redirectUris) {
		if (!isValidOAuthRedirectUri(uri)) {
			return NextResponse.json(
				{ error: `Invalid redirect URI (use https or http://localhost): ${uri}` },
				{ status: 400 },
			);
		}
	}

	const isPublic = publicRaw === true;

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const refs = parseUserOAuthAppRefs(user.privateMetadata?.[USER_OAUTH_APPS_METADATA_KEY]);

	if (refs.length >= MAX_USER_OAUTH_APPS) {
		return NextResponse.json(
			{ error: `You can have at most ${MAX_USER_OAUTH_APPS} OAuth applications` },
			{ status: 400 },
		);
	}

	const scopes = mcpOAuthScopes();

	let created;
	try {
		created = await client.oauthApplications.create({
			name,
			redirectUris: redirectUris.length > 0 ? redirectUris : undefined,
			scopes,
			public: isPublic,
		});
	} catch (e: unknown) {
		const msg = e instanceof Error ? e.message : "Clerk rejected OAuth application create";
		return NextResponse.json({ error: msg }, { status: 502 });
	}

	const createdAt = new Date().toISOString();
	const newRef: UserOAuthAppRef = {
		id: created.id,
		name: created.name,
		createdAt,
	};

	await client.users.updateUserMetadata(userId, {
		privateMetadata: {
			...(typeof user.privateMetadata === "object" && user.privateMetadata !== null
				? (user.privateMetadata as Record<string, unknown>)
				: {}),
			[USER_OAUTH_APPS_METADATA_KEY]: [...refs, newRef],
		},
	});

	return NextResponse.json({
		id: created.id,
		clientId: created.clientId,
		clientSecret: created.clientSecret ?? "",
	});
}

export async function DELETE(request: Request) {
	const { userId } = await auth();
	if (!userId) {
		return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
	}

	const body: unknown = await request.json();
	const id = body && typeof body === "object" ? (body as { id?: unknown }).id : undefined;
	if (typeof id !== "string" || !id) {
		return NextResponse.json({ error: "id is required" }, { status: 400 });
	}

	const client = await clerkClient();
	const user = await client.users.getUser(userId);
	const refs = parseUserOAuthAppRefs(user.privateMetadata?.[USER_OAUTH_APPS_METADATA_KEY]);

	if (!refs.some((r) => r.id === id)) {
		return NextResponse.json({ error: "Not found" }, { status: 404 });
	}

	try {
		await client.oauthApplications.delete(id);
	} catch {
		return NextResponse.json({ error: "Failed to delete OAuth application" }, { status: 502 });
	}

	const nextRefs = refs.filter((r) => r.id !== id);
	await client.users.updateUserMetadata(userId, {
		privateMetadata: {
			...(typeof user.privateMetadata === "object" && user.privateMetadata !== null
				? (user.privateMetadata as Record<string, unknown>)
				: {}),
			[USER_OAUTH_APPS_METADATA_KEY]: nextRefs,
		},
	});

	return NextResponse.json({ success: true });
}
