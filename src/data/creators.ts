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

export const creators: Creator[] = [
  {
    id: 'priya-sharma',
    name: 'Priya Sharma',
    handle: '@priyaglow',
    avatar: '/images/avatar-creator-1.jpg',
    niche: 'Beauty',
    followers: 45000,
    engagementRate: 5.2,
    authenticityScore: 88,
    postsPerWeek: 4,
    commentLikeRatio: 0.08,
    verified: true,
    growthCurve: 'smooth',
    location: 'Mumbai',
  },
  {
    id: 'arjun-tech',
    name: 'Arjun Mehta',
    handle: '@techwitharjun',
    avatar: '/images/avatar-creator-2.jpg',
    niche: 'Tech',
    followers: 180000,
    engagementRate: 3.1,
    authenticityScore: 92,
    postsPerWeek: 5,
    commentLikeRatio: 0.12,
    verified: true,
    growthCurve: 'smooth',
    location: 'Bangalore',
  },
  {
    id: 'riya-fitness',
    name: 'Riya Patel',
    handle: '@riyafit',
    avatar: '/images/avatar-creator-3.jpg',
    niche: 'Fitness',
    followers: 320000,
    engagementRate: 2.8,
    authenticityScore: 85,
    postsPerWeek: 6,
    commentLikeRatio: 0.06,
    verified: true,
    growthCurve: 'spiky',
    location: 'Delhi',
  },
  {
    id: 'vikram-food',
    name: 'Vikram Rao',
    handle: '@vikramskitchen',
    avatar: '/images/avatar-creator-4.jpg',
    niche: 'Food',
    followers: 8500,
    engagementRate: 9.1,
    authenticityScore: 94,
    postsPerWeek: 7,
    commentLikeRatio: 0.15,
    verified: false,
    growthCurve: 'smooth',
    location: 'Hyderabad',
  },
  {
    id: 'ananya-fashion',
    name: 'Ananya Gupta',
    handle: '@ananyastyle',
    avatar: '/images/avatar-creator-5.jpg',
    niche: 'Fashion',
    followers: 1500000,
    engagementRate: 0.8,
    authenticityScore: 62,
    postsPerWeek: 3,
    commentLikeRatio: 0.02,
    verified: true,
    growthCurve: 'flat',
    location: 'Mumbai',
  },
  {
    id: 'kabir-travel',
    name: 'Kabir Singh',
    handle: '@kabirwanders',
    avatar: '/images/avatar-creator-6.jpg',
    niche: 'Travel',
    followers: 210000,
    engagementRate: 3.8,
    authenticityScore: 90,
    postsPerWeek: 3,
    commentLikeRatio: 0.10,
    verified: true,
    growthCurve: 'smooth',
    location: 'Goa',
  },
  {
    id: 'meera-finance',
    name: 'Meera Iyer',
    handle: '@meeramoney',
    avatar: '/images/avatar-creator-7.jpg',
    niche: 'Finance',
    followers: 68000,
    engagementRate: 4.5,
    authenticityScore: 96,
    postsPerWeek: 5,
    commentLikeRatio: 0.18,
    verified: true,
    growthCurve: 'smooth',
    location: 'Chennai',
  },
  {
    id: 'rohan-gaming',
    name: 'Rohan Khanna',
    handle: '@rohangaming',
    avatar: '/images/avatar-creator-8.jpg',
    niche: 'Gaming',
    followers: 520000,
    engagementRate: 1.9,
    authenticityScore: 78,
    postsPerWeek: 8,
    commentLikeRatio: 0.05,
    verified: true,
    growthCurve: 'spiky',
    location: 'Delhi',
  },
  {
    id: 'sneha-tech',
    name: 'Sneha Reddy',
    handle: '@snehgadgets',
    avatar: '/images/avatar-creator-9.jpg',
    niche: 'Tech',
    followers: 12000,
    engagementRate: 7.3,
    authenticityScore: 91,
    postsPerWeek: 4,
    commentLikeRatio: 0.14,
    verified: false,
    growthCurve: 'smooth',
    location: 'Bangalore',
  },
  {
    id: 'dev-fitness',
    name: 'Dev Malhotra',
    handle: '@devfitness',
    avatar: '/images/avatar-creator-10.jpg',
    niche: 'Fitness',
    followers: 850000,
    engagementRate: 1.2,
    authenticityScore: 72,
    postsPerWeek: 5,
    commentLikeRatio: 0.03,
    verified: true,
    growthCurve: 'flat',
    location: 'Pune',
  },
  {
    id: 'isha-travel',
    name: 'Isha Banerjee',
    handle: '@ishawanders',
    avatar: '/images/avatar-creator-11.jpg',
    niche: 'Travel',
    followers: 9500,
    engagementRate: 8.6,
    authenticityScore: 89,
    postsPerWeek: 2,
    commentLikeRatio: 0.11,
    verified: false,
    growthCurve: 'smooth',
    location: 'Kolkata',
  },
  {
    id: 'akash-food',
    name: 'Akash Verma',
    handle: '@akashbites',
    avatar: '/images/avatar-creator-12.jpg',
    niche: 'Food',
    followers: 420000,
    engagementRate: 2.2,
    authenticityScore: 87,
    postsPerWeek: 6,
    commentLikeRatio: 0.09,
    verified: true,
    growthCurve: 'spiky',
    location: 'Jaipur',
  },
  {
    id: 'neha-beauty',
    name: 'Neha Kapoor',
    handle: '@nehamakeup',
    avatar: '/images/avatar-creator-1.jpg',
    niche: 'Beauty',
    followers: 750000,
    engagementRate: 1.1,
    authenticityScore: 70,
    postsPerWeek: 4,
    commentLikeRatio: 0.04,
    verified: true,
    growthCurve: 'flat',
    location: 'Delhi',
  },
  {
    id: 'rahul-finance',
    name: 'Rahul Nair',
    handle: '@rahulinvests',
    avatar: '/images/avatar-creator-7.jpg',
    niche: 'Finance',
    followers: 250000,
    engagementRate: 2.6,
    authenticityScore: 93,
    postsPerWeek: 6,
    commentLikeRatio: 0.16,
    verified: true,
    growthCurve: 'smooth',
    location: 'Mumbai',
  },
  {
    id: 'zara-fashion',
    name: 'Zara Siddiqui',
    handle: '@zarathreads',
    avatar: '/images/avatar-creator-5.jpg',
    niche: 'Fashion',
    followers: 28000,
    engagementRate: 6.4,
    authenticityScore: 86,
    postsPerWeek: 5,
    commentLikeRatio: 0.10,
    verified: false,
    growthCurve: 'smooth',
    location: 'Lucknow',
  },
  {
    id: 'aman-gaming',
    name: 'Aman Tiwari',
    handle: '@amanplays',
    avatar: '/images/avatar-creator-8.jpg',
    niche: 'Gaming',
    followers: 1800,
    engagementRate: 11.2,
    authenticityScore: 95,
    postsPerWeek: 10,
    commentLikeRatio: 0.20,
    verified: false,
    growthCurve: 'smooth',
    location: 'Indore',
  },
  {
    id: 'dia-beauty',
    name: 'Dia Chopra',
    handle: '@diaglow',
    avatar: '/images/avatar-creator-1.jpg',
    niche: 'Beauty',
    followers: 580000,
    engagementRate: 1.7,
    authenticityScore: 80,
    postsPerWeek: 4,
    commentLikeRatio: 0.07,
    verified: true,
    growthCurve: 'spiky',
    location: 'Chandigarh',
  },
  {
    id: 'tarun-tech',
    name: 'Tarun Joshi',
    handle: '@taruncodes',
    avatar: '/images/avatar-creator-2.jpg',
    niche: 'Tech',
    followers: 65000,
    engagementRate: 4.8,
    authenticityScore: 89,
    postsPerWeek: 3,
    commentLikeRatio: 0.13,
    verified: true,
    growthCurve: 'smooth',
    location: 'Pune',
  },
];
