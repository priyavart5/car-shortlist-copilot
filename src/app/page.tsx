"use client";

import { useEffect, useState } from "react";
import { RecommendationForm } from "@/components/RecommendationForm";
import { RecentShortlists } from "@/components/RecentShortlists";
import { ResultsPanel } from "@/components/ResultsPanel";
import type { CarPreferences, RecommendationResponse, ShortlistRecord } from "@/types/car";

const defaultPreferences: CarPreferences = {
  budgetLakh: 12,
  bodyType: "SUV",
  fuelType: "Petrol",
  transmission: "Automatic",
  seating: 5,
  priority: "Family comfort",
};

const storageKey = "car-shortlist-history";

function normalizeStoredRecord(record: ShortlistRecord | (Omit<ShortlistRecord, "result"> & { matches: ShortlistRecord["result"]["matches"] })) {
  if ("result" in record) {
    return record;
  }

  return {
    id: record.id,
    createdAt: record.createdAt,
    preferences: record.preferences,
    result: {
      summary: `Restored shortlist based on your ${record.preferences.priority.toLowerCase()} priority.`,
      matches: record.matches,
      explanationMode: record.matches.some((match) => match.explanationSource === "ai")
        ? "ai"
        : "deterministic",
    },
  } satisfies ShortlistRecord;
}

export default function HomePage() {
  const [preferences, setPreferences] = useState<CarPreferences>(defaultPreferences);
  const [result, setResult] = useState<RecommendationResponse | null>(null);
  const [recentShortlists, setRecentShortlists] = useState<ShortlistRecord[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (!stored) {
      return;
    }

    try {
      const parsed = JSON.parse(stored) as Array<
        ShortlistRecord | (Omit<ShortlistRecord, "result"> & { matches: ShortlistRecord["result"]["matches"] })
      >;
      setRecentShortlists(parsed.map(normalizeStoredRecord));
    } catch {
      window.localStorage.removeItem(storageKey);
    }
  }, []);

  async function handleSubmit() {
    setLoading(true);

    try {
      const response = await fetch("/api/recommend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Could not fetch recommendations.");
      }

      const data = (await response.json()) as RecommendationResponse;
      setResult(data);

      const nextHistory: ShortlistRecord[] = [
        {
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          preferences,
          result: data,
        },
        ...recentShortlists,
      ].slice(0, 4);

      setRecentShortlists(nextHistory);
      window.localStorage.setItem(storageKey, JSON.stringify(nextHistory));
    } finally {
      setLoading(false);
    }
  }

  function handleRecentShortlistSelect(record: ShortlistRecord) {
    setPreferences(record.preferences);
    setResult(record.result);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-5 py-8 md:px-8 md:py-12">
      <section className="grid gap-6 rounded-[32px] border border-[var(--border)] bg-[#fffdf8]/90 p-6 shadow-sm md:grid-cols-[1.25fr_0.85fr] md:p-10">
        <div>
          <p className="text-sm uppercase tracking-[0.26em] text-[var(--accent)]">
            Car Shortlist Copilot
          </p>
          <h1 className="mt-4 max-w-2xl text-4xl font-semibold tracking-tight md:text-6xl">
            Help confused car buyers get to a shortlist faster.
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-[var(--muted)]">
            This MVP uses a local JSON dataset and a transparent scoring engine to recommend
            India-relevant cars based on budget, usage, and practical constraints.
          </p>
        </div>

        <div className="rounded-[28px] bg-stone-900 p-6 text-stone-50">
          <p className="text-sm uppercase tracking-[0.22em] text-emerald-300">Why this scope</p>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-stone-300">
            <li>Local JSON dataset with 50+ India-relevant cars</li>
            <li>Backend recommendation logic as the main product value</li>
            <li>Browser-only recent shortlists for a zero-database MVP</li>
            <li>Simple structure that can deploy cleanly to Vercel later</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <RecommendationForm
          preferences={preferences}
          onChange={setPreferences}
          onSubmit={handleSubmit}
          loading={loading}
        />
        <ResultsPanel data={result} />
      </section>

      <RecentShortlists records={recentShortlists} onSelect={handleRecentShortlistSelect} />
    </main>
  );
}
