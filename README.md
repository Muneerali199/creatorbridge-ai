# CreatorBridge AI

**AI-powered creator intelligence platform** — helping brands discover the right creators and creators find the right brands using ML-driven scoring, real Instagram data, and two-layer fraud detection.

Built for the Indian creator economy.

---

## The Problem

Brands spend crores on influencer campaigns but face three core problems:

1. **No standardized scoring** — Every agency uses different metrics; no unified way to compare creators
2. **Fake engagement is rampant** — Bought likes, comment pods, bot followers inflate metrics by 40-70%
3. **Wrong creator selection** — Brands pick by follower count alone, ignoring niche fit, engagement quality, and authenticity

CreatorBridge AI solves all three with a data-driven, ML-powered platform.

---

## Features

### 1. TrueScore Engine

Multi-factor creator quality score (0-100) combining three weighted dimensions:

| Component | Weight | What it measures |
|---|---|---|
| **Engagement Quality** | 45% | How genuine the engagement rate is vs niche benchmark. Accounts for comment-to-like ratio (high = real audience) |
| **Authenticity** | 40% | Profile completeness, posting consistency, comment-to-like ratio. Penalizes empty bios, zero posts, missing profile pics |
| **Consistency** | 15% | Posting frequency against ideal cadence (7-14 posts/week). Penalizes sporadic posting or over-posting |

**Score tiers:**  
- 80+ → Excellent creator, highly reliable for brand campaigns  
- 60-79 → Good creator, solid choice with room for optimization  
- 40-59 → Average creator, additional verification recommended  
- <40 → Needs improvement, proceed with caution

### 2. FraudShield (Two-Layer Fraud Detection)

**Layer 1 — FraudShield Heuristic:**  
Analyzes engagement-to-follower ratio. Compares actual ratio against niche benchmark. Flags:
- **Low risk** — Ratio meets or exceeds benchmark
- **Medium risk** — Ratio below 50% of benchmark (possible engagement pods)
- **High risk** — Ratio below 25% of benchmark (likely bought followers/bots)

**Layer 2 — ML Model (96% accuracy):**  
Logistic Regression classifier trained on profile-level signals:
- Numeric usernames (highly correlated with bot accounts)
- Missing profile pictures
- Zero posts but thousands of followers
- Extreme follower-to-following ratios
- Abnormal like-to-comment ratios

Both layers combine into a final fraud risk score (0-100).

### 3. ROI Forecast

5-stage campaign funnel model predicting outcomes:

```
Reach (45% of followers) → Engaged (Reach × ER) → 
Clicks (Engaged × 22%) → Conversions (Clicks × niche rate) → 
Revenue (Conversions × niche AOV)
```

**Key metrics calculated:**
- **CPA** (Cost Per Acquisition) = Budget ÷ Conversions
- **ROAS** (Return on Ad Spend) = Revenue ÷ Budget

**Features:**
- Toggle between **Awareness** (higher reach) and **Conversion** (higher CVR) objectives
- Adjust budget slider in real-time
- Niche-specific conversion rates and average order values
- Visual funnel showing drop-off at each stage

### 4. BrandMatch (Creator → Brand)

Reverse discovery — creators find brands that fit their profile.

**Ranking formula:**
- **Niche fit** (70% weight for Nano/Micro creators, 60% for larger):
  - Primary niche match = 100%
  - Secondary niche match = 85%
  - Partial niche overlap = 60%
  - No match = 30%
- **Budget fit** (30% weight for Nano/Micro, 40% for larger):
  - Stepped ratio: suggested fee vs brand minimum budget
  - Suggested fee = (followers / 1000) × ₹700

**15 Indian brands** seeded across niches:
- **Major brands** (₹50K-₹50L budgets): boAt, CRED, Zomato, Nykaa, Dream11, MakeMyTrip, Unacademy, Mamaearth, MyFitness, TheWholeTruth
- **Small brands** (₹3K-₹50K budgets): Internshala, Yoga Bar, Pocket FM, mCaffeine, Smallcase

### 5. Value Calculator

Fair creator pricing based on a transparent formula:

```
Price = (Followers / 1000) × Niche Base Rate × Engagement Multiplier × Authenticity Multiplier
```

**Niche-specific base rates (₹ per 1K followers):**

| Niche | Base Rate |
|---|---|
| Tech | ₹900 |
| Finance | ₹850 |
| Gaming | ₹800 |
| Beauty | ₹750 |
| Fitness | ₹700 |
| Fashion | ₹650 |
| Travel | ₹600 |
| Food | ₹550 |
| Lifestyle | ₹500 |

