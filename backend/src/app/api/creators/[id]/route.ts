import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  calculateTrueScore,
  calculateFraudRisk,
  calculateCreatorValue,
  getFollowerTier,
  computeEngagementRate,
} from "@/lib/scoring";
import { computeMLFraudFromInstagram } from "@/lib/mlScore";

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const creator = await prisma.creator.findFirst({
      where: {
        OR: [
          { id: params.id },
          { username: params.id },
        ],
      },
      include: {
        scoreHistory: { orderBy: { computedAt: "desc" }, take: 10 },
        deals: { take: 5 },
      },
    });

    if (!creator) {
      return NextResponse.json({ error: "Creator not found" }, { status: 404 });
    }

    const er = computeEngagementRate(
      creator.avgLikes,
      creator.avgComments,
      creator.followers,
    );
    const authenticity = creator.authenticity ?? 50;
    const trueScore = calculateTrueScore(
      er,
      authenticity,
      creator.postsPerWeek,
      creator.followers,
    );
    const fraudRisk = calculateFraudRisk(er, creator.followers);
    const creatorValue = calculateCreatorValue(
      creator.followers,
      er,
      authenticity,
      creator.niche,
    );

    return NextResponse.json(
      {
        ...creator,
        engagementRate: Math.round(er * 100) / 100,
        tier: getFollowerTier(creator.followers),
        scoreBreakdown: trueScore,
        fraudAnalysis: fraudRisk,
        valuation: creatorValue,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
