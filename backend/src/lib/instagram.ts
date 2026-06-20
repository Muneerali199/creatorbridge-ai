import { prisma } from "@/lib/db";

const RAPIDAPI_HOST = "instagram-scraper-stable-api.p.rapidapi.com";

function rapidHeaders(): HeadersInit {
  const key = process.env.RAPIDAPI_KEY;
  if (!key) throw new Error("RAPIDAPI_KEY not configured");
  return {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": key,
  };
}

interface BasicUserData {
  pk: string;
  username: string;
  full_name: string;
  follower_count: number;
  following_count: number;
  media_count: number;
  profile_pic_url: string;
  is_private: boolean;
  is_verified: boolean;
  fbid_v2: string;
}

interface BasicUserPostsResponse {
  user_data: BasicUserData;
  user_posts: Record<string, { node: { media_dict?: { code: string } } }>;
}

interface UserPost {
  like_count: number;
  comment_count: number;
  taken_at: number;
}

interface UserPostNode {
  like_count: number;
  comment_count: number;
  taken_at: number;
}

interface UserPostsResponse {
  posts: Array<{ node: UserPostNode }>;
  pagination_token?: string;
}

export async function fetchBasicUserPosts(username: string): Promise<BasicUserPostsResponse> {
  const url = `https://${RAPIDAPI_HOST}/ig_get_fb_profile_hover.php?username_or_url=${encodeURIComponent(username)}`;
  const resp = await fetch(url, {
    headers: rapidHeaders(),
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) {
    throw new Error(`Basic User + Posts failed: ${resp.status}`);
  }
  return resp.json();
}

export async function fetchUserPosts(username: string): Promise<UserPost[]> {
  const url = `https://${RAPIDAPI_HOST}/get_ig_user_posts.php`;
  const body = new URLSearchParams({
    username_or_url: `https://www.instagram.com/${username}/`,
    pagination_token: "",
    amount: "12",
  });
  const resp = await fetch(url, {
    method: "POST",
    headers: {
      ...rapidHeaders(),
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body,
    signal: AbortSignal.timeout(15000),
  });
  if (!resp.ok) {
    throw new Error(`User Posts failed: ${resp.status}`);
  }
  const data: UserPostsResponse = await resp.json();
  return (data.posts ?? []).map((p) => p.node);
}

async function getRedis() {
  try {
    const { Redis } = await import("@upstash/redis");
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
    return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  } catch { return null; }
}

export async function getCachedOrFetch<T>(
  key: string,
  fetchFn: () => Promise<T>,
  ttlSeconds = 86400,
): Promise<T> {
  const redis = await getRedis();
  if (redis) {
    const cached = await redis.get<T>(key);
    if (cached) return cached;
  }
  const fresh = await fetchFn();
  if (redis) await redis.set(key, fresh, { ex: ttlSeconds });
  return fresh;
}

export async function syncCreatorFromInstagram(
  username: string,
): Promise<{ synced: boolean; error?: string }> {
  try {
    const [profile, posts] = await Promise.all([
      fetchBasicUserPosts(username),
      fetchUserPosts(username),
    ]);

    const { user_data } = profile;
    const count = posts.length || 1;
    const avgLikes = Math.round(posts.reduce((s, p) => s + (p.like_count || 0), 0) / count);
    const avgComments = Math.round(posts.reduce((s, p) => s + (p.comment_count || 0), 0) / count);
    const followers = user_data.follower_count ?? 0;

    const profilePic = user_data.profile_pic_url || null;
    const fullName = user_data.full_name || null;
    const followingCount = user_data.following_count ?? null;
    const mediaCount = user_data.media_count ?? null;

    await prisma.creator.upsert({
      where: { username },
      update: {
        instagramId: user_data.pk,
        followers,
        avgLikes,
        avgComments,
        postsPerWeek: Math.min(Math.round(count / 4), 20),
        profilePic,
        followingCount,
        fullName,
        mediaCount,
        lastSyncedAt: new Date(),
        source: "rapidapi",
      },
      create: {
        instagramId: user_data.pk,
        username,
        niche: "Lifestyle",
        followers,
        avgLikes,
        avgComments,
        postsPerWeek: Math.min(Math.round(count / 4), 20),
        profilePic,
        followingCount,
        fullName,
        mediaCount,
        source: "rapidapi",
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
