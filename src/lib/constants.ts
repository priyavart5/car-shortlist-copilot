import type { BodyType, FuelType, Priority, Transmission } from "@/types/car";

export const bodyTypes: Array<BodyType | "Any"> = ["Any", "Hatchback", "Sedan", "SUV", "MPV"];
export const fuelTypes: Array<FuelType | "Any"> = ["Any", "Petrol", "Diesel", "CNG", "Hybrid", "Electric"];
export const transmissions: Array<Transmission | "Any"> = ["Any", "Manual", "Automatic"];
export const priorities: Priority[] = [
  "City driving",
  "Family comfort",
  "Mileage",
  "Features",
  "Highway trips",
  "Value for money",
];
