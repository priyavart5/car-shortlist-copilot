"use client";

import type { RecommendationResponse } from "@/types/car";

interface ResultsPanelProps {
  data: RecommendationResponse | null;
}

export function ResultsPanel({ data }: ResultsPanelProps) {
  if (!data) {
    return (
      <section className="rounded-[28px] border border-dashed border-[var(--border)] bg-white/50 p-6">
        <h2 className="text-xl font-semibold">Your recommendations will show up here</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">
          We&apos;ll return the top matches with a score, reasons, and one quick tradeoff.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm backdrop-blur">
      <div className="mb-5">
        <p className="text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
          Shortlist
        </p>
        <h2 className="mt-2 text-2xl font-semibold">Recommended cars</h2>
        <p className="mt-2 text-sm text-[var(--muted)]">{data.summary}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
          Explanations: {data.explanationMode === "ai" ? "AI-enhanced" : "Deterministic fallback"}
        </p>
      </div>

      <div className="grid gap-4">
        {data.matches.map((match) => (
          <article
            key={match.car.id}
            className="rounded-3xl border border-[var(--border)] bg-white p-5"
          >
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.15em] text-[var(--accent)]">
                  {match.car.brand}
                </p>
                <h3 className="mt-1 text-xl font-semibold">{match.car.name}</h3>
                <p className="mt-1 text-sm text-[var(--muted)]">
                  {match.car.bodyType} • Rs {match.car.priceLakh.toFixed(1)}L • {match.car.seating} seats
                </p>
              </div>
              <div className="rounded-full bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800">
                Match score: {match.score}
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {match.car.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-stone-100 px-3 py-1 text-xs text-stone-700"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="mt-4 grid gap-3 md:grid-cols-[1.6fr_1fr]">
              <div>
                <p className="text-sm font-medium">Why it fits</p>
                <ul className="mt-2 space-y-2 pl-5 text-sm text-[var(--muted)]">
                  {match.reasons.map((reason) => (
                    <li key={reason}>{reason}</li>
                  ))}
                </ul>
              </div>
              <div className="rounded-2xl bg-stone-50 p-4 text-sm text-stone-700">
                <p className="font-medium text-stone-900">Tradeoff</p>
                <p className="mt-2">{match.tradeoff}</p>
              </div>
            </div>

            <div className="mt-4 rounded-2xl bg-emerald-50/70 p-4 text-sm text-emerald-950">
              <p className="font-medium">Recommendation explanation</p>
              <p className="mt-2 leading-6">{match.explanation}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
