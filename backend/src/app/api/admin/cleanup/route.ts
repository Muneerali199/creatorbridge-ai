import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST() {
  try {
    const result = await prisma.creator.deleteMany({
      where: { source: "manual" },
    });
    return NextResponse.json({ deleted: result.count });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
