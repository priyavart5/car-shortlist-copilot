export type BodyType = "Hatchback" | "Sedan" | "SUV" | "MPV";
export type FuelType = "Petrol" | "Diesel" | "CNG" | "Hybrid" | "Electric";
export type Transmission = "Manual" | "Automatic";
export type Priority =
  | "City driving"
  | "Family comfort"
  | "Mileage"
  | "Features"
  | "Highway trips"
  | "Value for money";

export interface Car {
  id: string;
  name: string;
  brand: string;
  bodyType: BodyType;
  priceLakh: number;
  fuelTypes: FuelType[];
  transmissions: Transmission[];
  seating: number;
  tags: string[];
  cityScore: number;
  familyScore: number;
  mileageScore: number;
  featuresScore: number;
  highwayScore: number;
  valueScore: number;
}

export interface CarPreferences {
  budgetLakh: number;
  bodyType: BodyType | "Any";
  fuelType: FuelType | "Any";
  transmission: Transmission | "Any";
  seating: number;
  priority: Priority;
}

export interface Recommendation {
  car: Car;
  score: number;
  reasons: string[];
  tradeoff: string;
  explanation: string;
  explanationSource: "deterministic" | "ai";
}

export interface RecommendationResponse {
  summary: string;
  matches: Recommendation[];
  explanationMode: "deterministic" | "ai";
}

export interface ShortlistRecord {
  id: string;
  createdAt: string;
  preferences: CarPreferences;
  result: RecommendationResponse;
}
