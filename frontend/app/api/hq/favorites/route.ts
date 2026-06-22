import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/hq-auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const favorites = await prisma.favorite.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ favorites });
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { hsnCode, label } = await req.json();
  if (!hsnCode) {
    return NextResponse.json({ error: "Missing hsnCode" }, { status: 400 });
  }

  const favorite = await prisma.favorite.create({
    data: {
      hsnCode,
      label: label || hsnCode,
      userId: user.id,
    },
  });

  return NextResponse.json({ favorite });
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  await prisma.favorite.deleteMany({
    where: { id, userId: user.id },
  });

  return NextResponse.json({ success: true });
}
