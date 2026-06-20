import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const GRAPH_API_BASE = "https://graph.facebook.com/v22.0";
const CACHE_TTL = 60 * 60 * 24;
const RATE_LIMIT_TTL = 60;

interface InstagramBusinessAccount {
  id: string;
  username: string;
  name?: string;
  biography?: string;
  followers_count?: number;
  media_count?: number;
  profile_picture_url?: string;
  external_url?: string;
}

interface InstagramMedia {
  like_count: number;
  comments_count: number;
  timestamp: string;
}

async function fetchInstagramAccount(
  username: string,
  accessToken: string,
): Promise<InstagramBusinessAccount> {
  const searchResp = await fetch(
    `${GRAPH_API_BASE}/ig_hashtag_search?user_id=me&q=${username}&access_token=${accessToken}`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!searchResp.ok) {
    throw new Error(`Instagram API search failed: ${searchResp.status}`);
  }
  const searchData = await searchResp.json();
  if (!searchData.data?.length) {
    throw new Error(`Instagram user "${username}" not found`);
  }
  const igBusinessId = searchData.data[0].id;

  const profileResp = await fetch(
    `${GRAPH_API_BASE}/${igBusinessId}?fields=id,username,name,biography,followers_count,media_count,profile_picture_url,external_url&access_token=${accessToken}`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!profileResp.ok) {
    throw new Error(`Instagram profile fetch failed: ${profileResp.status}`);
  }
  return profileResp.json();
}

async function fetchRecentMedia(
  igBusinessId: string,
  accessToken: string,
): Promise<InstagramMedia[]> {
  const mediaResp = await fetch(
    `${GRAPH_API_BASE}/${igBusinessId}/media?fields=like_count,comments_count,timestamp&limit=20&access_token=${accessToken}`,
    { signal: AbortSignal.timeout(10000) },
  );
  if (!mediaResp.ok) {
    throw new Error(`Instagram media fetch failed: ${mediaResp.status}`);
  }
  const mediaData = await mediaResp.json();
  return mediaData.data ?? [];
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;

    const cacheKey = `instagram:${username.toLowerCase()}`;
    const cached = await redis.get(cacheKey);
    if (cached) {
      return NextResponse.json({ cached: true, data: cached }, { status: 200 });
    }

    const rateKey = `ratelimit:instagram:${username.toLowerCase()}`;
    const recent = await redis.get(rateKey);
    if (recent) {
      return NextResponse.json(
        { error: "Rate limited. Try again later." },
        { status: 429 },
      );
    }

    const accessToken = process.env.META_APP_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Instagram API not configured. Set META_APP_ACCESS_TOKEN." },
        { status: 500 },
      );
    }

    const account = await fetchInstagramAccount(username, accessToken);
    const media = await fetchRecentMedia(account.id, accessToken);

    const totalLikes = media.reduce((s, m) => s + (m.like_count || 0), 0);
    const totalComments = media.reduce((s, m) => s + (m.comments_count || 0), 0);
    const count = media.length || 1;
    const avgLikes = Math.round(totalLikes / count);
    const avgComments = Math.round(totalComments / count);
    const followers = account.followers_count ?? 0;

    const creator = await prisma.creator.upsert({
      where: { username },
      update: {
        instagramId: account.id,
        followers,
        avgLikes,
        avgComments,
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
        postsPerWeek: Math.min(Math.round(count / 4), 20),
        source: "business_discovery",
        lastSyncedAt: new Date(),
      },
    });

    await redis.set(cacheKey, creator, { ex: CACHE_TTL });

    return NextResponse.json({ cached: false, data: creator }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
