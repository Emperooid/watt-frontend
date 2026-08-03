"use client";

import { useEffect, useState } from "react";
import { CalendarDays, Coins, Wallet, Zap } from "lucide-react";
import { formatKwh, formatNaira } from "@/lib/format";
import { useDiscos } from "@/lib/useDiscos";
import type { Band } from "@/lib/types";

const BANDS: Band[] = ["A", "B", "C", "D", "E"];
type Mode = "have-money" | "need-days";

export function RechargeCalculator() {
  const { discos } = useDiscos();
  const [discoId, setDiscoId] = useState<number | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [mode, setMode] = useState<Mode>("have-money");
  const [amount, setAmount] = useState<number | "">(20000);
  const [days, setDays] = useState<number | "">(14);
  const [avgDailyKwh, setAvgDailyKwh] = useState<number | "">(5);

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
  const selectedTariff = selectedDisco?.tariff_bands.find((t) => t.band === band);
  const rate = selectedTariff ? Number(selectedTariff.non_md_rate) : null;

  let units: number | null = null;
  let resultDays: number | null = null;
  let resultCost: number | null = null;

  if (rate && rate > 0) {
    if (mode === "have-money" && amount) {
      units = Number(amount) / rate;
      if (avgDailyKwh) resultDays = units / Number(avgDailyKwh);
    } else if (mode === "need-days" && days && avgDailyKwh) {
      units = Number(days) * Number(avgDailyKwh);
      resultCost = units * rate;
    }
  }

  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-5">
      <div className="flex items-center gap-2">
        <Wallet className="h-5 w-5 text-brand" />
        <h3 className="text-base font-semibold">Recharge &amp; Budget Calculator</h3>
      </div>
      <p className="mt-1 text-sm text-foreground/60">
        Work out how many units your money buys, or how much to recharge for the days you need.
      </p>

      <div className="mt-4 flex gap-2 rounded-lg border border-card-border p-1 text-sm">
        <button
          type="button"
          onClick={() => setMode("have-money")}
          className={`flex-1 rounded-md py-1.5 ${
            mode === "have-money" ? "bg-brand-light text-brand-dark font-medium" : "text-foreground/60"
          }`}
        >
          I have an amount
        </button>
        <button
          type="button"
          onClick={() => setMode("need-days")}
          className={`flex-1 rounded-md py-1.5 ${
            mode === "need-days" ? "bg-brand-light text-brand-dark font-medium" : "text-foreground/60"
          }`}
        >
          I need it to last
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="text-xs font-medium text-foreground/60">Distribution Company</label>
          <select
            value={discoId ?? ""}
            onChange={(e) => {
              const id = Number(e.target.value);
              setDiscoId(id);
              const disco = discos.find((d) => d.id === id);
              if (disco && !disco.tariff_bands.some((t) => t.band === band)) {
                setBand(disco.tariff_bands[0]?.band ?? null);
              }
            }}
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

        {mode === "have-money" ? (
          <div>
            <label className="text-xs font-medium text-foreground/60">Amount (₦)</label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
            />
          </div>
        ) : (
          <div>
            <label className="text-xs font-medium text-foreground/60">Days you need it to last</label>
            <input
              type="number"
              min={1}
              value={days}
              onChange={(e) => setDays(e.target.value === "" ? "" : Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-medium text-foreground/60">Your average daily usage (kWh)</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={avgDailyKwh}
            onChange={(e) => setAvgDailyKwh(e.target.value === "" ? "" : Number(e.target.value))}
            className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
          />
          <p className="mt-1 text-xs text-foreground/40">
            Not sure? A modest household is roughly 3-6 kWh/day. Try the Quick Calculator above to estimate yours.
          </p>
        </div>
      </div>

      {units !== null && (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className="rounded-lg border border-card-border p-3">
            <p className="flex items-center gap-1 text-xs text-foreground/50">
              <Zap className="h-3.5 w-3.5" /> Units
            </p>
            <p className="mt-1 text-lg font-semibold">{formatKwh(units)}</p>
          </div>
          {mode === "have-money" && resultDays !== null && (
            <div className="rounded-lg border border-brand/30 bg-brand-light p-3">
              <p className="flex items-center gap-1 text-xs text-brand-dark">
                <CalendarDays className="h-3.5 w-3.5" /> Estimated to last
              </p>
              <p className="mt-1 text-lg font-semibold text-brand-dark">
                {Math.max(0, Math.round(resultDays))} day{Math.round(resultDays) === 1 ? "" : "s"}
              </p>
            </div>
          )}
          {mode === "need-days" && resultCost !== null && (
            <div className="rounded-lg border border-brand/30 bg-brand-light p-3">
              <p className="flex items-center gap-1 text-xs text-brand-dark">
                <Coins className="h-3.5 w-3.5" /> Recharge at least
              </p>
              <p className="mt-1 text-lg font-semibold text-brand-dark">{formatNaira(resultCost)}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
