import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAuthUser, unauthorized } from "@/lib/hq-auth";

export async function GET() {
  const user = await getAuthUser();
  if (!user) return unauthorized();

  const logs = await prisma.usageLog.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    take: 1000,
  });

  // Aggregate by date
  const dailyMap = new Map<string, number>();
  for (const log of logs) {
    const date = log.createdAt.toISOString().slice(0, 10);
    dailyMap.set(date, (dailyMap.get(date) || 0) + 1);
  }

  const daily = Array.from(dailyMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  return NextResponse.json({
    total: logs.length,
    daily,
  });
}
