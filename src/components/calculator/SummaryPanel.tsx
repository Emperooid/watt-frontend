"use client";

import { useState } from "react";
import { ArrowRight, CloudRain, Info, Sun } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { formatNaira } from "@/lib/format";
import type { CalculationResult, Scenario } from "@/lib/types";

interface SummaryPanelProps {
  scenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  result: CalculationResult | null;
  loading: boolean;
  error: string | null;
}

export function SummaryPanel({ scenario, onScenarioChange, result, loading, error }: SummaryPanelProps) {
  const [showBreakdown, setShowBreakdown] = useState(false);

  return (
    <aside className="w-full lg:w-72 shrink-0 space-y-3 sm:space-y-4">
      <Card>
        <h3 className="text-sm font-semibold mb-3">Your Estimation Summary</h3>

        <p className="text-xs text-foreground/50 mb-1">Scenario</p>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => onScenarioChange("good")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-sm ${
              scenario === "good"
                ? "border-brand bg-brand-light text-brand-dark font-medium"
                : "border-card-border text-foreground/60"
            }`}
          >
            <Sun className="h-4 w-4" />
            Good Day
          </button>
          <button
            type="button"
            onClick={() => onScenarioChange("bad")}
            className={`flex flex-1 items-center justify-center gap-1 rounded-lg border py-2 text-sm ${
              scenario === "bad"
                ? "border-brand bg-brand-light text-brand-dark font-medium"
                : "border-card-border text-foreground/60"
            }`}
          >
            <CloudRain className="h-4 w-4" />
            Bad Day
          </button>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        {!error && (
          <div className="space-y-3">
            <div>
              <p className="text-xs text-foreground/50">Total Daily Consumption</p>
              <p className="text-xl font-semibold text-brand">
                {loading ? "…" : `${(result?.totals.daily_kwh ?? 0).toFixed(2)} kWh`}
              </p>
            </div>
            <div className="border-t border-card-border pt-3">
              <p className="text-xs text-foreground/50">Estimated Monthly Consumption</p>
              <p className="text-base font-medium">
                {loading ? "…" : `${(result?.totals.monthly_kwh ?? 0).toFixed(2)} kWh`}
              </p>
            </div>
            <div className="border-t border-card-border pt-3">
              <p className="text-xs text-foreground/50">Estimated Monthly Cost</p>
              <p className="text-base font-medium">
                {loading ? "…" : formatNaira(result?.totals.monthly_cost ?? 0)}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex items-start gap-2 rounded-lg bg-tip-bg p-3 text-xs text-tip-fg">
          <Info className="h-4 w-4 shrink-0" />
          This is an estimate. Actual bills may vary based on meter type, fees, and other charges.
        </div>

        <button
          type="button"
          onClick={() => setShowBreakdown((v) => !v)}
          disabled={!result}
          className="mt-3 w-full rounded-lg border border-card-border py-2 text-sm font-medium disabled:opacity-40"
        >
          {showBreakdown ? "Hide Cost Breakdown" : "View Cost Breakdown"}
        </button>

        {showBreakdown && result && (
          <ul className="mt-3 space-y-1 text-xs">
            {result.items.map((item) => (
              <li key={item.name} className="flex justify-between border-t border-card-border py-1">
                <span>{item.name}</span>
                <span>{formatNaira(item.cost_per_day)}/day</span>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="bg-info-bg border-info-fg/20">
        <div className="flex items-start gap-2 text-sm text-info-fg">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <p className="font-medium">What&apos;s next?</p>
            <p className="mt-1 text-info-fg/80">
              Compare good day vs bad day or adjust your usage pattern to see how it affects your bill.
            </p>
            <button
              type="button"
              onClick={() =>
                document
                  .getElementById("section-usage-pattern")
                  ?.scrollIntoView({ behavior: "smooth", block: "start" })
              }
              className="mt-2 flex items-center gap-1 text-sm font-medium text-info-fg"
            >
              Go to Usage Pattern <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </aside>
  );
}
