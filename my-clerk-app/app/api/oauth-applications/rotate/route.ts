import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import {
	USER_OAUTH_APPS_METADATA_KEY,
	parseUserOAuthAppRefs,
} from "@/lib/user-oauth-apps";

export async function POST(request: Request) {
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

	let rotated;
	try {
		rotated = await client.oauthApplications.rotateSecret(id);
	} catch {
		return NextResponse.json({ error: "Failed to rotate secret" }, { status: 502 });
	}

	if (rotated.isPublic) {
		return NextResponse.json({ error: "Public clients do not use a client secret" }, { status: 400 });
	}

	return NextResponse.json({
		clientId: rotated.clientId,
		clientSecret: rotated.clientSecret ?? "",
	});
}
