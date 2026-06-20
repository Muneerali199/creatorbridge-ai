import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  calculateTrueScore,
  calculateFraudRisk,
  computeEngagementRate,
} from "@/lib/scoring";
import { computeMLFraudFromInstagram } from "@/lib/mlScore";

export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const creator = await prisma.creator.findUnique({
      where: { id: params.id },
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

    const fraudRiskNum =
      fraudRisk.risk === "high" ? 2 : fraudRisk.risk === "moderate" ? 1 : 0;

    const mlFraudScore = computeMLFraudFromInstagram(
      creator.followers,
      Math.round(creator.followers * 0.3),
      "",
      true,
      creator.avgLikes,
      creator.username,
      creator.username,
      null,
    );

    const [updated] = await Promise.all([
      prisma.creator.update({
        where: { id: params.id },
        data: {
          trueScore: trueScore.total,
          fraudRisk: fraudRiskNum,
          mlFraudScore,
          authenticity: Math.round(authenticity),
        },
      }),
      prisma.scoreHistory.create({
        data: {
          creatorId: params.id,
          trueScore: trueScore.total,
          fraudRisk: fraudRiskNum,
        },
      }),
    ]);

    return NextResponse.json(
      {
        ...updated,
        scoreBreakdown: trueScore,
        fraudAnalysis: fraudRisk,
        mlFraudScore,
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
