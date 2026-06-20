import { NextRequest, NextResponse } from "next/server";
import { calculateROIForecast } from "@/lib/scoring";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { followers, engagementRate, niche, budget, objective } = body;

    if (!followers || !engagementRate || !niche || !budget) {
      return NextResponse.json(
        { error: "followers, engagementRate, niche, and budget are required" },
        { status: 400 },
      );
    }

    if (objective && !["awareness", "conversion"].includes(objective)) {
      return NextResponse.json(
        { error: 'objective must be "awareness" or "conversion"' },
        { status: 400 },
      );
    }

    const forecast = calculateROIForecast(
      Number(followers),
      Number(engagementRate),
      niche,
      Number(budget),
      objective ?? "conversion",
    );

    return NextResponse.json(
      {
        forecast,
        summary: {
          revenueLabel: `₹${forecast.revenue.toLocaleString("en-IN")}`,
          cpaLabel: `₹${forecast.cpa.toLocaleString("en-IN")}`,
          roasLabel: `${forecast.roas}x`,
          isProfitable: forecast.roas >= 1,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
