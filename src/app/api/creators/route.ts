import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const niche = searchParams.get("niche");
    const minScore = searchParams.get("minScore");
    const maxScore = searchParams.get("maxScore");
    const source = searchParams.get("source");
    const limit = Math.min(Number(searchParams.get("limit")) || 50, 100);
    const offset = Number(searchParams.get("offset")) || 0;

    const where: Record<string, unknown> = {};

    if (niche) where.niche = niche;
    if (source) where.source = source;
    if (minScore || maxScore) {
      const scoreFilter: Record<string, number> = {};
      if (minScore) scoreFilter.gte = Number(minScore);
      if (maxScore) scoreFilter.lte = Number(maxScore);
      where.trueScore = scoreFilter;
    }

    const [creators, total] = await Promise.all([
      prisma.creator.findMany({
        where,
        orderBy: { trueScore: "desc" },
        take: limit,
        skip: offset,
      }),
      prisma.creator.count({ where }),
    ]);

    return NextResponse.json({ creators, total, limit, offset }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
