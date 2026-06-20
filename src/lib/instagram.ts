import { prisma } from "@/lib/db";

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 86400,
): Promise<T> {
  const { Redis } = await import("@upstash/redis");
  const redis = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  });

  const cached = await redis.get<T>(key);
  if (cached) return cached;

  const fresh = await fetchFn();
  await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

export async function syncCreatorFromInstagram(
  username: string,
): Promise<{ synced: boolean; error?: string }> {
  try {
    const accessToken = process.env.META_APP_ACCESS_TOKEN;
    if (!accessToken) {
      return { synced: false, error: "Instagram API not configured" };
    }

    const GRAPH_API_BASE = "https://graph.facebook.com/v22.0";

    const searchResp = await fetch(
      `${GRAPH_API_BASE}/ig_hashtag_search?user_id=me&q=${username}&access_token=${accessToken}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!searchResp.ok) {
      return { synced: false, error: `Search failed: ${searchResp.status}` };
    }
    const searchData = await searchResp.json();
    if (!searchData.data?.length) {
      return { synced: false, error: `User "${username}" not found` };
    }

    const igBusinessId = searchData.data[0].id;

    const profileResp = await fetch(
      `${GRAPH_API_BASE}/${igBusinessId}?fields=id,username,name,biography,followers_count,media_count&access_token=${accessToken}`,
      { signal: AbortSignal.timeout(10000) },
    );
    if (!profileResp.ok) {
      return { synced: false, error: `Profile fetch failed: ${profileResp.status}` };
    }
    const account = await profileResp.json();
    const followers = account.followers_count ?? 0;

    const mediaResp = await fetch(
      `${GRAPH_API_BASE}/${igBusinessId}/media?fields=like_count,comments_count&limit=20&access_token=${accessToken}`,
      { signal: AbortSignal.timeout(10000) },
    );

    let avgLikes = 0;
    let avgComments = 0;
    let postsPerWeek = 4;

    if (mediaResp.ok) {
      const mediaData = await mediaResp.json();
      const media = mediaData.data ?? [];
      const count = media.length || 1;
      avgLikes = Math.round(media.reduce((s: number, m: { like_count?: number }) => s + (m.like_count || 0), 0) / count);
      avgComments = Math.round(media.reduce((s: number, m: { comments_count?: number }) => s + (m.comments_count || 0), 0) / count);
      postsPerWeek = Math.min(Math.round(count / 4), 20);
    }

    await prisma.creator.upsert({
      where: { username },
      update: {
        instagramId: account.id,
        followers,
        avgLikes,
        avgComments,
        postsPerWeek,
        lastSyncedAt: new Date(),
        source: "business_discovery",
      },
      create: {
        instagramId: account.id,
        username,
        niche: "Lifestyle",
        followers,
        avgLikes,
        avgComments,
        postsPerWeek,
        source: "business_discovery",
        lastSyncedAt: new Date(),
      },
    });

    return { synced: true };
  } catch (error) {
    return {
      synced: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}
