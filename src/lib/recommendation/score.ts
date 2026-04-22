import type { Car, CarPreferences, Priority } from "@/types/car";

const priorityScoreMap: Record<Priority, keyof Pick<
  Car,
  | "cityScore"
  | "familyScore"
  | "mileageScore"
  | "featuresScore"
  | "highwayScore"
  | "valueScore"
>> = {
  "City driving": "cityScore",
  "Family comfort": "familyScore",
  Mileage: "mileageScore",
  Features: "featuresScore",
  "Highway trips": "highwayScore",
  "Value for money": "valueScore",
};

const normalizeTenPointScore = (value: number) => value / 10;

export function getBudgetScore(priceLakh: number, budgetLakh: number) {
  if (priceLakh <= budgetLakh) {
    const remainingBudget = budgetLakh - priceLakh;
    return remainingBudget > 2 ? 1 : 0.9;
  }

  const overrun = priceLakh - budgetLakh;
  if (overrun <= 1) {
    return 0.45;
  }

  return 0;
}

export function getMatchScore<T>(carValue: T, userValue: T | "Any") {
  if (userValue === "Any") {
    return 0.6;
  }

  return carValue === userValue ? 1 : 0;
}

export function getIncludesScore<T>(values: T[], userValue: T | "Any") {
  if (userValue === "Any") {
    return 0.6;
  }

  return values.includes(userValue) ? 1 : 0;
}

export function getSeatingScore(carSeating: number, requiredSeating: number) {
  if (carSeating >= requiredSeating) {
    return carSeating === requiredSeating ? 1 : 0.85;
  }

  return 0;
}

export function getPriorityScore(car: Car, priority: Priority) {
  return normalizeTenPointScore(car[priorityScoreMap[priority]]);
}
