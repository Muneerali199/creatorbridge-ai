export type Niche = 'Tech' | 'Beauty' | 'Fitness' | 'Food' | 'Fashion' | 'Travel' | 'Finance' | 'Gaming';

export const allNiches: Niche[] = ['Tech', 'Beauty', 'Fitness', 'Food', 'Fashion', 'Travel', 'Finance', 'Gaming'];
export type FollowerTier = 'Nano' | 'Micro' | 'Mid' | 'Macro' | 'Mega';
export type GrowthCurve = 'smooth' | 'spiky' | 'flat';

export interface Creator {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  niche: Niche;
  followers: number;
  engagementRate: number;
  authenticityScore: number;
  postsPerWeek: number;
  commentLikeRatio: number;
  verified: boolean;
  growthCurve: GrowthCurve;
  location: string;
}

export const NICHE_CONVERSION_RATES: Record<Niche, number> = {
  Beauty: 0.035,
  Tech: 0.021,
  Fitness: 0.042,
  Food: 0.051,
  Fashion: 0.038,
  Travel: 0.025,
  Finance: 0.018,
  Gaming: 0.030,
};

export const NICHE_AOV: Record<Niche, number> = {
  Beauty: 1200,
  Tech: 15000,
  Fitness: 2500,
  Food: 800,
  Fashion: 3000,
  Travel: 25000,
  Finance: 5000,
  Gaming: 4500,
};

export const NICHE_BASE_RATES: Record<Niche, number> = {
  Tech: 900,
  Beauty: 750,
  Fitness: 650,
  Food: 550,
  Fashion: 700,
  Travel: 850,
  Finance: 800,
  Gaming: 600,
};

export const TIER_BENCHMARKS: Record<FollowerTier, number> = {
  Nano: 8.0,
  Micro: 4.0,
  Mid: 2.5,
  Macro: 1.5,
  Mega: 1.0,
};

export function getFollowerTier(followers: number): FollowerTier {
  if (followers < 10000) return 'Nano';
  if (followers < 100000) return 'Micro';
  if (followers < 500000) return 'Mid';
  if (followers < 1000000) return 'Macro';
  return 'Mega';
}

export function formatFollowers(count: number): string {
  if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
  if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
  return count.toString();
}

export function formatINR(amount: number): string {
  if (amount >= 100000) return '₹' + (amount / 100000).toFixed(1) + 'L';
  if (amount >= 1000) return '₹' + (amount / 1000).toFixed(1) + 'K';
  return '₹' + amount.toFixed(0);
}


