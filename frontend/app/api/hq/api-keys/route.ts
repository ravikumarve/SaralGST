import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/hq-auth";
import crypto from "crypto";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const keys = await prisma.apiKey.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      key: true,
      label: true,
      tier: true,
      active: true,
      lastUsed: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ keys });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { label, tier } = await req.json();

  // Generate HMAC-like key
  const raw = `${user.id}:${tier || "paid"}:${Date.now()}`;
  const hash = crypto.createHash("sha256").update(raw).digest("hex");
  const apiKey = `sg_${hash.slice(0, 32)}`;

  const key = await prisma.apiKey.create({
    data: {
      key: apiKey,
      label: label || "API Key",
      tier: tier || "paid",
      userId: user.id,
    },
  });

  return NextResponse.json({ key: key.key, id: key.id });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing key id" }, { status: 400 });

  await prisma.apiKey.update({
    where: { id, userId: user.id },
    data: { active: false },
  });

  return NextResponse.json({ success: true });
}
