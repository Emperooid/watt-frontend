"use client";

import { Card } from "@/components/ui/Card";
import { formatNaira } from "@/lib/format";
import type { CalculationResult } from "@/lib/types";

interface ReviewSectionProps {
  result: CalculationResult | null;
  loading: boolean;
  error: string | null;
}

export function ReviewSection({ result, loading, error }: ReviewSectionProps) {
  return (
    <Card id="section-review">
      <h2 className="text-base font-semibold mb-1">4. Review</h2>
      <p className="text-sm text-foreground/60 mb-4">
        Double-check your setup before looking at the full breakdown.
      </p>

      {error && <p className="text-sm text-red-500">{error}</p>}
      {!error && loading && <p className="text-sm text-foreground/50">Calculating…</p>}
      {!error && !loading && !result && (
        <p className="rounded-lg border border-dashed border-card-border px-4 py-6 text-center text-sm text-foreground/50">
          Add at least one appliance to see your review.
        </p>
      )}

      {!error && result && (
        <div className="overflow-x-auto">
          <table className="w-full min-w-96 text-sm">
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="pb-2 font-medium">Appliance</th>
                <th className="pb-2 font-medium">kWh/day</th>
                <th className="pb-2 font-medium text-right">Cost/day</th>
              </tr>
            </thead>
            <tbody>
              {result.items.map((item) => (
                <tr key={item.name} className="border-t border-card-border">
                  <td className="py-2 pr-2">
                    {item.name} × {item.quantity}
                  </td>
                  <td className="py-2 pr-2">{item.kwh_per_day.toFixed(2)}</td>
                  <td className="py-2 text-right">{formatNaira(item.cost_per_day)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-card-border font-medium">
                <td className="py-2 pr-2">Total</td>
                <td className="py-2 pr-2">{result.totals.daily_kwh.toFixed(2)}</td>
                <td className="py-2 text-right">{formatNaira(result.totals.daily_cost)}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      )}
    </Card>
  );
}
