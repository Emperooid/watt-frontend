"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock, Fuel, Lightbulb, PartyPopper, Share2, Zap } from "lucide-react";
import { calculate, getAppliances } from "@/lib/api";
import { formatKwh, formatNaira } from "@/lib/format";
import { ApplianceIcon } from "@/lib/applianceIcons";
import { DurationInput } from "@/components/ui/DurationInput";
import { useDiscos } from "@/lib/useDiscos";
import type { Appliance, Band, CalculationResult } from "@/lib/types";

const BANDS: Band[] = ["A", "B", "C", "D", "E"];

function StatCard({
  icon: Icon,
  iconClass,
  label,
  value,
  hint,
}: {
  icon: React.ComponentType<{ className?: string }>;
  iconClass: string;
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-xl border border-card-border bg-card-bg p-4">
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${iconClass}`}>
        <Icon className="h-4 w-4" />
      </span>
      <p className="mt-3 text-sm text-foreground/60">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
      <p className="text-xs text-foreground/40">{hint}</p>
    </div>
  );
}

export function QuickCalculator() {
  const { discos, error: discosError } = useDiscos();
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [discoId, setDiscoId] = useState<number | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [applianceId, setApplianceId] = useState<number | null>(null);
  const [watts, setWatts] = useState<number | "">("");
  const [hours, setHours] = useState<number | "">(8);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [shareFeedback, setShareFeedback] = useState<string | null>(null);

  useEffect(() => {
    getAppliances()
      .then(setAppliances)
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load data."));
  }, []);

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
  const selectedAppliance = appliances.find((a) => a.id === applianceId);

  const applianceName = selectedAppliance?.name ?? "your appliance";

  function handleApplianceChange(id: number) {
    setApplianceId(id);
    const appliance = appliances.find((a) => a.id === id);
    if (appliance) {
      setWatts(appliance.default_watts);
    }
  }

  async function handleCalculate() {
    if (!discoId || !band || !watts || watts <= 0) return;
    setCalcLoading(true);
    setCalcError(null);
    try {
      const data = await calculate({
        disco_id: discoId,
        band,
        customer_type: "non_md",
        scenario: "good",
        items: [
          {
            appliance_id: applianceId,
            name: applianceId ? undefined : "Custom Appliance",
            watts: Number(watts),
            quantity: 1,
            hours_per_day: Number(hours) || 0,
          },
        ],
      });
      setResult(data);
    } catch (err) {
      setCalcError(err instanceof Error ? err.message : "Calculation failed.");
    } finally {
      setCalcLoading(false);
    }
  }

  const canCalculate = Boolean(discoId && band && watts && Number(watts) > 0);

  async function handleShare() {
    if (!result) return;
    const text = `My ${applianceName} costs ${formatNaira(result.totals.monthly_cost)} a month to run on ${result.disco} Band ${result.band}. Find out yours:`;
    const url = typeof window !== "undefined" ? window.location.origin : "";
    if (navigator.share) {
      try {
        await navigator.share({ text, url });
        return;
      } catch {
        // fall through to clipboard
      }
    }
    try {
      await navigator.clipboard.writeText(`${text} ${url}`);
      setShareFeedback("Copied!");
    } catch {
      setShareFeedback("Couldn't copy");
    } finally {
      setTimeout(() => setShareFeedback(null), 2000);
    }
  }

  const insight = useMemo(() => result?.insights[0], [result]);

  // Instantaneous rate for running this appliance right now, independent of
  // the daily-usage hours entered — useful as a quick reference figure.
  const costPerHour = result && watts ? (Number(watts) / 1000) * result.rate_per_kwh : null;
  const costPerMinute = costPerHour !== null ? costPerHour / 60 : null;

  if (loadError || discosError) {
    return (
      <p className="mx-auto max-w-6xl px-4 text-center text-sm text-red-500 sm:px-6">
        Couldn&apos;t reach the API ({loadError ?? discosError}). Make sure the backend is running.
      </p>
    );
  }

  return (
    <section id="calculator" className="mx-auto max-w-6xl scroll-mt-20 px-4 sm:px-6">
      <div className="rounded-2xl border border-card-border bg-card-bg p-5 sm:p-8 shadow-sm">
        <div className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-brand" />
          <h2 className="text-lg font-semibold">Quick Electricity Cost Calculator</h2>
        </div>
        <p className="mt-1 text-sm text-foreground/60">
          Answer a few questions below to see how much it costs to run your appliance.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="text-xs font-medium text-foreground/60">1. Distribution Company</label>
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
              <option value="" disabled>
                Choose a Disco
              </option>
              {discos.map((disco) => (
                <option key={disco.id} value={disco.id}>
                  {disco.name} ({disco.code})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">2. Band</label>
            <select
              value={band ?? ""}
              onChange={(e) => setBand(e.target.value as Band)}
              className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Choose a band
              </option>
              {BANDS.filter((b) => selectedDisco?.tariff_bands.some((t) => t.band === b)).map((b) => (
                <option key={b} value={b}>
                  Band {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">3. Appliance</label>
            <select
              value={applianceId ?? ""}
              onChange={(e) => handleApplianceChange(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
            >
              <option value="" disabled>
                Choose appliance
              </option>
              {appliances.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">4. Power Rating (Watts)</label>
            <input
              type="number"
              min={1}
              value={watts}
              onChange={(e) => setWatts(e.target.value === "" ? "" : Number(e.target.value))}
              placeholder="e.g. 75"
              className="mt-1 w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-foreground/60">5. Daily Usage</label>
            <DurationInput hours={hours} onChange={setHours} className="mt-1" />
          </div>
        </div>

        <button
          type="button"
          onClick={handleCalculate}
          disabled={!canCalculate || calcLoading}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-brand py-3 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-50"
        >
          <Zap className="h-4 w-4" />
          {calcLoading ? "Calculating…" : "Calculate Cost"}
        </button>
        <p className="mt-2 flex items-center justify-center gap-1 text-xs text-foreground/50">
          <Clock className="h-3 w-3" />
          Takes less than 20 seconds
        </p>
        {calcError && <p className="mt-2 text-center text-sm text-red-500">{calcError}</p>}
      </div>

      {result && (
        <div className="mt-6 space-y-6">
          <div>
            <h3 className="flex items-center gap-2 text-lg font-semibold">
              <PartyPopper className="h-5 w-5 text-brand" />
              Here&apos;s what your appliance is costing <span className="text-brand">you.</span>
            </h3>
            <p className="text-sm text-foreground/60">
              Results are estimates based on current tariff rates for your Disco and band.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            <StatCard
              icon={Clock}
              iconClass="bg-slate-100 text-slate-600"
              label="Cost / Minute"
              value={formatNaira(costPerMinute ?? 0, 2)}
              hint="Running now"
            />
            <StatCard
              icon={Clock}
              iconClass="bg-slate-100 text-slate-600"
              label="Cost / Hour"
              value={formatNaira(costPerHour ?? 0)}
              hint="Running now"
            />
            <StatCard
              icon={Zap}
              iconClass="bg-brand-light text-brand"
              label="Daily Cost"
              value={formatNaira(result.totals.daily_cost)}
              hint={`For ${hours} hrs/day · ${formatKwh(result.totals.daily_kwh)}`}
            />
            <StatCard
              icon={Clock}
              iconClass="bg-amber-100 text-amber-600"
              label="Weekly Cost"
              value={formatNaira(result.totals.weekly_cost)}
              hint="Per week"
            />
            <StatCard
              icon={PartyPopper}
              iconClass="bg-blue-100 text-blue-600"
              label="Monthly Cost"
              value={formatNaira(result.totals.monthly_cost)}
              hint="Per month"
            />
            <StatCard
              icon={Zap}
              iconClass="bg-purple-100 text-purple-600"
              label="Units Consumed"
              value={formatKwh(result.totals.monthly_kwh)}
              hint="Per month"
            />
          </div>

          {insight && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-xl border border-tip-fg/20 bg-tip-bg p-4">
              <div className="flex items-start gap-2">
                <Lightbulb className="h-5 w-5 shrink-0 text-tip-fg" />
                <div>
                  <p className="text-sm font-semibold text-tip-fg">Did you know?</p>
                  <p className="text-sm text-tip-fg/90">{insight}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleShare}
                className="flex shrink-0 items-center gap-1.5 self-start sm:self-center rounded-lg border border-tip-fg/30 px-3 py-1.5 text-xs font-medium text-tip-fg hover:bg-tip-fg/10"
              >
                <Share2 className="h-3.5 w-3.5" />
                {shareFeedback ?? "Share Result"}
              </button>
            </div>
          )}

          <div className="rounded-xl border border-card-border bg-card-bg p-5">
            <p className="text-sm font-semibold">Compare with alternatives</p>
            <p className="text-xs text-foreground/50">See how this appliance compares to other power options.</p>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3 sm:w-48">
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-light">
                  <ApplianceIcon
                    category={selectedAppliance?.category ?? "other"}
                    className="h-5 w-5 text-brand"
                  />
                </span>
                <div>
                  <p className="text-sm font-medium">
                    {applianceName} ({watts}W)
                  </p>
                  <p className="text-xs text-foreground/50">{hours} hours daily</p>
                </div>
              </div>

              <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-3">
                <div className="rounded-lg border border-card-border p-3">
                  <p className="flex items-center gap-1 text-xs text-foreground/50">
                    <Zap className="h-3.5 w-3.5" /> Using Electricity ({result.disco})
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatNaira(result.generator_comparison.grid_cost_per_month)} / month
                  </p>
                </div>
                <div className="rounded-lg border border-card-border p-3">
                  <p className="flex items-center gap-1 text-xs text-foreground/50">
                    <Fuel className="h-3.5 w-3.5" /> Using Generator
                  </p>
                  <p className="mt-1 text-sm font-semibold">
                    {formatNaira(result.generator_comparison.generator_cost_per_month)} / month
                  </p>
                </div>
                <div className="rounded-lg border border-brand/30 bg-brand-light p-3">
                  <p className="text-xs text-brand-dark">Savings with Electricity</p>
                  <p className="mt-1 text-sm font-semibold text-brand-dark">
                    {formatNaira(result.generator_comparison.savings_amount)} / month
                  </p>
                  <p className="text-xs text-brand-dark">You save {result.generator_comparison.savings_pct}%</p>
                </div>
              </div>
            </div>

            <p className="mt-3 text-xs text-foreground/40">{result.generator_comparison.assumptions}</p>
          </div>

          <div className="flex flex-col items-center gap-2 rounded-xl border border-brand/20 bg-brand-light/40 p-5 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="text-sm font-semibold">Want to plan your entire home?</p>
              <p className="text-sm text-foreground/60">
                Add every appliance in your house and see your full monthly budget in the Home Planner.
              </p>
            </div>
            <Link
              href="/planner"
              className="flex shrink-0 items-center gap-1.5 rounded-lg bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Open Home Planner <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}
