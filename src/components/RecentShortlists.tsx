"use client";

import type { ShortlistRecord } from "@/types/car";

interface RecentShortlistsProps {
  records: ShortlistRecord[];
  onSelect: (record: ShortlistRecord) => void;
}

export function RecentShortlists({ records, onSelect }: RecentShortlistsProps) {
  return (
    <section className="rounded-[28px] border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm backdrop-blur">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-[var(--accent)]">
            Local history
          </p>
          <h2 className="mt-2 text-2xl font-semibold">Recent shortlists</h2>
        </div>
        <p className="text-sm text-[var(--muted)]">Stored in your browser only</p>
      </div>

      {records.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--muted)]">
          No recent shortlists yet. Your latest recommendations will appear here.
        </p>
      ) : (
        <div className="mt-4 grid gap-3">
          {records.map((record) => (
            <button
              key={record.id}
              className="rounded-2xl border border-[var(--border)] bg-white p-4 text-left transition hover:border-[var(--accent)] hover:shadow-sm"
              type="button"
              onClick={() => onSelect(record)}
            >
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-medium">
                    Rs {record.preferences.budgetLakh.toFixed(1)}L • {record.preferences.bodyType} •{" "}
                    {record.preferences.priority}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted)]">
                    Top picks: {record.result.matches.map((match) => match.car.name).join(", ")}
                  </p>
                </div>
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--muted)]">
                  {new Date(record.createdAt).toLocaleString()}
                </p>
              </div>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
