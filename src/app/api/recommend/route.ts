import { NextResponse } from "next/server";
import { recommendCars } from "@/lib/recommendation";
import { enrichRecommendationsWithAi } from "@/lib/recommendation/ai";
import type { CarPreferences } from "@/types/car";

export async function POST(request: Request) {
  const preferences = (await request.json()) as Partial<CarPreferences>;

  if (!preferences.budgetLakh || !preferences.seating || !preferences.priority) {
    return NextResponse.json(
      { error: "Missing required preferences." },
      { status: 400 },
    );
  }

  const result = recommendCars(preferences as CarPreferences);
  const enrichedResult = await enrichRecommendationsWithAi(
    preferences as CarPreferences,
    result,
  );
  return NextResponse.json(enrichedResult);
}
