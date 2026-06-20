import { useState, useEffect, useCallback, useRef } from 'react';
import type { Creator, Niche, FollowerTier, GrowthCurve } from '../data/creators';
import { getCreators, getCreator, recomputeScore, syncCreator, type APICreator } from './api';
import { useSearch } from './SearchContext';

export interface EnrichedCreator extends Creator {
  trueScore: number;
  fraudRisk: number;
  mlFraudScore: number;
  scoreBreakdown: {
    total: number;
    engagementQuality: number;
    authenticity: number;
    consistency: number;
  };
  fraudAnalysis: {
    risk: string;
    ratio: number;
    reason: string;
    benchmark: number;
  };
  valuation: {
    basePrice: number;
    rangeLow: number;
    rangeHigh: number;
    engagementMultiplier: number;
    authenticityMultiplier: number;
    nicheRate: number;
  };
}

function mapAPIToCreator(api: APICreator & { scoreBreakdown?: any; fraudAnalysis?: any; valuation?: any }): EnrichedCreator {
  const er = api.avgLikes + api.avgComments > 0
    ? Math.round(((api.avgLikes + api.avgComments) / (api.followers || 1)) * 10000) / 100
    : 0;

  const name = api.username.charAt(0).toUpperCase() + api.username.slice(1).replace(/([A-Z])/g, ' $1').trim();

  return {
    id: api.username,
    name: name,
    handle: `@${api.username}`,
    avatar: api.profilePic || '/images/avatar-creator-1.jpg',
    niche: api.niche as Niche,
    followers: api.followers,
    engagementRate: er,
    authenticityScore: api.authenticity || 70,
    postsPerWeek: api.postsPerWeek,
    commentLikeRatio: Math.round((api.avgComments / (api.avgLikes || 1)) * 100) / 100,
    verified: (api.trueScore || 0) >= 70,
    growthCurve: 'smooth' as GrowthCurve,
    location: 'India',
    trueScore: api.trueScore || 0,
    fraudRisk: api.fraudRisk || 0,
    mlFraudScore: api.mlFraudScore || 0,
    scoreBreakdown: api.scoreBreakdown || {
      total: api.trueScore || 0,
      engagementQuality: 0,
      authenticity: 0,
      consistency: 0,
    },
    fraudAnalysis: api.fraudAnalysis || {
      risk: 'low',
      ratio: 0,
      reason: 'No analysis available',
      benchmark: 0,
    },
    valuation: api.valuation || {
      basePrice: 0,
      rangeLow: 0,
      rangeHigh: 0,
      engagementMultiplier: 0,
      authenticityMultiplier: 0,
      nicheRate: 0,
    },
  };
}

export function useLiveData() {
  const { query } = useSearch();
  const [creators, setCreators] = useState<EnrichedCreator[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();
  const lastSyncedRef = useRef<string>('');

  const fetchWithSearch = useCallback(async (searchQuery: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getCreators({
        search: searchQuery.trim() || undefined,
        limit: 50,
      });

      if (data.creators.length === 0 && searchQuery.trim() && lastSyncedRef.current !== searchQuery.trim()) {
        lastSyncedRef.current = searchQuery.trim();
        setSyncing(true);
        try {
          await syncCreator(searchQuery.trim());
          const retry = await getCreators({ search: searchQuery.trim(), limit: 1 });
          if (retry.creators.length > 0) {
            const detail = await getCreator(retry.creators[0].id);
            setCreators([mapAPIToCreator(detail as any)]);
            setSyncing(false);
            setLoading(false);
            return;
          }
        } catch {
          // sync failed, just show empty
        }
        setSyncing(false);
      }

      const enriched = await Promise.all(
        data.creators.map(async (c) => {
          try {
            const detail = await getCreator(c.id);
            return mapAPIToCreator(detail as any);
          } catch {
            return mapAPIToCreator(c as any);
          }
        })
      );
      setCreators(enriched);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to fetch creators');
    } finally {
      setLoading(false);
      setSyncing(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchWithSearch(query);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, fetchWithSearch]);

  const recompute = useCallback(async (username: string) => {
    try {
      const result = await recomputeScore(username);
      await fetchWithSearch(query);
      return result;
    } catch (e) {
      throw e;
    }
  }, [fetchWithSearch, query]);

  return { creators, loading, syncing, error, refetch: () => fetchWithSearch(query), recompute };
}
