import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Redis } from "@upstash/redis";
import {
  calculateTrueScore,
  calculateFraudRisk,
  computeEngagementRate,
} from "@/lib/scoring";
import { computeMLFraudFromInstagram } from "@/lib/mlScore";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function GET() {
  try {
    const authHeader = process.env.CRON_SECRET;
    if (authHeader) {
      const headerValue = "Bearer " + authHeader;
    }

    const creators = await prisma.creator.findMany({
      where: { source: { not: "manual" } },
    });

    const results = [];
    for (const creator of creators) {
      try {
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

        const cacheKey = `instagram:${creator.username.toLowerCase()}`;
        await redis.del(cacheKey);

        await prisma.creator.update({
          where: { id: creator.id },
          data: {
            trueScore: trueScore.total,
            fraudRisk: fraudRiskNum,
            mlFraudScore,
            authenticity: Math.round(authenticity),
            lastSyncedAt: new Date(),
          },
        });

        await prisma.scoreHistory.create({
          data: {
            creatorId: creator.id,
            trueScore: trueScore.total,
            fraudRisk: fraudRiskNum,
          },
        });

        results.push({ username: creator.username, status: "ok", trueScore: trueScore.total });
      } catch (err) {
        results.push({
          username: creator.username,
          status: "error",
          error: err instanceof Error ? err.message : "Unknown",
        });
      }
    }

    return NextResponse.json(
      {
        refreshed: results.length,
        results,
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
