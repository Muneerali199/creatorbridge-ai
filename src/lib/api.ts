const API_BASE = import.meta.env.VITE_API_URL || "/api";

async function fetchJSON<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${url}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export interface APICreator {
  id: string;
  username: string;
  niche: string;
  followers: number;
  avgLikes: number;
  avgComments: number;
  postsPerWeek: number;
  trueScore: number | null;
  fraudRisk: number | null;
  mlFraudScore: number | null;
  authenticity: number | null;
  profilePic: string | null;
  source: string;
  lastSyncedAt: string | null;
  createdAt: string;
}

export interface APIForecast {
  forecast: {
    reach: number;
    engaged: number;
    clicks: number;
    conversions: number;
    revenue: number;
    cpa: number;
    roas: number;
  };
  summary: {
    revenueLabel: string;
    cpaLabel: string;
    roasLabel: string;
    isProfitable: boolean;
  };
}

export async function getCreators(params?: {
  search?: string;
  niche?: string;
  minScore?: number;
  maxScore?: number;
  limit?: number;
}): Promise<{ creators: APICreator[]; total: number }> {
  const qs = new URLSearchParams();
  if (params?.search) qs.set("search", params.search);
  if (params?.niche) qs.set("niche", params.niche);
  if (params?.minScore !== undefined) qs.set("minScore", String(params.minScore));
  if (params?.maxScore !== undefined) qs.set("maxScore", String(params.maxScore));
  if (params?.limit) qs.set("limit", String(params.limit));
  return fetchJSON(`/creators?${qs.toString()}`);
}

export async function getCreator(id: string): Promise<APICreator & {
  scoreBreakdown: { total: number; engagementQuality: number; authenticity: number; consistency: number };
  fraudAnalysis: { risk: string; ratio: number; reason: string };
  valuation: { basePrice: number; rangeLow: number; rangeHigh: number };
}> {
  return fetchJSON(`/creators/${id}`);
}

export async function recomputeScore(creatorId: string): Promise<{ trueScore: number; fraudRisk: number; mlFraudScore: number; scoreBreakdown: any }> {
  return fetchJSON(`/creators/${creatorId}/recompute-score`, { method: "POST" });
}

export async function forecastROI(data: {
  followers: number;
  engagementRate: number;
  niche: string;
  budget: number;
  objective: "awareness" | "conversion";
}): Promise<APIForecast> {
  return fetchJSON("/roi-forecast", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function syncCreator(username: string): Promise<{ cached: boolean; data: APICreator }> {
  return fetchJSON(`/creators/sync/${encodeURIComponent(username)}`, { method: "POST" });
}

export async function createDeal(data: {
  creatorId: string;
  brandId: string;
  fee?: number;
  deliverables?: string;
}): Promise<{ deal: any }> {
  return fetchJSON("/deals", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
