import crypto from "node:crypto";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { expiresAtFromNow } from "@/lib/mcp-token";

interface StoredToken {
  id: string;
  name: string;
  tokenHash: string;
  createdAt: string;
  expiresAt?: string;
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const tokenId = body.id;
  if (!tokenId || typeof tokenId !== "string") {
    return NextResponse.json({ error: "Token id is required" }, { status: 400 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingTokens: StoredToken[] =
    (user.privateMetadata?.mcpTokens as StoredToken[]) || [];

  const current = existingTokens.find((t) => t.id === tokenId);
  if (!current) {
    return NextResponse.json({ error: "Token not found" }, { status: 404 });
  }

  const rawToken = `aadm_${crypto.randomBytes(32).toString("hex")}`;
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");
  const createdAt = new Date().toISOString();
  const expiresAt = expiresAtFromNow();

  const rotated: StoredToken = {
    id: crypto.randomUUID(),
    name: current.name,
    tokenHash,
    createdAt,
    expiresAt,
  };

  const without = existingTokens.filter((t) => t.id !== tokenId);

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      mcpTokens: [...without, rotated],
    },
  });

  return NextResponse.json({
    token: rawToken,
    id: rotated.id,
    expiresAt: rotated.expiresAt,
  });
}
