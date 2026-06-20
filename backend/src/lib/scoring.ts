export type FollowerTier = "Nano" | "Micro" | "Mid" | "Macro" | "Mega";
export type RiskLevel = "low" | "moderate" | "high";

export const TIER_BENCHMARKS: Record<FollowerTier, number> = {
  Nano: 8.0,
  Micro: 4.0,
  Mid: 2.5,
  Macro: 1.5,
  Mega: 1.0,
};

export const NICHE_CONVERSION_RATES: Record<string, number> = {
  Beauty: 0.035,
  Tech: 0.021,
  Fitness: 0.042,
  Food: 0.051,
  Fashion: 0.038,
  Travel: 0.025,
  Finance: 0.018,
  Gaming: 0.030,
  Lifestyle: 0.030,
  Education: 0.028,
};

export const NICHE_AOV: Record<string, number> = {
  Beauty: 1200,
  Tech: 15000,
  Fitness: 2500,
  Food: 800,
  Fashion: 3000,
  Travel: 25000,
  Finance: 5000,
  Gaming: 4500,
  Lifestyle: 2000,
  Education: 3000,
};

export const NICHE_BASE_RATES: Record<string, number> = {
  Tech: 900,
  Beauty: 750,
  Fitness: 650,
  Food: 550,
  Fashion: 700,
  Travel: 850,
  Finance: 800,
  Gaming: 600,
  Lifestyle: 700,
  Education: 750,
};

export function getFollowerTier(followers: number): FollowerTier {
  if (followers < 10000) return "Nano";
  if (followers < 100000) return "Micro";
  if (followers < 500000) return "Mid";
  if (followers < 1000000) return "Macro";
  return "Mega";
}

export function computeEngagementRate(
  avgLikes: number,
  avgComments: number,
  followers: number,
): number {
  if (followers === 0) return 0;
  return ((avgLikes + avgComments) / followers) * 100;
}

export interface TrueScoreResult {
  total: number;
  engagementQuality: number;
  authenticity: number;
  consistency: number;
}

export function calculateTrueScore(
  engagementRate: number,
  authenticity: number,
  postsPerWeek: number,
  followers: number,
): TrueScoreResult {
  const tier = getFollowerTier(followers);
  const benchmark = TIER_BENCHMARKS[tier];

  const engagementRatio = engagementRate / benchmark;
  const engagementQuality = Math.min(engagementRatio * 45, 45);

  const authenticityScore = Math.min((authenticity / 100) * 40, 40);

  const idealPostsPerWeek = 5;
  const consistencyRatio = Math.min(postsPerWeek / idealPostsPerWeek, 1.5);
  const consistency = Math.min(consistencyRatio * 15, 15);

  const total = Math.round(engagementQuality + authenticityScore + consistency);

  return {
    total: Math.min(total, 100),
    engagementQuality: Math.round(engagementQuality * 10) / 10,
    authenticity: Math.round(authenticityScore * 10) / 10,
    consistency: Math.round(consistency * 10) / 10,
  };
}

export interface FraudRiskResult {
  risk: RiskLevel;
  ratio: number;
  reason: string;
  benchmark: number;
}

export function calculateFraudRisk(
  engagementRate: number,
  followers: number,
): FraudRiskResult {
  const tier = getFollowerTier(followers);
  const benchmark = TIER_BENCHMARKS[tier];
  const ratio = benchmark > 0 ? engagementRate / benchmark : 0;

  let risk: RiskLevel;
  let reason: string;

  if (ratio >= 0.7 && ratio <= 2.5) {
    risk = "low";
    reason =
      "Engagement pattern aligns with organic growth. No suspicious activity detected.";
  } else if (ratio > 2.5) {
    risk = "moderate";
    reason =
      "Elevated engagement suggests possible pod participation. Review comment quality.";
  } else {
    risk = "high";
    reason =
      "Engagement significantly below benchmark. Possible inactive or purchased follower base.";
  }

  return {
    risk,
    ratio: Math.round(ratio * 100) / 100,
    reason,
    benchmark,
  };
}

export interface ROIForecastResult {
  reach: number;
  engaged: number;
  clicks: number;
  conversions: number;
  revenue: number;
  cpa: number;
  roas: number;
}

