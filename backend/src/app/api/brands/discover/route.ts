import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  computeEngagementRate,
  calculateDealMatchScore,
  calculateFraudRisk,
  getFollowerTier,
} from "@/lib/scoring";

function computeNicheFit(
  brandNiche: string,
  brandKeywords: string[],
  creatorNiche: string,
  creatorKeywords: string,
): number {
  if (brandNiche && brandNiche === creatorNiche) return 100;

  if (brandKeywords.length > 0 && creatorKeywords) {
    const ck = creatorKeywords.toLowerCase().split(",").map((k) => k.trim());
    const match = brandKeywords.some((bk) =>
      ck.some((ckw) => ckw.includes(bk) || bk.includes(ckw)),
    );
    if (match) return 60;
  }

  if (!brandNiche) return 100;
  return 40;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brandNiche = searchParams.get("niche") || "";
    const brandKeywordsRaw = searchParams.get("keywords") || "";
    const brandKeywords = brandKeywordsRaw
      .split(",")
      .map((k) => k.trim().toLowerCase())
      .filter(Boolean);
    const minBudget = Number(searchParams.get("minBudget")) || 0;
    const maxBudget = Number(searchParams.get("maxBudget")) || 500000;
    const brandName = searchParams.get("brand") || "";
    const search = searchParams.get("search") || "";

    let where: Record<string, unknown> = {};
    if (brandNiche) {
      where.niche = brandNiche;
    }
    if (search) {
      where = {
        OR: [
          { username: { contains: search, mode: "insensitive" } },
          { niche: { contains: search, mode: "insensitive" } },
        ],
      };
    }
    if (brandKeywords.length > 0 && !brandNiche && !search) {
      where = {
        OR: brandKeywords.flatMap((kw) => [
          { niche: { contains: kw, mode: "insensitive" } },
          { keywords: { contains: kw, mode: "insensitive" } },
        ]),
      };
    }

    const creators = await prisma.creator.findMany({
      where,
      orderBy: { followers: "desc" },
      take: 50,
    });

    const results = creators.map((c) => {
      const avgLikes = c.avgLikes || c.followers * 0.02;
      const avgComments = c.avgComments || avgLikes * 0.05;
      const engagementRate = computeEngagementRate(avgLikes, avgComments, c.followers);
      const authenticity = c.authenticity ?? Math.round(Math.min(100, (engagementRate / 5) * 80));

      const nicheFit = computeNicheFit(brandNiche, brandKeywords, c.niche, c.keywords || "");
      const match = calculateDealMatchScore(
        c.followers,
        engagementRate,
        authenticity,
        brandNiche || c.niche,
        c.niche,
        minBudget,
        maxBudget,
      );
      const compositeScore = Math.round(
        match.trueScore * 0.55 + nicheFit * 0.25 + match.budgetFit * 0.2,
      );

      const fraud = calculateFraudRisk(engagementRate, c.followers);
      const tier = getFollowerTier(c.followers);

      return {
        id: c.id,
        username: c.username,
        niche: c.niche,
        keywords: c.keywords || "",
        followers: c.followers,
        avatar: c.profilePic,
        tier,
        engagementRate: Math.round(engagementRate * 100) / 100,
        trueScore: match.trueScore,
        compositeScore: Math.min(compositeScore, 100),
        nicheFit,
        budgetFit: match.budgetFit,
        valueRange: { low: match.creatorValue.rangeLow, high: match.creatorValue.rangeHigh },
        fraudRisk: fraud.risk,
      };
    });

    results.sort((a, b) => b.compositeScore - a.compositeScore);

    return NextResponse.json({
      brandNiche,
      brandName,
      brandKeywords,
      minBudget,
      maxBudget,
      total: results.length,
      creators: results.slice(0, 20),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
