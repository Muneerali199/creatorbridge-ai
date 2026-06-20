import { prisma } from "../src/lib/db";
import { calculateTrueScore, calculateFraudRisk, computeEngagementRate } from "../src/lib/scoring";
import { computeMLFraudFromInstagram } from "../src/lib/mlScore";

const NICHE_KEYWORDS: Record<string, string[]> = {
  Tech: ["engineering", "software", "coding", "programming", "ai", "machine learning", "web dev", "app dev", "gadgets", "electronics", "startup"],
  Beauty: ["cosmetics", "makeup", "skincare", "haircare", "beauty products", "nails", "wellness", "fragrance"],
  Fitness: ["workout", "gym", "exercise", "nutrition", "yoga", "health", "bodybuilding", "wellness"],
  Food: ["cooking", "recipes", "baking", "restaurant", "food review", "cuisine", "kitchen", "street food"],
  Fashion: ["clothing", "shoes", "accessories", "style", "outfits", "sneakers", "luxury", "streetwear", "footwear"],
  Travel: ["vacation", "destinations", "hotels", "backpacking", "adventures", "travel tips", "wanderlust"],
  Finance: ["investing", "stocks", "crypto", "savings", "budgeting", "personal finance", "wealth", "trading"],
  Gaming: ["esports", "streams", "console", "pc gaming", "mobile gaming", "fortnite", "valorant", "minecraft"],
};

const mockCreators = [
  { username: "priyaglow", niche: "Beauty", followers: 45000, avgLikes: 2340, avgComments: 187, postsPerWeek: 4, authenticity: 88 },
  { username: "techwitharjun", niche: "Tech", followers: 180000, avgLikes: 5580, avgComments: 670, postsPerWeek: 5, authenticity: 92 },
  { username: "riyafit", niche: "Fitness", followers: 320000, avgLikes: 8960, avgComments: 538, postsPerWeek: 6, authenticity: 85 },
  { username: "vikramskitchen", niche: "Food", followers: 8500, avgLikes: 774, avgComments: 73, postsPerWeek: 7, authenticity: 94 },
  { username: "ananyastyle", niche: "Fashion", followers: 1500000, avgLikes: 12000, avgComments: 240, postsPerWeek: 3, authenticity: 62 },
  { username: "kabirwanders", niche: "Travel", followers: 210000, avgLikes: 7980, avgComments: 798, postsPerWeek: 3, authenticity: 90 },
  { username: "meeramoney", niche: "Finance", followers: 68000, avgLikes: 3060, avgComments: 612, postsPerWeek: 5, authenticity: 96 },
  { username: "rohangaming", niche: "Gaming", followers: 520000, avgLikes: 9880, avgComments: 520, postsPerWeek: 8, authenticity: 78 },
  { username: "snehgadgets", niche: "Tech", followers: 12000, avgLikes: 876, avgComments: 120, postsPerWeek: 4, authenticity: 91 },
  { username: "devfitness", niche: "Fitness", followers: 850000, avgLikes: 10200, avgComments: 255, postsPerWeek: 5, authenticity: 72 },
  { username: "ishawanders", niche: "Travel", followers: 9500, avgLikes: 817, avgComments: 90, postsPerWeek: 2, authenticity: 89 },
  { username: "akashbites", niche: "Food", followers: 420000, avgLikes: 9240, avgComments: 756, postsPerWeek: 6, authenticity: 87 },
  { username: "nehamakeup", niche: "Beauty", followers: 750000, avgLikes: 8250, avgComments: 300, postsPerWeek: 4, authenticity: 70 },
  { username: "rahulinvests", niche: "Finance", followers: 250000, avgLikes: 6500, avgComments: 975, postsPerWeek: 6, authenticity: 93 },
  { username: "zarathreads", niche: "Fashion", followers: 28000, avgLikes: 1792, avgComments: 280, postsPerWeek: 5, authenticity: 86 },
  { username: "amanplays", niche: "Gaming", followers: 1800, avgLikes: 202, avgComments: 36, postsPerWeek: 10, authenticity: 95 },
  { username: "diaglow", niche: "Beauty", followers: 580000, avgLikes: 9860, avgComments: 406, postsPerWeek: 4, authenticity: 80 },
  { username: "taruncodes", niche: "Tech", followers: 65000, avgLikes: 3120, avgComments: 390, postsPerWeek: 3, authenticity: 89 },
];

async function seed() {
  console.log("🌱 Seeding database with mock creators...\n");

  for (const c of mockCreators) {
    const er = computeEngagementRate(c.avgLikes, c.avgComments, c.followers);
    const trueScore = calculateTrueScore(er, c.authenticity, c.postsPerWeek, c.followers);
    const fraudRisk = calculateFraudRisk(er, c.followers);
    const fraudRiskNum = fraudRisk.risk === "high" ? 2 : fraudRisk.risk === "moderate" ? 1 : 0;
    const mlFraudScore = computeMLFraudFromInstagram(c.followers, Math.round(c.followers * 0.3), "", true, c.avgLikes, c.username, c.username, null);
    const keywords = NICHE_KEYWORDS[c.niche]?.slice(0, 5).join(", ") || "";

    const creator = await prisma.creator.upsert({
      where: { username: c.username },
      update: {
        niche: c.niche,
        followers: c.followers,
        avgLikes: c.avgLikes,
        avgComments: c.avgComments,
        postsPerWeek: c.postsPerWeek,
        authenticity: c.authenticity,
        keywords,
        trueScore: trueScore.total,
        fraudRisk: fraudRiskNum,
        mlFraudScore,
        source: "manual",
        lastSyncedAt: new Date(),
      },
      create: {
        username: c.username,
        niche: c.niche,
        followers: c.followers,
        avgLikes: c.avgLikes,
        avgComments: c.avgComments,
        postsPerWeek: c.postsPerWeek,
        authenticity: c.authenticity,
        keywords,
        trueScore: trueScore.total,
        fraudRisk: fraudRiskNum,
        mlFraudScore,
        source: "manual",
        lastSyncedAt: new Date(),
      },
    });

    await prisma.scoreHistory.create({
      data: {
        creatorId: creator.id,
        trueScore: trueScore.total,
        fraudRisk: fraudRiskNum,
      },
    });

    console.log(`  ✅ ${c.username.padEnd(18)} TrueScore: ${trueScore.total}  Fraud: ${fraudRisk.risk}`);
  }

  const count = await prisma.creator.count();
  console.log(`\n🎉 Done! ${count} creators in database with computed scores.`);
}

seed()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
