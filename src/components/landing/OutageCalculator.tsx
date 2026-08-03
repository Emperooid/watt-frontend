"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, Fuel, Plug, TrendingDown } from "lucide-react";
import { DurationInput } from "@/components/ui/DurationInput";
import { formatNaira } from "@/lib/format";
import { useDiscos } from "@/lib/useDiscos";
import type { Band } from "@/lib/types";

const BANDS: Band[] = ["A", "B", "C", "D", "E"];

// Rough fuel-efficiency assumption for a small-to-medium petrol generator:
// about 0.4 litres of petrol per kWh actually generated. Real generators
// vary with load and tuning, but this scales with the load you enter
// instead of assuming a fixed generator size regardless of what's running.
const GENERATOR_LITRES_PER_KWH = 0.4;
const GENERATOR_FUEL_PRICE_PER_LITRE = 680;

const LOAD_PRESETS = [
  { label: "Lights + Fan", watts: 150 },
  { label: "+ Fridge", watts: 350 },
  { label: "+ TV", watts: 450 },
  { label: "+ Air Conditioner", watts: 1650 },
];

export function OutageCalculator() {
  const { discos } = useDiscos();
  const [discoId, setDiscoId] = useState<number | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [hours, setHours] = useState<number | "">(10);
  const [loadWatts, setLoadWatts] = useState<number | "">(450);
  const [lossPerHour, setLossPerHour] = useState<number | "">("");

  useEffect(() => {
    if (discoId !== null || discos.length === 0) return;
    const preferred = discos.find((disco) => disco.is_verified) ?? discos[0];
    if (preferred) {
      setDiscoId(preferred.id);
      setBand(preferred.tariff_bands.some((t) => t.band === "B") ? "B" : preferred.tariff_bands[0]?.band ?? null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [discos]);

  const selectedDisco = discos.find((d) => d.id === discoId);
  const rate = Number(selectedDisco?.tariff_bands.find((t) => t.band === band)?.non_md_rate ?? 0);

  const loadKw = loadWatts ? Number(loadWatts) / 1000 : 0;
  const h = hours === "" ? 0 : Number(hours);

  const generatorCost = h * loadKw * GENERATOR_LITRES_PER_KWH * GENERATOR_FUEL_PRICE_PER_LITRE;
  const gridCost = rate ? h * loadKw * rate : null;
  const productionLoss = lossPerHour !== "" ? h * Number(lossPerHour) : null;
  const totalImpact = generatorCost + (productionLoss ?? 0);

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="flex items-center gap-2">
        <AlertTriangle className="h-5 w-5 text-brand" />
        <h3 className="text-base font-semibold">Power Outage Cost Calculator</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        See what an outage actually costs you — generator fuel scaled to your real load, plus lost
        productivity if you run a business.
      </p>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-foreground/60">Hours without power</label>
          <DurationInput hours={hours} onChange={setHours} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60">Load you need to back up (Watts)</label>
          <input
            type="number"
            min={0}
            value={loadWatts}
            onChange={(e) => setLoadWatts(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          />
          <div className="mt-1.5 flex flex-wrap gap-1.5">
            {LOAD_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setLoadWatts(p.watts)}
                className="rounded-full border border-card-border px-2 py-0.5 text-xs text-foreground/60 hover:border-brand/50 hover:text-brand"
              >
                {p.label} ({p.watts}W)
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60">Distribution Company</label>
          <select
            value={discoId ?? ""}
            onChange={(e) => setDiscoId(Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          >
            {discos.map((disco) => (
              <option key={disco.id} value={disco.id}>
                {disco.name} ({disco.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-foreground/60">Band</label>
          <select
            value={band ?? ""}
            onChange={(e) => setBand(e.target.value as Band)}
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          >
            {BANDS.filter((b) => selectedDisco?.tariff_bands.some((t) => t.band === b)).map((b) => (
              <option key={b} value={b}>
                Band {b}
              </option>
            ))}
          </select>
        </div>
        <div className="sm:col-span-2">
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

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-card-border p-3">
          <p className="flex items-center gap-1 text-xs text-foreground/50">
            <Fuel className="h-3.5 w-3.5" /> Backup generator cost
          </p>
          <p className="mt-1 text-lg font-semibold">{formatNaira(generatorCost)}</p>
        </div>
        {gridCost !== null && (
          <div className="rounded-lg border border-card-border p-3">
            <p className="flex items-center gap-1 text-xs text-foreground/50">
              <Plug className="h-3.5 w-3.5" /> Would&apos;ve cost on grid
            </p>
            <p className="mt-1 text-lg font-semibold">{formatNaira(gridCost)}</p>
          </div>
        )}
        {productionLoss !== null && (
          <div className="rounded-lg border border-card-border p-3">
            <p className="flex items-center gap-1 text-xs text-foreground/50">
              <TrendingDown className="h-3.5 w-3.5" /> Production loss
            </p>
            <p className="mt-1 text-lg font-semibold">{formatNaira(productionLoss)}</p>
          </div>
        )}
        <div className="rounded-lg border border-brand/30 bg-brand-light p-3">
          <p className="text-xs text-brand-dark">Total estimated impact</p>
          <p className="mt-1 text-lg font-semibold text-brand-dark">{formatNaira(totalImpact)}</p>
        </div>
      </div>
      <p className="mt-3 text-xs text-foreground/40">
        Generator cost assumes ~{GENERATOR_LITRES_PER_KWH}L of petrol per kWh generated at ₦
        {GENERATOR_FUEL_PRICE_PER_LITRE}/litre, scaled to the load you enter above.
      </p>
    </div>
  );
}
