import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/hq-auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const history = await prisma.usageLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      query: true,
      hsnCode: true,
      resultRate: true,
      success: true,
      source: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ history });
}
