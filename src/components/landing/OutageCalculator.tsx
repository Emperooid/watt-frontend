"use client";

import { useState } from "react";
import { AlertTriangle, Fuel, TrendingDown } from "lucide-react";
import { formatNaira } from "@/lib/format";

// Same generator assumptions used by the backend's generator-vs-grid
// comparison (calculator/services.py), kept in sync manually since this
// widget doesn't need a backend round-trip for plain arithmetic.
const GENERATOR_FUEL_PRICE_PER_LITRE = 680;
const GENERATOR_LITRES_PER_HOUR = 0.5;

export function OutageCalculator() {
  const [hours, setHours] = useState<number | "">(10);
  const [lossPerHour, setLossPerHour] = useState<number | "">("");

  const generatorCost =
    hours !== "" ? Number(hours) * GENERATOR_LITRES_PER_HOUR * GENERATOR_FUEL_PRICE_PER_LITRE : null;
  const productionLoss = hours !== "" && lossPerHour !== "" ? Number(hours) * Number(lossPerHour) : null;
  const totalImpact =
    generatorCost !== null ? generatorCost + (productionLoss ?? 0) : null;

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-brand" />
        <h3 className="text-base font-semibold">Power Outage Cost Calculator</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        See what an outage actually costs you — backup power, and lost productivity if you run a business.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-foreground/60">Hours without power</label>
          <input
            type="number"
            min={0}
            value={hours}
            onChange={(e) => setHours(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60">
            Estimated loss per hour (₦) <span className="text-foreground/40">— optional, for businesses</span>
          </label>
          <input
            type="number"
            min={0}
            value={lossPerHour}
            onChange={(e) => setLossPerHour(e.target.value === "" ? "" : Number(e.target.value))}
            placeholder="e.g. 4500"
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          />
        </div>
      </div>

      {generatorCost !== null && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-card-border p-3">
            <p className="flex items-center gap-1 text-xs text-foreground/50">
              <Fuel className="h-3.5 w-3.5" /> Backup generator cost
            </p>
            <p className="mt-1 text-lg font-semibold">{formatNaira(generatorCost)}</p>
          </div>
          {productionLoss !== null && (
            <div className="rounded-lg border border-card-border p-3">
              <p className="flex items-center gap-1 text-xs text-foreground/50">
                <TrendingDown className="h-3.5 w-3.5" /> Estimated production loss
              </p>
              <p className="mt-1 text-lg font-semibold">{formatNaira(productionLoss)}</p>
            </div>
          )}
          {totalImpact !== null && (
            <div className="rounded-lg border border-brand/30 bg-brand-light p-3">
              <p className="text-xs text-brand-dark">Total estimated impact</p>
              <p className="mt-1 text-lg font-semibold text-brand-dark">{formatNaira(totalImpact)}</p>
            </div>
          )}
        </div>
      )}
      <p className="mt-3 text-xs text-foreground/40">
        Generator cost assumes ₦{GENERATOR_FUEL_PRICE_PER_LITRE} per litre of petrol and{" "}
        {GENERATOR_LITRES_PER_HOUR}L/h consumption — the same assumption used in the Quick Calculator above.
      </p>
    </div>
  );
}
