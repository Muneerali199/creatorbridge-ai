# CreatorBridge AI

ML-powered creator intelligence platform for Indian brands. Detect fake followers, score creator quality, match brands with the right creators.

## Stack

- **Frontend**: Vite + React + TypeScript (deployed on Vercel)
- **Backend**: Next.js 14 API routes (deployed on Vercel serverless)
- **Database**: Neon PostgreSQL (free tier)
- **Cache**: Upstash Redis (free tier)
- **Data**: RapidAPI Instagram Scraper Stable API

## Quick Start

```bash
# 1. Install dependencies
cd backend && npm install
cd .. && npm install

# 2. Set up environment
cp backend/.env.example backend/.env
# Edit backend/.env with your keys (Neon DB, Upstash Redis, RapidAPI)

# 3. Push schema and seed
cd backend
npx prisma db push
npx tsx prisma/seed.ts

# 4. Start both servers
cd backend && npm run dev    # Port 3000
npm run dev                  # Port 5173 (root)
```

## Deploy to Vercel

### Backend API
1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import GitHub repo
3. Set root directory to `backend/`
4. Add environment variables from `backend/.env.example`
5. Deploy

### Frontend
1. Add a new Vercel project from same repo
2. Root directory: `./` (project root)
3. Framework: Vite
4. Set env var: `VITE_API_URL=https://your-backend.vercel.app`
5. Deploy

## Key Features

- **TrueScore Engine**: AI creator quality score (0-100)
- **FraudShield**: 2-layer bot detection (ML 96% accuracy + engagement heuristic)
- **ROI Forecast**: Funnel-based campaign revenue prediction
- **DealMatch**: AI-ranked brand-creator matching
- **Value Calculator**: Fair pricing based on real metrics
- **Brand Discovery**: Find creators by industry + keywords

## ML Model

LogisticRegression trained on 5,000 Instagram profiles (96% accuracy).
9 features: follower/following ratio, bio length, profile pic, log posts,
log followers, numeric username ratio, numeric username, name words, external URL.
