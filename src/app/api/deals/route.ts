import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { calculateDealMatchScore, getFollowerTier } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { creatorId, brandId, fee, deliverables } = body;

    if (!creatorId || !brandId) {
      return NextResponse.json(
        { error: "creatorId and brandId are required" },
        { status: 400 },
      );
    }

    const creator = await prisma.creator.findUnique({
      where: { id: creatorId },
    });
    const brand = await prisma.brand.findUnique({
      where: { id: brandId },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    const [minBudget, maxBudget] = brand.budgetRange
      .split("-")
      .map((s: string) => Number(s.trim()) || 10000);

    const dealFee = fee ?? Math.round(creator.followers / 1000 * 700);
    const defaultDeliverables =
      deliverables ?? `Sponsored posts per ${getFollowerTier(creator.followers)} tier`;

    const deal = await prisma.deal.create({
      data: {
        creatorId,
        brandId,
        status: "drafted",
        fee: dealFee,
        deliverables: defaultDeliverables,
      },
    });

    return NextResponse.json({ deal }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const limit = Math.min(Number(searchParams.get("limit")) || 20, 50);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;

    const deals = await prisma.deal.findMany({
      where,
      include: { creator: true, brand: true },
      orderBy: { createdAt: "desc" },
      take: limit,
    });

    return NextResponse.json({ deals }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