**Features:**
- Real-time authenticity slider override (affects final price in both preset and custom modes)
- Preset mode: load any searched creator's metrics directly
- Custom mode: enter your own followers, engagement rate, and likes
- Price range (low-high) based on multiplier variance

### 6. Brand Discovery (Brand → Creator)

Brands find their perfect creators:
- Input brand name, industry niche, keywords, and budget
- System computes **niche fit** (keyword matching within the creator's niche) and **budget fit**
- Results ranked by composite match score
- Each creator card links to their real Instagram profile

---

## Pricing

| Plan | Price | Best For | Key Features |
|---|---|---|---|
| **Creator** | ₹49/mo | Individual creators | Personal TrueScore, FraudShield self-check, Value calculator, BrandMatch (10 scans/mo) |
| **Starter** | ₹249/mo | Small brands | 50 creator scans/mo, TrueScore + FraudShield, ROI forecast, Brand Discovery |
| **Pro** | ₹499/mo | Growing brands | Unlimited scans, ML fraud detection, API access (1K calls/mo), priority support |
| **Agency** | ₹999/mo | Agencies & enterprise | Everything in Pro + 5K API calls/mo, white-label reports, team accounts (5 seats), dedicated manager |

Priced in Indian rupees (₹) — built for the Indian creator economy.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18 + Vite + TypeScript + Framer Motion |
| **Backend** | Next.js 14 (App Router API routes) |
| **Database** | Neon PostgreSQL (serverless) |
| **Cache** | Upstash Redis |
| **ORM** | Prisma (schema-first) |
| **ML** | Logistic Regression (scikit-learn), joblib serialization |
| **Data Source** | RapidAPI Instagram Scraper Stable API |
| **Deployment** | Vercel (frontend + backend as separate projects) |
| **Styling** | Tailwind CSS, custom glass-morphism design system |
| **Auth** | None (open-access for demo simplicity) |

---

## Architecture

### How It Works

```
User enters Instagram handle
       ↓
[Landing Page Scan]
       ↓
RapidAPI → Real follower count, profile pic, bio, posts
       ↓
Prisma upsert → DB stored with source="rapidapi"
       ↓
TrueScore Engine computes multi-factor score
FraudShield + ML model analyze fraud risk
       ↓
All 6 features use this enriched data
```

### Data Flow

```
Backend (Next.js on :3000) ← Prisma → Neon PostgreSQL
       ↑                          ↑
  proxy /api/*               Upstash Redis (cache)
       ↑
Frontend (Vite on :5173)
```

### RapidAPI Key Fallback

The system supports automatic fallback across multiple RapidAPI keys. Configure up to 3 keys in `backend/.env`:

```env
RAPIDAPI_KEY="primary-key"
RAPIDAPI_KEY2="first-fallback"
RAPIDAPI_KEY3="second-fallback"
```

If the primary key returns a 429 (rate-limited), the system automatically retries with the next key — no user-facing errors.

### Scoring Pipeline

```
Creator Data
  → Engagement Rate (likes + comments / followers)
  → Tier Benchmark comparison
  → Engagement Quality (0-45)
  → Authenticity Score (profile signals)
  → Authenticity (0-40)
  → Posts/Week vs ideal cadence
  → Consistency (0-15)
                    ↓
           TrueScore (0-100)
                    ↓
  FraudShield heuristic (engagement ratio check)
  ML model prediction (Logistic Regression, 96% acc)
                    ↓
  Final enriched creator profile
```

---

## ML Model Details

**Algorithm:** Logistic Regression (binary classification)  
**Accuracy:** 96%  
**Training data:** Synthetic dataset of 1,000 profiles (500 genuine, 500 fraudulent)  
**Features used:**
- `has_numeric_username` — bots often use auto-generated numeric names
- `has_profile_pic` — fraudulent accounts frequently skip this
- `has_bio` — empty bio is a red flag
- `post_count` — zero posts with many followers = suspicious
- `follower_following_ratio` — extreme ratios indicate bots
- `like_comment_ratio` — abnormal patterns suggest engagement pods

**Model file:** `backend/ml/fraud_model.joblib`  
**Scaling:** StandardScaler fitted on training data

---

## API Endpoints

| Method | Route | Description | Auth |
|---|---|---|---|
| `GET` | `/api/creators` | List creators (search, niche, score filters) | — |
| `GET` | `/api/creators/:id` | Get single creator with scores + fraud analysis | — |
| `POST` | `/api/creators/sync/:username` | Sync Instagram data via RapidAPI | — |
| `POST` | `/api/creators/:id/recompute-score` | Recompute TrueScore + fraud risk | — |
| `GET` | `/api/brands` | List brands (niche, budget filters) | — |
| `POST` | `/api/brands/discover` | Brand→Creator discovery with matching | — |
| `POST` | `/api/roi-forecast` | Campaign ROI prediction | — |
| `POST` | `/api/admin/seed` | Seed 21 verified creator profiles | — |
| `POST` | `/api/admin/seed-brands` | Seed 15 Indian brands | — |
| `POST` | `/api/admin/cleanup` | Remove manually created profiles | — |

**Note:** All endpoints are open (no auth) for hackathon demo purposes. The platform is designed to add authentication via NextAuth or Clerk in production.

---

## Setup

### Prerequisites

- Node.js 18+
- PostgreSQL database (Neon recommended — free tier: 500MB)
- Redis instance (Upstash recommended — free tier: 10MB)
- RapidAPI key for [Instagram Scraper Stable API](https://rapidapi.com/thetechguy32744/api/instagram-scraper-stable-api)

### Environment Variables

Create `backend/.env`:

```env
# Database (Neon PostgreSQL)
DATABASE_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://user:pass@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require"

# Cache (Upstash Redis)
UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
UPSTASH_REDIS_REST_TOKEN="your-token"

# RapidAPI (Instagram Scraper Stable API)
# Supports automatic fallback — if key1 is rate-limited, key2 and key3 are tried automatically
RAPIDAPI_KEY="your-primary-rapidapi-key"
RAPIDAPI_KEY2="your-first-fallback-key"
RAPIDAPI_KEY3="your-second-fallback-key"
```

### Install & Run

```bash
# Clone
git clone https://github.com/your-org/creatorbridge-ai
cd creatorbridge-ai

# Install backend dependencies
cd backend && npm install

# Install frontend dependencies
cd .. && npm install

# Push database schema
cd backend && npx prisma db push

# Seed data
curl -X POST http://localhost:3000/api/admin/seed
curl -X POST http://localhost:3000/api/admin/seed-brands

# Run both servers (concurrently)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend:** http://localhost:3000

The Vite dev server proxies `/api/*` requests to the backend automatically (configured in `vite.config.ts`).

### Seed Data

The system includes **21 verified-real Indian creators** across 10 niches (Tech, Beauty, Fitness, Food, Fashion, Travel, Finance, Gaming, Lifestyle, Education) and **15 Indian brands** (10 major + 5 small).

**Important:** Seed uses `findUnique` + `create` (not `upsert`). Creators already synced via RapidAPI will NOT be overwritten with estimated seed values.

---

## Project Structure

```
creatorbridge-ai/
├── src/                              # Frontend (React + Vite + TypeScript)
│   ├── pages/
│   │   ├── LandingPage.tsx           # Hero, scan input, fluid background
│   │   ├── TrueScorePage.tsx         # Multi-factor creator scoring dashboard
│   │   ├── FraudShieldPage.tsx       # Two-layer fraud detection UI
│   │   ├── ROIForecastPage.tsx       # Campaign funnel + CPA/ROAS calculator
│   │   ├── BrandMatchPage.tsx        # Creator→Brand discovery (reverse)
│   │   ├── ValueCalculatorPage.tsx   # Transparent pricing calculator
│   │   ├── CommerceBridgePage.tsx    # Brand→Creator discovery
│   │   └── PricingPage.tsx           # Pricing plans (₹49-₹999)
│   ├── components/                   # Shared UI components
│   │   ├── DashboardLayout.tsx       # Sidebar + topbar shell
│   │   ├── CircularGauge.tsx         # Animated gauge component
│   │   └── FluidBackground.tsx       # Shader-based animated background
│   ├── lib/
│   │   ├── api.ts                    # API client (fetch wrappers)
│   │   ├── scoring.ts                # TrueScore, FraudShield, brand matching
│   │   ├── useLiveData.ts            # React hook for real-time creator data
│   │   └── SearchContext.tsx          # Global search state
│   └── data/
│       └── creators.ts               # Types, constants, niche benchmarks
├── backend/
│   ├── src/
│   │   ├── app/api/
│   │   │   ├── creators/             # CRUD + sync + recompute
│   │   │   ├── brands/               # List + discover
│   │   │   ├── roi-forecast/         # ROI prediction endpoint
│   │   │   └── admin/                # Seed + cleanup
│   │   └── lib/
│   │       ├── db.ts                 # Prisma client singleton
│   │       ├── instagram.ts          # RapidAPI fetcher with key fallback
│   │       ├── scoring.ts            # Backend scoring logic
│   │       └── ml.ts                 # Logistic Regression fraud model
│   ├── prisma/
│   │   └── schema.prisma             # Database schema (Creator, Brand, Deal, ScoreHistory)
│   ├── ml/
│   │   └── fraud_model.joblib        # Trained ML model
│   └── .env                          # Environment variables (gitignored)
├── package.json                      # Root: concurrently runs frontend + backend
└── vite.config.ts                    # Vite config with API proxy
```

---

## Brand Data

### Major Brands (₹50K-₹50L budgets)

| Brand | Niche | Budget Range |
|---|---|---|
| boAt | Tech, Lifestyle, Fitness | ₹50K — ₹10L |
| CRED | Finance, Tech | ₹2L — ₹50L |
| Zomato | Food, Lifestyle, Tech | ₹50K — ₹5L |
| Nykaa | Beauty, Fashion | ₹1L — ₹20L |
| Dream11 | Gaming, Sports | ₹1L — ₹20L |
| MakeMyTrip | Travel, Lifestyle | ₹1L — ₹10L |
| Unacademy | Education, Tech | ₹50K — ₹5L |
| Mamaearth | Beauty, Lifestyle | ₹50K — ₹3L |
| MyFitness | Fitness, Lifestyle | ₹50K — ₹2L |
| TheWholeTruth | Food, Fitness | ₹50K — ₹2L |

### Small Brands (₹3K-₹50K budgets — perfect for Nano/Micro creators)

| Brand | Niche | Budget Range |
|---|---|---|
| Internshala | Education, Tech | ₹3K — ₹30K |
| Yoga Bar | Fitness, Food | ₹5K — ₹50K |
| Pocket FM | Lifestyle, Entertainment | ₹5K — ₹50K |
| mCaffeine | Beauty, Lifestyle | ₹5K — ₹50K |
| Smallcase | Finance, Tech | ₹10K — ₹1L |

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **No auth required** | Anyone can scan any Instagram handle without signing up. Simplifies demo and judges can test instantly |
| **Seed never overwrites API data** | Uses `findUnique` + `create` instead of `upsert` — prevents clobbering real synced profiles with estimated seed values |
| **BrandMatch weights niche 70/30 for Nano creators** | Small creators can't realistically fit big-brand budgets — focuses on niche compatibility first |
| **DealMatch merged into Brand Discovery** | Both served the same purpose (brands→creators). Brand Discovery kept for flexible keyword input |
| **Two-layer fraud** | Catches complementary signals: heuristics catch engagement anomalies, ML catches profile-level patterns |
| **INR pricing (₹49-₹999)** | Built for Indian creator economy pricing expectations — not a US-dollar conversion |
| **RapidAPI key fallback** | 3-key automatic fallback system ensures demo resilience even when one key is rate-limited |
| **No database for fraud cache** | Fraud scores recomputed on each request to always reflect latest data |
| **Value Calculator slider affects both modes** | Preset mode previously ignored slider state — now authenticity slider updates ₹ amounts in real-time in both preset and custom modes |
| **Landing page scan never blocks** | Failed API sync silently falls through to dashboard — user sees seeded creators instead of an error alert during demo |

---

## Vercel Deployment

### Backend

```bash
cd backend
npx vercel --prod
```

Set environment variables in Vercel dashboard:
- `DATABASE_URL`, `DIRECT_URL`
- `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN`
- `RAPIDAPI_KEY`, `RAPIDAPI_KEY2`, `RAPIDAPI_KEY3`

### Frontend

```bash
cd ..
npx vercel --prod
```

Set environment variable:
- `VITE_API_URL` → your backend Vercel URL (e.g., `https://creatorbridge-api.vercel.app/api`)

---

## Live URLs

- **Frontend:** https://creatorbridge-ai.vercel.app
- **Backend:** https://creatorbridge-ai-adz5.vercel.app

---

## Team

| Name | Role | Responsibilities |
|---|---|---|
| **Muneer Ali** | Lead | Product architecture, ML model training, backend API design, database schema, deployment |
| **Shaurya Pratap** | Developer | Frontend implementation, API integration, UI components, dashboard pages |
| **Mishthi M** | UI/UX | Design system (glass-morphism, color palette), user research, wireframes |

---

Built for CreatorBridge AI 2026.
