# CreatorBridge AI — Backend API

Next.js 14 API routes for the CreatorBridge AI platform.

## Directory Structure

```
backend/
├── prisma/schema.prisma       # Database schema
├── src/
│   ├── app/api/
│   │   ├── auth/[...nextauth]/      # NextAuth Instagram OAuth
│   │   ├── creators/                 # GET list, GET by id
│   │   │   ├── sync/[username]/      # POST sync from Instagram
│   │   │   └── [id]/recompute-score/ # POST recompute scores
│   │   ├── deals/                    # POST create, GET list
│   │   ├── roi-forecast/             # POST calculate forecast
│   │   └── cron/refresh-creators/    # GET daily refresh
│   └── lib/
│       ├── db.ts            # Prisma client singleton
│       ├── scoring.ts       # TrueScore, FraudShield, ROI, etc.
│       ├── mlScore.ts       # ML fake-follower classifier
│       ├── auth.ts          # NextAuth config
│       └── instagram.ts     # Instagram Graph API helpers
├── vercel.json
├── next.config.js
├── package.json
└── .env.example
```

## Free-Tier Stack (verified 2026)

| Service | Tier | Limits | No Credit Card? |
|---------|------|--------|-----------------|
| **Supabase** | Free | 500MB PostgreSQL, unlimited API | ✅ Yes |
| **Upstash Redis** | Free | 256MB, 500K commands/month | ✅ Yes |
| **NextAuth.js** | Open source | Self-hosted, unlimited | ✅ Yes |
| **Vercel** | Hobby | Cron once/day, 100h serverless | ✅ Yes |
| **Prisma** | Open source | Self-hosted | ✅ Yes |

## Setup

```bash
cd backend
cp .env.example .env   # fill in your credentials
npm install
npx prisma db push      # push schema to Supabase
npm run dev             # local dev on :3000
```

## Environment Variables

| Variable | Required | Source |
|----------|----------|--------|
| DATABASE_URL | ✅ | Supabase → Project Settings → Database |
| DIRECT_URL | ✅ | Same, port 5432 (not 6543) |
| UPSTASH_REDIS_REST_URL | ✅ | Upstash Console → Redis → REST API |
| UPSTASH_REDIS_REST_TOKEN | ✅ | Upstash Console → Redis → REST API |
| META_APP_ID | ✅ | Meta Developers → App → Dashboard |
| META_APP_SECRET | ✅ | Meta Developers → App → Settings → Basic |
| META_APP_ACCESS_TOKEN | ✅ | Graph API Explorer → Generate |
| NEXTAUTH_SECRET | ✅ | `openssl rand -base64 32` |
| NEXTAUTH_URL | ✅ | `http://localhost:3000` (dev) |
| CRON_SECRET | Optional | Any random string |

## Deploy to Vercel

1. Push repo to GitHub
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import repo → pick `backend/` as root directory
4. Add all environment variables from `.env.example`
5. Deploy

Vercel Cron will hit `/api/cron/refresh-creators` daily at 3 AM.
