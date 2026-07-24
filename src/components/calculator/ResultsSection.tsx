"use client";

import { useState } from "react";
import { Lightbulb } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatNaira } from "@/lib/format";
import type { CalculationResult } from "@/lib/types";

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-card-border p-3 sm:p-4">
      <p className="text-xs text-foreground/50">{label}</p>
      <p className="mt-1 text-lg font-semibold">{value}</p>
    </div>
  );
}

export function ResultsSection({ result }: { result: CalculationResult | null }) {
  const [insightIndex, setInsightIndex] = useState(0);

  return (
    <Card id="section-results">
      <h2 className="text-base font-semibold mb-1">5. Results</h2>
      <p className="text-sm text-foreground/60 mb-4">
        Your estimated electricity consumption and cost, based on a {result?.scenario ?? "good"} day.
      </p>

      {!result ? (
        <p className="rounded-lg border border-dashed border-card-border px-4 py-6 text-center text-sm text-foreground/50">
          Your results will appear here once you add appliances.
        </p>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatCard label="Electricity Consumed" value={`${result.totals.daily_kwh.toFixed(2)} kWh`} />
            <StatCard label="Estimated Cost" value={formatNaira(result.totals.daily_cost)} />
            <StatCard label="Estimated Units Used" value={`${result.totals.daily_kwh.toFixed(2)} Units`} />
            <StatCard label="Equivalent Monthly Cost" value={formatNaira(result.totals.monthly_cost)} />
            <StatCard label="Equivalent Yearly Cost" value={formatNaira(result.totals.yearly_cost)} />
          </div>

          {result.insights.length > 0 && (
            <div className="rounded-lg border border-tip-fg/20 bg-tip-bg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 shrink-0 text-tip-fg" />
                <div>
                  <p className="text-sm font-semibold text-tip-fg">Did You Know?</p>
                  <p className="text-sm text-tip-fg/90 mt-1">{result.insights[insightIndex]}</p>
                </div>
              </div>
              {result.insights.length > 1 && (
                <button
                  type="button"
                  onClick={() => setInsightIndex((i) => (i + 1) % result.insights.length)}
                  className="mt-2 text-xs font-medium text-tip-fg underline"
                >
                  Another
                </button>
              )}
            </div>
          )}

          {result.ranking.length > 1 && (
            <div>
              <p className="text-sm font-semibold mb-2">Appliance Ranking — Highest Consumers</p>
              <div className="space-y-2">
                {result.ranking.map((r) => (
                  <div key={r.name}>
                    <div className="flex justify-between text-xs text-foreground/60 mb-1">
                      <span>{r.name}</span>
                      <span>{r.share_pct}%</span>
                    </div>
                    <div className="h-2 w-full rounded-full bg-card-border">
                      <div
                        className="h-2 rounded-full bg-brand"
                        style={{ width: `${r.share_pct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
