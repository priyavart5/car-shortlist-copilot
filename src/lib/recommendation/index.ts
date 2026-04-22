import cars from "@/data/cars.json";
import type { Car, CarPreferences, Recommendation, RecommendationResponse } from "@/types/car";
import {
  getBudgetScore,
  getIncludesScore,
  getMatchScore,
  getPriorityScore,
  getSeatingScore,
} from "./score";

const typedCars = cars as Car[];

function getPriorityLabel(preferences: CarPreferences) {
  return preferences.priority.toLowerCase();
}

function getScoreBand(score: number) {
  if (score >= 85) {
    return "excellent";
  }

  if (score >= 70) {
    return "strong";
  }

  if (score >= 55) {
    return "decent";
  }

  return "stretch";
}

function getTradeoff(car: Car, preferences: CarPreferences) {
  if (car.priceLakh > preferences.budgetLakh) {
    return "Slightly above budget, but worth a look if you can stretch.";
  }

  if (car.featuresScore <= 5 && preferences.priority === "Features") {
    return "Feature list is more basic than some rivals.";
  }

  if (car.highwayScore <= 5 && preferences.priority === "Highway trips") {
    return "Better suited for city use than frequent long-distance drives.";
  }

  if (car.cityScore <= 5 && preferences.priority === "City driving") {
    return "Larger footprint may feel less convenient in tight city traffic.";
  }

  return "No major tradeoff for your stated needs, but compare variants before deciding.";
}

function getPriorityStrength(car: Car, preferences: CarPreferences) {
  const value = getPriorityScore(car, preferences.priority);

  if (value >= 0.85) {
    return "stands out";
  }

  if (value >= 0.7) {
    return "looks strong";
  }

  return "still works";
}

function getReasons(car: Car, preferences: CarPreferences, score: number) {
  const reasons: Array<{ label: string; weight: number }> = [];

  const budgetScore = getBudgetScore(car.priceLakh, preferences.budgetLakh);
  if (budgetScore >= 0.9) {
    reasons.push({
      label: `Fits comfortably within your Rs ${preferences.budgetLakh.toFixed(1)}L budget.`,
      weight: 30,
    });
  } else if (budgetScore > 0) {
    reasons.push({
      label: `Only slightly above your budget, so it remains a practical stretch option.`,
      weight: 18,
    });
  }

  if (preferences.bodyType !== "Any" && car.bodyType === preferences.bodyType) {
    reasons.push({
      label: `Matches your ${preferences.bodyType.toLowerCase()} preference.`,
      weight: 15,
    });
  }

  if (preferences.fuelType !== "Any" && car.fuelTypes.includes(preferences.fuelType)) {
    reasons.push({
      label: `Comes with the ${preferences.fuelType.toLowerCase()} option you asked for.`,
      weight: 10,
    });
  }

  if (
    preferences.transmission !== "Any" &&
    car.transmissions.includes(preferences.transmission)
  ) {
    reasons.push({
      label: `Available with ${preferences.transmission.toLowerCase()} transmission.`,
      weight: 10,
    });
  }

  if (car.seating >= preferences.seating) {
    reasons.push({
      label: `Covers your ${preferences.seating}-seat requirement.`,
      weight: car.seating === preferences.seating ? 10 : 8,
    });
  }

  reasons.push({
    label: `${car.name} ${getPriorityStrength(car, preferences)} for ${getPriorityLabel(preferences)}.`,
    weight: 20,
  });

  if (car.tags.includes("family") && preferences.priority === "Family comfort") {
    reasons.push({
      label: "Its profile leans toward family-friendly everyday use.",
      weight: 6,
    });
  }

  if (car.tags.includes("mileage") && preferences.priority === "Mileage") {
    reasons.push({
      label: "Mileage is one of its stronger value points.",
      weight: 6,
    });
  }

  if (car.tags.includes("features") && preferences.priority === "Features") {
    reasons.push({
      label: "Feature richness helps it edge ahead for this use case.",
      weight: 6,
    });
  }

  if (car.tags.includes("value") && preferences.priority === "Value for money") {
    reasons.push({
      label: "It scores well as a sensible value-focused pick.",
      weight: 6,
    });
  }

  return reasons
    .sort((a, b) => b.weight - a.weight)
    .slice(0, score >= 75 ? 3 : 4)
    .map((item) => item.label);
}

function buildDeterministicExplanation(
  car: Car,
  preferences: CarPreferences,
  score: number,
  reasons: string[],
  tradeoff: string,
) {
  const scoreBand = getScoreBand(score);
  const opening =
    scoreBand === "excellent"
      ? `${car.name} is an excellent fit for your shortlist.`
      : scoreBand === "strong"
        ? `${car.name} is a strong match for what you asked for.`
        : scoreBand === "decent"
          ? `${car.name} is a reasonable shortlist option.`
          : `${car.name} is more of a stretch pick than a perfect fit.`;

  const reasonSummary = reasons.slice(0, 2).join(" ");
  return `${opening} It scores ${score}/100 because it aligns well with your ${getPriorityLabel(
    preferences,
  )} focus and core practical filters. ${reasonSummary} Tradeoff: ${tradeoff}`;
}

export function recommendCars(preferences: CarPreferences): RecommendationResponse {
  const matches = typedCars
    .map((car) => {
      const score =
        getBudgetScore(car.priceLakh, preferences.budgetLakh) * 0.3 +
        getMatchScore(car.bodyType, preferences.bodyType) * 0.15 +
        getIncludesScore(car.fuelTypes, preferences.fuelType) * 0.1 +
        getIncludesScore(car.transmissions, preferences.transmission) * 0.1 +
        getSeatingScore(car.seating, preferences.seating) * 0.1 +
        getPriorityScore(car, preferences.priority) * 0.2 +
        (car.tags.includes("family") && preferences.priority === "Family comfort" ? 0.05 : 0) +
        (car.tags.includes("mileage") && preferences.priority === "Mileage" ? 0.05 : 0) +
        (car.tags.includes("features") && preferences.priority === "Features" ? 0.05 : 0) +
        (car.tags.includes("value") && preferences.priority === "Value for money" ? 0.05 : 0);

      const finalScore = Math.round(score * 100);
      const reasons = getReasons(car, preferences, finalScore);
      const tradeoff = getTradeoff(car, preferences);

      return {
        car,
        score: finalScore,
        reasons,
        tradeoff,
        explanation: buildDeterministicExplanation(
          car,
          preferences,
          finalScore,
          reasons,
          tradeoff,
        ),
        explanationSource: "deterministic",
      } satisfies Recommendation;
    })
    .filter((item) => item.score >= 45)
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return {
    summary:
      matches.length > 0
        ? `Top picks based on your budget, seating needs, and ${preferences.priority.toLowerCase()} priority.`
        : "No strong matches found. Try widening the budget or choosing Any for one preference.",
    matches,
    explanationMode: "deterministic",
  };
}
