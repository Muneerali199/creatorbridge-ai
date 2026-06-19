import {
  type Creator,
  type Niche,
  type FollowerTier,
  getFollowerTier,
  TIER_BENCHMARKS,
  NICHE_CONVERSION_RATES,
  NICHE_AOV,
  NICHE_BASE_RATES,
} from '../data/creators';

export interface TrueScoreResult {
  total: number;
  engagementQuality: number;
  authenticity: number;
  consistency: number;
}

export function calculateTrueScore(creator: Creator): TrueScoreResult {
  const tier = getFollowerTier(creator.followers);
  const benchmark = TIER_BENCHMARKS[tier];

  const engagementRatio = creator.engagementRate / benchmark;
  const engagementQuality = Math.min(engagementRatio * 45, 45);

  const authenticity = Math.min((creator.authenticityScore / 100) * 40, 40);

  const idealPostsPerWeek = 5;
  const consistencyRatio = Math.min(creator.postsPerWeek / idealPostsPerWeek, 1.5);
  const consistency = Math.min(consistencyRatio * 15, 15);

  const total = Math.round(engagementQuality + authenticity + consistency);

  return {
    total: Math.min(total, 100),
    engagementQuality: Math.round(engagementQuality * 10) / 10,
    authenticity: Math.round(authenticity * 10) / 10,
    consistency: Math.round(consistency * 10) / 10,
  };
}

export interface FraudRiskResult {
  risk: 'low' | 'moderate' | 'high';
  ratio: number;
  reason: string;
  benchmark: number;
}

export function calculateFraudRisk(creator: Creator): FraudRiskResult {
  const tier = getFollowerTier(creator.followers);
  const benchmark = TIER_BENCHMARKS[tier];
  const ratio = creator.engagementRate / benchmark;

  let risk: 'low' | 'moderate' | 'high';
  let reason: string;

  if (ratio >= 0.7 && ratio <= 2.5) {
    risk = 'low';
    reason = 'Engagement pattern aligns with organic growth. No suspicious activity detected.';
  } else if (ratio > 2.5) {
    risk = 'moderate';
    reason = 'Elevated engagement suggests possible pod participation. Review comment quality.';
  } else {
    risk = 'high';
    reason = 'Engagement significantly below benchmark. Possible inactive or purchased follower base.';
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
  creator: Creator,
  budget: number,
  objective: 'awareness' | 'conversion'
): ROIForecastResult {
  const reach = Math.round(creator.followers * 0.45);
  const engaged = Math.round(reach * (creator.engagementRate / 100));
  const clicks = Math.round(engaged * 0.22);
  const conversionRate =
    objective === 'conversion'
      ? NICHE_CONVERSION_RATES[creator.niche]
      : NICHE_CONVERSION_RATES[creator.niche] * 0.4;
  const conversions = Math.round(clicks * conversionRate);
  const aov = NICHE_AOV[creator.niche];
  const revenue = conversions * aov;
  const cpa = conversions > 0 ? Math.round(budget / conversions) : 0;
  const roas = budget > 0 ? Math.round((revenue / budget) * 10) / 10 : 0;

  return { reach, engaged, clicks, conversions, revenue, cpa, roas };
}

export interface CreatorValueResult {
  basePrice: number;
  rangeLow: number;
  rangeHigh: number;
  engagementMultiplier: number;
  authenticityMultiplier: number;
  nicheRate: number;
}

export function calculateCreatorValue(creator: Creator): CreatorValueResult {
  const tier = getFollowerTier(creator.followers);
  const benchmark = TIER_BENCHMARKS[tier];
  const nicheRate = NICHE_BASE_RATES[creator.niche];

  const engagementMultiplier = Math.max(
    0.5,
    Math.min(2.0, creator.engagementRate / benchmark)
  );

  const authenticityMultiplier = 0.7 + (creator.authenticityScore / 100) * 0.6;

  const basePrice =
    (creator.followers / 1000) *
    nicheRate *
    engagementMultiplier *
    authenticityMultiplier;

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

export interface DealMatchFilters {
  niches: Niche[];
  minBudget: number;
  maxBudget: number;
  tiers: FollowerTier[];
}

export interface DealMatchResult {
  creator: Creator;
  compositeScore: number;
  trueScore: number;
  nicheFit: number;
  budgetFit: number;
}

export function calculateDealMatchScore(
  creator: Creator,
  filters: DealMatchFilters
): DealMatchResult {
  const ts = calculateTrueScore(creator);
  const cv = calculateCreatorValue(creator);

  const nicheFit = filters.niches.length === 0 || filters.niches.includes(creator.niche) ? 100 : 40;

  let budgetFit = 0;
  if (cv.rangeLow >= filters.minBudget && cv.rangeHigh <= filters.maxBudget) {
    budgetFit = 100;
  } else if (cv.basePrice <= filters.maxBudget * 2) {
    const diff = Math.abs(cv.basePrice - (filters.minBudget + filters.maxBudget) / 2);
    budgetFit = Math.max(0, 100 - (diff / filters.maxBudget) * 100);
  }

  const compositeScore = Math.round(
    ts.total * 0.55 + nicheFit * 0.25 + budgetFit * 0.2
  );

  return {
    creator,
    compositeScore: Math.min(compositeScore, 100),
    trueScore: ts.total,
    nicheFit,
    budgetFit: Math.round(budgetFit),
  };
}

export function getDeliverables(tier: FollowerTier): string {
  switch (tier) {
    case 'Nano':
      return '2 Stories + 1 Feed Post';
    case 'Micro':
      return '1 Reel + 2 Stories + 1 Feed Post';
    case 'Mid':
      return '2 Reels + 3 Stories + 1 Feed Post + 1 IG Live';
    case 'Macro':
      return '3 Reels + 5 Stories + 2 Feed Posts + 1 IG Live + 1 YouTube Short';
    case 'Mega':
      return '5 Reels + 10 Stories + 3 Feed Posts + 2 IG Lives + 2 YouTube Shorts + Dedicated Video';
  }
}

export function getTimeline(tier: FollowerTier): string {
  switch (tier) {
    case 'Nano':
      return '3-day campaign window';
    case 'Micro':
      return '7-day campaign window';
    case 'Mid':
      return '14-day campaign window';
    case 'Macro':
      return '21-day campaign window';
    case 'Mega':
      return '30-day campaign window';
  }
}
