import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { query, hsnCode, resultRate, success } = await req.json();

    // Try to get the authenticated user
    const session = await auth();
    const userId = session?.user?.id || null;

    // Log to database (fire-and-forget compatible — this is a POST, so it's fine)
    await prisma.usageLog.create({
      data: {
        query: query || "unknown",
        hsnCode: hsnCode || null,
        resultRate: resultRate != null ? resultRate : null,
        success: success !== false,
        source: "web",
        userId,
      },
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    // Silent fail — logging should never break the lookup flow
    console.error("Usage log error:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
