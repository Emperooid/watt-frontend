"use client";

import { Card } from "@/components/ui/Card";
import type { Band, Disco } from "@/lib/types";

const BANDS: Band[] = ["A", "B", "C", "D", "E"];

interface DiscoTariffSectionProps {
  discos: Disco[];
  discoId: number | null;
  band: Band | null;
  onDiscoChange: (id: number) => void;
  onBandChange: (band: Band) => void;
}

export function DiscoTariffSection({
  discos,
  discoId,
  band,
  onDiscoChange,
  onBandChange,
}: DiscoTariffSectionProps) {
  const selectedDisco = discos.find((d) => d.id === discoId);
  const selectedTariff = selectedDisco?.tariff_bands.find((t) => t.band === band);

  return (
    <Card id="section-disco-tariff">
      <h2 className="text-base font-semibold mb-1">1. Select your Distribution Company (Disco)</h2>
      <p className="text-sm text-foreground/60 mb-4">
        Your Disco and tariff band determine your rate per kWh.
      </p>

      <select
        value={discoId ?? ""}
        onChange={(e) => onDiscoChange(Number(e.target.value))}
        className="w-full rounded-lg border border-card-border bg-transparent px-3 py-2 text-sm"
      >
        <option value="" disabled>
          Choose a Disco
        </option>
        {discos.map((disco) => (
          <option key={disco.id} value={disco.id}>
            {disco.code} — {disco.name}
          </option>
        ))}
      </select>

      {selectedDisco && (
        <div className="mt-4">
          <p className="text-sm font-medium mb-2">Tariff Band</p>
          <div className="flex flex-wrap gap-2">
            {BANDS.map((b) => {
              const tariff = selectedDisco.tariff_bands.find((t) => t.band === b);
              const isActive = band === b;
              return (
                <button
                  key={b}
                  type="button"
                  disabled={!tariff}
                  onClick={() => onBandChange(b)}
                  className={`rounded-lg border px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "border-brand bg-brand-light text-brand-dark font-medium"
                      : "border-card-border text-foreground/70 hover:border-brand/50"
                  } disabled:cursor-not-allowed disabled:opacity-40`}
                >
                  Band {b}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {selectedTariff && (
        <div className="mt-4 rounded-lg border border-brand/30 bg-brand-light px-4 py-3 text-sm text-brand-dark">
          <span className="font-semibold">You are in Band {selectedTariff.band}</span>
          <br />
          ₦{selectedTariff.rate_per_kwh} per kWh · guaranteed ~{selectedTariff.min_hours_supply}h supply/day
        </div>
      )}
    </Card>
  );
}
