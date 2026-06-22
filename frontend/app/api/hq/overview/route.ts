import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/hq-auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const totalLookups = await prisma.usageLog.count({
    where: { userId: user.id },
  });

  const lookupsToday = await prisma.usageLog.count({
    where: {
      userId: user.id,
      createdAt: { gte: todayStart },
    },
  });

  const freeTierLimit = 3;
  const remainingToday = user.tier === "free"
    ? Math.max(0, freeTierLimit - lookupsToday)
    : null;

  const apiKeys = await prisma.apiKey.findMany({
    where: { userId: user.id },
  });

  const lastLookup = await prisma.usageLog.findFirst({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { createdAt: true },
  });

  return NextResponse.json({
    userTier: user.tier,
    totalLookups,
    lookupsToday,
    remainingToday,
    apiKeysCount: apiKeys.length,
    activeKeys: apiKeys.filter((k) => k.active).length,
    itemsCount: 54,
    dataVersion: "GST_2.0_Sept2025",
    lastLookup: lastLookup ? lastLookup.createdAt.toISOString() : null,
  });
}
