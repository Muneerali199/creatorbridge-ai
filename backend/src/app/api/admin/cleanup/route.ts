import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const manual = await prisma.creator.findMany({
      where: { source: "manual" },
      select: { id: true },
    });
    const ids = manual.map((c) => c.id);
    if (ids.length === 0) return NextResponse.json({ deleted: 0 });

    await prisma.scoreHistory.deleteMany({ where: { creatorId: { in: ids } } });
    await prisma.deal.deleteMany({ where: { creatorId: { in: ids } } });
    const result = await prisma.creator.deleteMany({
      where: { source: "manual" },
    });
    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
