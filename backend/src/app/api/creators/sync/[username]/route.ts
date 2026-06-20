import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchBasicUserPosts, fetchUserPosts } from "@/lib/instagram";

const CACHE_TTL = 60 * 60 * 24;

async function getRedis() {
  try {
    const { Redis } = await import("@upstash/redis");
    if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) return null;
    return new Redis({ url: process.env.UPSTASH_REDIS_REST_URL, token: process.env.UPSTASH_REDIS_REST_TOKEN });
  } catch { return null; }
}

export async function POST(
  _req: NextRequest,
  { params }: { params: { username: string } },
) {
  try {
    const { username } = params;
    const redis = await getRedis();

    if (redis) {
      const cacheKey = `instagram:${username.toLowerCase()}`;
      const cached = await redis.get(cacheKey);
      if (cached) {
        return NextResponse.json({ cached: true, data: cached }, { status: 200 });
      }
    }

    if (!process.env.RAPIDAPI_KEY) {
      return NextResponse.json(
        { error: "RAPIDAPI_KEY not configured. Add it to .env" },
        { status: 500 },
      );
    }

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

    const creator = await prisma.creator.upsert({
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

    if (redis) {
      await redis.set(`instagram:${username.toLowerCase()}`, creator, { ex: CACHE_TTL });
    }

    return NextResponse.json({ cached: false, data: creator }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