export function calculateROIForecast(
  followers: number,
  engagementRate: number,
  niche: string,
  budget: number,
  objective: "awareness" | "conversion",
): ROIForecastResult {
  const reach = Math.round(followers * 0.45);
  const engaged = Math.round(reach * (engagementRate / 100));
  const clicks = Math.round(engaged * 0.22);
  const conversionRate =
    objective === "conversion"
      ? NICHE_CONVERSION_RATES[niche] ?? 0.03
      : (NICHE_CONVERSION_RATES[niche] ?? 0.03) * 0.4;
  const conversions = Math.round(clicks * conversionRate);
  const aov = NICHE_AOV[niche] ?? 2000;
  const revenue = conversions * aov;
  const cpa = conversions > 0 ? Math.round(budget / conversions) : 0;
  const roas = budget > 0 ? Math.round((revenue / budget) * 10) / 10 : 0;

  return {
    reach: Math.max(0, reach),
    engaged: Math.max(0, engaged),
    clicks: Math.max(0, clicks),
    conversions: Math.max(0, conversions),
    revenue: Math.max(0, revenue),
    cpa: Math.max(0, cpa),
    roas: Math.max(0, roas),
  };
}

export interface CreatorValueResult {
  basePrice: number;
  rangeLow: number;
  rangeHigh: number;
  engagementMultiplier: number;
  authenticityMultiplier: number;
  nicheRate: number;
}

export function calculateCreatorValue(
  followers: number,
  engagementRate: number,
  authenticity: number,
  niche: string,
): CreatorValueResult {
  const tier = getFollowerTier(followers);
  const benchmark = TIER_BENCHMARKS[tier];
  const nicheRate = NICHE_BASE_RATES[niche] ?? 700;

  const engagementMultiplier = Math.max(
    0.5,
    Math.min(2.0, engagementRate / benchmark),
  );

  const authenticityMultiplier = 0.7 + (authenticity / 100) * 0.6;

  const basePrice =
    (followers / 1000) * nicheRate * engagementMultiplier * authenticityMultiplier;

  const rangeLow = Math.round(basePrice * 0.85);
  const rangeHigh = Math.round(basePrice * 1.15);

  return {
    basePrice: Math.round(basePrice),
    rangeLow,
    rangeHigh,
    engagementMultiplier: Math.round(engagementMultiplier * 100) / 100,
    authenticityMultiplier: Math.round(authenticityMultiplier * 100) / 100,
    nicheRate,
  };
}

export interface DealMatchResult {
  trueScore: number;
  nicheFit: number;
  budgetFit: number;
  compositeScore: number;
  creatorValue: CreatorValueResult;
}

export function calculateDealMatchScore(
  followers: number,
  engagementRate: number,
  authenticity: number,
  niche: string,
  creatorNiche: string,
  minBudget: number,
  maxBudget: number,
): DealMatchResult {
  const ts = calculateTrueScore(engagementRate, authenticity, 5, followers);
  const cv = calculateCreatorValue(followers, engagementRate, authenticity, niche);

  const nicheFit =
    niche === creatorNiche || !niche ? 100 : 40;

  let budgetFit = 0;
  if (cv.rangeLow >= minBudget && cv.rangeHigh <= maxBudget) {
    budgetFit = 100;
  } else if (cv.basePrice <= maxBudget * 2) {
    const mid = (minBudget + maxBudget) / 2;
    const diff = Math.abs(cv.basePrice - mid);
    budgetFit = Math.max(0, 100 - (diff / Math.max(maxBudget, 1)) * 100);
  }

  const compositeScore = Math.round(
    ts.total * 0.55 + nicheFit * 0.25 + budgetFit * 0.2,
  );

  return {
    trueScore: ts.total,
    nicheFit,
    budgetFit: Math.round(budgetFit),
    compositeScore: Math.min(compositeScore, 100),
    creatorValue: cv,
  };
}

export function getDeliverables(tier: FollowerTier): string {
  switch (tier) {
    case "Nano":
      return "2 Stories + 1 Feed Post";
    case "Micro":
      return "1 Reel + 2 Stories + 1 Feed Post";
    case "Mid":
      return "2 Reels + 3 Stories + 1 Feed Post + 1 IG Live";
    case "Macro":
      return "3 Reels + 5 Stories + 2 Feed Posts + 1 IG Live + 1 YouTube Short";
    case "Mega":
      return "5 Reels + 10 Stories + 3 Feed Posts + 2 IG Lives + 2 YouTube Shorts + Dedicated Video";
  }
}

export function getTimeline(tier: FollowerTier): string {
  switch (tier) {
    case "Nano":
      return "3-day campaign window";
    case "Micro":
      return "7-day campaign window";
    case "Mid":
      return "14-day campaign window";
    case "Macro":
      return "21-day campaign window";
    case "Mega":
      return "30-day campaign window";
  }
}
