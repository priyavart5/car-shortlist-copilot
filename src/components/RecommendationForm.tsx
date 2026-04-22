"use client";

import { bodyTypes, fuelTypes, priorities, transmissions } from "@/lib/constants";
import type { CarPreferences } from "@/types/car";

interface RecommendationFormProps {
  preferences: CarPreferences;
  onChange: (preferences: CarPreferences) => void;
  onSubmit: () => void;
  loading: boolean;
}

export function RecommendationForm({
  preferences,
  onChange,
  onSubmit,
  loading,
}: RecommendationFormProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm backdrop-blur">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
          Find your shortlist
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Answer a few practical questions</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          Keep it simple. We&apos;ll match you with cars from a local dataset and explain why they fit.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm">
          Budget in lakh
          <input
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            type="number"
            min="4"
            max="50"
            step="0.5"
            value={preferences.budgetLakh}
            onChange={(event) =>
              onChange({ ...preferences, budgetLakh: Number(event.target.value) })
            }
          />
        </label>

        <label className="grid gap-2 text-sm">
          Need at least how many seats?
          <select
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            value={preferences.seating}
            onChange={(event) =>
              onChange({ ...preferences, seating: Number(event.target.value) })
            }
          >
            {[4, 5, 6, 7].map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Body type
          <select
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            value={preferences.bodyType}
            onChange={(event) =>
              onChange({
                ...preferences,
                bodyType: event.target.value as CarPreferences["bodyType"],
              })
            }
          >
            {bodyTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Fuel preference
          <select
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            value={preferences.fuelType}
            onChange={(event) =>
              onChange({
                ...preferences,
                fuelType: event.target.value as CarPreferences["fuelType"],
              })
            }
          >
            {fuelTypes.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Transmission
          <select
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            value={preferences.transmission}
            onChange={(event) =>
              onChange({
                ...preferences,
                transmission: event.target.value as CarPreferences["transmission"],
              })
            }
          >
            {transmissions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2 text-sm">
          Main priority
          <select
            className="rounded-2xl border border-[var(--border)] bg-white px-4 py-3 outline-none"
            value={preferences.priority}
            onChange={(event) =>
              onChange({
                ...preferences,
                priority: event.target.value as CarPreferences["priority"],
              })
            }
          >
            {priorities.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>
      </div>

      <button
        className="mt-6 rounded-full bg-[var(--accent)] px-5 py-3 font-medium text-white transition hover:bg-[var(--accent-strong)] disabled:cursor-not-allowed disabled:opacity-70"
        type="button"
        disabled={loading}
        onClick={onSubmit}
      >
        {loading ? "Finding cars..." : "Get my shortlist"}
      </button>
    </section>
  );
}
