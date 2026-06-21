import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

const SEED_CREATORS = [
  // ── Tech ──
  { username: "tanaypratap", niche: "Tech", followers: 185000, avgLikes: 5200, avgComments: 380, postsPerWeek: 4, fullName: "Tanay Pratap", keywords: "coding, software, webdev, react, javascript" },
  { username: "akshaymarch7", niche: "Tech", followers: 92000, avgLikes: 3100, avgComments: 210, postsPerWeek: 5, fullName: "Akshay Saini", keywords: "javascript, frontend, react, nodejs, interview" },
  { username: "harkirat1", niche: "Tech", followers: 45000, avgLikes: 1800, avgComments: 140, postsPerWeek: 3, fullName: "Harkirat Singh", keywords: "coding, programming, blockchain, web3, ai" },
  { username: "piyushgargdev", niche: "Tech", followers: 28000, avgLikes: 1200, avgComments: 95, postsPerWeek: 4, fullName: "Piyush Garg", keywords: "backend, nodejs, mongodb, devops, cloud" },
  { username: "lovebabbar", niche: "Tech", followers: 210000, avgLikes: 6800, avgComments: 520, postsPerWeek: 3, fullName: "Love Babbar", keywords: "dsa, cpp, placement, coding, engineering" },
  { username: "devwithjay", niche: "Tech", followers: 3200, avgLikes: 180, avgComments: 25, postsPerWeek: 5, fullName: "Jay Sharma", keywords: "coding, react, tailwind, frontend, ui" },
  { username: "codewithkritika", niche: "Tech", followers: 1800, avgLikes: 110, avgComments: 18, postsPerWeek: 4, fullName: "Kritika Gupta", keywords: "python, django, backend, coding, internship" },
  { username: "hackwitharnav", niche: "Tech", followers: 750, avgLikes: 65, avgComments: 12, postsPerWeek: 3, fullName: "Arnav Mehta", keywords: "cybersecurity, hacking, linux, networking, ctf" },

  // ── Beauty ──
  { username: "kushakapila", niche: "Beauty", followers: 580000, avgLikes: 28000, avgComments: 1800, postsPerWeek: 5, fullName: "Kusha Kapila", keywords: "makeup, skincare, beauty, cosmetics, haircare" },
  { username: "shreya.jainn", niche: "Beauty", followers: 125000, avgLikes: 6500, avgComments: 420, postsPerWeek: 6, fullName: "Shreya Jain", keywords: "makeup, skincare, beauty, foundation, lipstick" },
  { username: "debasreee", niche: "Beauty", followers: 85000, avgLikes: 4100, avgComments: 310, postsPerWeek: 4, fullName: "Debasree Banerjee", keywords: "skincare, beauty, makeup, haircare, wellness" },
  { username: "glowwithria", niche: "Beauty", followers: 5200, avgLikes: 340, avgComments: 45, postsPerWeek: 6, fullName: "Ria Kapoor", keywords: "skincare, makeup, beauty, haircare, diy" },
  { username: "lipstickdiaries", niche: "Beauty", followers: 2800, avgLikes: 190, avgComments: 32, postsPerWeek: 5, fullName: "Priya Sharma", keywords: "lipstick, makeup, beauty, cosmetics, review" },
  { username: "nailsbysimran", niche: "Beauty", followers: 1200, avgLikes: 95, avgComments: 18, postsPerWeek: 4, fullName: "Simran Kaur", keywords: "nailart, nails, beauty, manicure, design" },

  // ── Fashion ──
  { username: "shraddhakapoor", niche: "Fashion", followers: 4200000, avgLikes: 350000, avgComments: 8500, postsPerWeek: 3, fullName: "Shraddha Kapoor", keywords: "fashion, style, clothing, accessories, sneakers" },
  { username: "naz", niche: "Fashion", followers: 650000, avgLikes: 42000, avgComments: 2100, postsPerWeek: 4, fullName: "Naz", keywords: "fashion, clothing, style, shoes, streetwear" },
  { username: "komalpandey", niche: "Fashion", followers: 280000, avgLikes: 15000, avgComments: 980, postsPerWeek: 5, fullName: "Komal Pandey", keywords: "fashion, outfit, style, clothing, accessories" },
  { username: "streetwithaisha", niche: "Fashion", followers: 6800, avgLikes: 420, avgComments: 55, postsPerWeek: 5, fullName: "Aisha Khan", keywords: "streetwear, fashion, style, sneakers, clothing" },
  { username: "thriftwithrahul", niche: "Fashion", followers: 3500, avgLikes: 210, avgComments: 38, postsPerWeek: 4, fullName: "Rahul Verma", keywords: "thrift, fashion, clothing, vintage, style" },
  { username: "sareelove", niche: "Fashion", followers: 1500, avgLikes: 130, avgComments: 22, postsPerWeek: 3, fullName: "Ananya Reddy", keywords: "saree, fashion, ethnic, traditional, clothing" },

  // ── Food ──
  { username: "kabitaschow", niche: "Food", followers: 350000, avgLikes: 18000, avgComments: 1200, postsPerWeek: 6, fullName: "Kabita's Kitchen", keywords: "cooking, recipes, baking, food, indian" },
  { username: "yourfoodlab", niche: "Food", followers: 180000, avgLikes: 9200, avgComments: 680, postsPerWeek: 5, fullName: "Your Food Lab", keywords: "recipes, cooking, baking, fusion, food" },
  { username: "ranveerbrar", niche: "Food", followers: 420000, avgLikes: 22000, avgComments: 1500, postsPerWeek: 4, fullName: "Ranveer Brar", keywords: "cooking, recipes, food, cuisine, chef" },
  { username: "bakewithria", niche: "Food", followers: 9200, avgLikes: 580, avgComments: 72, postsPerWeek: 5, fullName: "Ria Mehra", keywords: "baking, cakes, desserts, recipes, cooking" },
  { username: "chaiwithneha", niche: "Food", followers: 4800, avgLikes: 310, avgComments: 48, postsPerWeek: 4, fullName: "Neha Joshi", keywords: "chai, snacks, food, recipes, indian" },
  { username: "streetfooddelhi", niche: "Food", followers: 2200, avgLikes: 175, avgComments: 30, postsPerWeek: 3, fullName: "Vikram Singh", keywords: "streetfood, delhi, food, chaat, chole" },
  { username: "healthymeals", niche: "Food", followers: 900, avgLikes: 75, avgComments: 15, postsPerWeek: 5, fullName: "Sneha Patel", keywords: "healthy, recipes, salad, mealprep, nutrition" },

  // ── Fitness ──
  { username: "sami__khan", niche: "Fitness", followers: 520000, avgLikes: 25000, avgComments: 1600, postsPerWeek: 5, fullName: "Sami Khan", keywords: "workout, gym, fitness, exercise, nutrition" },
  { username: "yash_bharadwaj", niche: "Fitness", followers: 180000, avgLikes: 8500, avgComments: 620, postsPerWeek: 6, fullName: "Yash Bharadwaj", keywords: "yoga, fitness, health, workout, meditation" },
  { username: "shwetarambani", niche: "Fitness", followers: 95000, avgLikes: 4800, avgComments: 350, postsPerWeek: 4, fullName: "Shweta Rambani", keywords: "fitness, gym, nutrition, weightloss, health" },
  { username: "homefitwithajay", niche: "Fitness", followers: 7200, avgLikes: 450, avgComments: 62, postsPerWeek: 6, fullName: "Ajay Yadav", keywords: "homeworkout, fitness, exercise, bodyweight, health" },
  { username: "yogawithkavya", niche: "Fitness", followers: 3800, avgLikes: 240, avgComments: 42, postsPerWeek: 5, fullName: "Kavya Nair", keywords: "yoga, meditation, fitness, wellness, health" },
  { username: "runwitharjun", niche: "Fitness", followers: 1600, avgLikes: 110, avgComments: 20, postsPerWeek: 4, fullName: "Arjun Singh", keywords: "running, marathon, fitness, cardio, health" },

  // ── Travel ──
  { username: "travelwithneelima", niche: "Travel", followers: 160000, avgLikes: 7800, avgComments: 520, postsPerWeek: 3, fullName: "Neelima Travels", keywords: "travel, vacation, destinations, hotels, wanderlust" },
  { username: "girldiincharge", niche: "Travel", followers: 75000, avgLikes: 3800, avgComments: 280, postsPerWeek: 4, fullName: "Girl in Charge", keywords: "solo travel, adventure, destinations, backpacking" },
  { username: "desiwanderer", niche: "Travel", followers: 5800, avgLikes: 350, avgComments: 48, postsPerWeek: 3, fullName: "Rohit Desai", keywords: "travel, india, backpacking, roadtrip, adventure" },
  { username: "goawithpari", niche: "Travel", followers: 2500, avgLikes: 180, avgComments: 28, postsPerWeek: 4, fullName: "Parvati Menon", keywords: "goa, beach, travel, vacation, party" },
  { username: "himalayanvibes", niche: "Travel", followers: 1100, avgLikes: 85, avgComments: 16, postsPerWeek: 3, fullName: "Aditya Rawat", keywords: "himachal, trekking, mountains, travel, adventure" },

  // ── Finance ──
  { username: "pranjit.bhuyan", niche: "Finance", followers: 220000, avgLikes: 11000, avgComments: 780, postsPerWeek: 3, fullName: "Pranjit Bhuyan", keywords: "investing, stocks, finance, trading, crypto" },
  { username: "tradingwithravi", niche: "Finance", followers: 120000, avgLikes: 5800, avgComments: 410, postsPerWeek: 4, fullName: "Ravi Kumar", keywords: "trading, stocks, nifty, banknifty, options" },
  { username: "savemoneyindia", niche: "Finance", followers: 4500, avgLikes: 280, avgComments: 42, postsPerWeek: 4, fullName: "Nitin Shah", keywords: "savings, money, finance, budget, investing" },
  { username: "cryptowitharav", niche: "Finance", followers: 2100, avgLikes: 145, avgComments: 25, postsPerWeek: 5, fullName: "Arav Bansal", keywords: "crypto, bitcoin, trading, blockchain, web3" },

  // ── Gaming ──
  { username: "carryminati", niche: "Gaming", followers: 5800000, avgLikes: 420000, avgComments: 15000, postsPerWeek: 3, fullName: "CarryMinati", keywords: "gaming, esports, streams, console, pc" },
  { username: "sc0utop", niche: "Gaming", followers: 820000, avgLikes: 52000, avgComments: 3200, postsPerWeek: 4, fullName: "Sc0utOP", keywords: "gaming, bgmi, pubg, esports, streams" },
  { username: "noobtopro", niche: "Gaming", followers: 6200, avgLikes: 380, avgComments: 55, postsPerWeek: 6, fullName: "Karan Rajput", keywords: "gaming, valorant, pc, fps, streams" },
  { username: "mobilegamer", niche: "Gaming", followers: 3400, avgLikes: 210, avgComments: 35, postsPerWeek: 5, fullName: "Rahul Yadav", keywords: "mobilegaming, bgmi, freefire, esports, pubg" },
  { username: "minecraftbuilds", niche: "Gaming", followers: 1400, avgLikes: 95, avgComments: 18, postsPerWeek: 4, fullName: "Arnav Gupta", keywords: "minecraft, gaming, build, creative, server" },

  // ── Education ──
  { username: "studywithaman", niche: "Education", followers: 150000, avgLikes: 7200, avgComments: 480, postsPerWeek: 5, fullName: "Aman Gupta", keywords: "study, upsc, ias, preparation, competitive" },
  { username: "physicswallah", niche: "Education", followers: 4200000, avgLikes: 310000, avgComments: 12000, postsPerWeek: 6, fullName: "Physics Wallah", keywords: "physics, chemistry, jee, neet, education" },
  { username: "mathswithananya", niche: "Education", followers: 4800, avgLikes: 290, avgComments: 45, postsPerWeek: 5, fullName: "Ananya Iyer", keywords: "maths, cbse, class10, class12, boardexam" },
  { username: "englishwithaditi", niche: "Education", followers: 2200, avgLikes: 150, avgComments: 28, postsPerWeek: 4, fullName: "Aditi Sharma", keywords: "english, grammar, spoken, vocabulary, ielts" },
  { username: "cswithkaran", niche: "Education", followers: 900, avgLikes: 65, avgComments: 12, postsPerWeek: 3, fullName: "Karan Mehta", keywords: "computerscience, coding, class12, cbse, python" },

  // ── Lifestyle ──
  { username: "yungfilly", niche: "Lifestyle", followers: 2500000, avgLikes: 95000, avgComments: 4500, postsPerWeek: 4, fullName: "Yung Filly", keywords: "lifestyle, music, entertainment, vlog, personality" },
  { username: "dailyvibes", niche: "Lifestyle", followers: 8500, avgLikes: 520, avgComments: 68, postsPerWeek: 6, fullName: "Isha Kapoor", keywords: "lifestyle, daily, vlog, positivity, motivation" },
  { username: "minimalife", niche: "Lifestyle", followers: 4200, avgLikes: 260, avgComments: 38, postsPerWeek: 4, fullName: "Mira Joshi", keywords: "minimalist, lifestyle, organize, declutter, simple" },
  { username: "hosteldiaries", niche: "Lifestyle", followers: 1800, avgLikes: 120, avgComments: 22, postsPerWeek: 5, fullName: "Aryan Kumar", keywords: "hostel, college, lifestyle, students, mess" },
];

export async function POST() {
  try {
    let created = 0;
    for (const c of SEED_CREATORS) {
      const er = ((c.avgLikes + c.avgComments) / c.followers) * 100;
      await prisma.creator.upsert({
        where: { username: c.username },
        update: {
          niche: c.niche,
          keywords: c.keywords,
          followers: c.followers,
          avgLikes: c.avgLikes,
          avgComments: c.avgComments,
          postsPerWeek: c.postsPerWeek,
          fullName: c.fullName,
          source: "manual",
          authenticity: Math.round(Math.min(100, (er / 4) * 80)),
        },
        create: {
          username: c.username,
          niche: c.niche,
          keywords: c.keywords,
          followers: c.followers,
          avgLikes: c.avgLikes,
          avgComments: c.avgComments,
          postsPerWeek: c.postsPerWeek,
          fullName: c.fullName,
          source: "manual",
          authenticity: Math.round(Math.min(100, (er / 4) * 80)),
        },
      });
      created++;
    }
    return NextResponse.json({ seeded: created });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
