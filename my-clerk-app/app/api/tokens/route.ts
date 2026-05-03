import crypto from "node:crypto";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { expiresAtFromNow, isTokenExpired, resolveExpiresAt } from "@/lib/mcp-token";

interface StoredToken {
  id: string;
  name: string;
  tokenHash: string;
  createdAt: string;
  expiresAt?: string;
}

export async function GET() {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const tokens: StoredToken[] =
    (user.privateMetadata?.mcpTokens as StoredToken[]) || [];

  return NextResponse.json({
    tokens: tokens.map((t) => {
      const expiresAt = resolveExpiresAt(t);
      return {
        id: t.id,
        name: t.name,
        token: `***${t.tokenHash.slice(-6)}`,
        createdAt: t.createdAt,
        expiresAt,
        expired: isTokenExpired(expiresAt),
      };
    }),
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const name = body.name;
  if (!name || typeof name !== "string") {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const rawToken = `aadm_${crypto.randomBytes(32).toString("hex")}`;
  const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingTokens: StoredToken[] =
    (user.privateMetadata?.mcpTokens as StoredToken[]) || [];

  const createdAt = new Date().toISOString();
  const expiresAt = expiresAtFromNow();

  const newToken: StoredToken = {
    id: crypto.randomUUID(),
    name,
    tokenHash,
    createdAt,
    expiresAt,
  };

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      mcpTokens: [...existingTokens, newToken],
    },
  });

  return NextResponse.json({
    token: rawToken,
    id: newToken.id,
    expiresAt: newToken.expiresAt,
  });
}

export async function DELETE(request: Request) {
  const { userId } = await auth();
  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const tokenId = body.id;
  if (!tokenId) {
    return NextResponse.json({ error: "Token ID is required" }, { status: 400 });
  }

  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  const existingTokens: StoredToken[] =
    (user.privateMetadata?.mcpTokens as StoredToken[]) || [];

  const updatedTokens = existingTokens.filter((t) => t.id !== tokenId);

  await client.users.updateUserMetadata(userId, {
    privateMetadata: {
      mcpTokens: updatedTokens,
    },
  });

  return NextResponse.json({ success: true });
}
