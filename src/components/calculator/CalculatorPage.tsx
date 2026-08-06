"use client";

import { useCallback, useEffect, useMemo, useReducer, useState } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { StepperHeader } from "@/components/layout/StepperHeader";
import { calculate, getAppliances, getDiscos } from "@/lib/api";
import { defaultHoursFor } from "./UsagePatternSection";
import type { Appliance, Band, CalculationResult, CustomerType, Disco, Scenario, WizardItem } from "@/lib/types";
import { DiscoTariffSection } from "./DiscoTariffSection";
import { AppliancesSection } from "./AppliancesSection";
import { UsagePatternSection } from "./UsagePatternSection";
import { ReviewSection } from "./ReviewSection";
import { ResultsSection } from "./ResultsSection";
import { PdfReportCTA } from "./PdfReportCTA";
import { SummaryPanel } from "./SummaryPanel";

type ItemsAction =
  | { type: "add"; item: WizardItem }
  | { type: "update"; clientId: string; patch: Partial<WizardItem> }
  | { type: "remove"; clientId: string }
  | { type: "reset_hours" }
  | { type: "replace"; items: WizardItem[] };

function itemsReducer(state: WizardItem[], action: ItemsAction): WizardItem[] {
  switch (action.type) {
    case "add":
      return [...state, action.item];
    case "update":
      return state.map((i) => (i.clientId === action.clientId ? { ...i, ...action.patch } : i));
    case "remove":
      return state.filter((i) => i.clientId !== action.clientId);
    case "reset_hours":
      return state.map((i) => ({ ...i, hoursPerDay: defaultHoursFor(i.category) }));
    case "replace":
      return action.items;
    default:
      return state;
  }
}

function makeClientId() {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `item-${Date.now()}-${Math.random()}`;
}

export function CalculatorPage() {
  const [discos, setDiscos] = useState<Disco[]>([]);
  const [appliances, setAppliances] = useState<Appliance[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [discoId, setDiscoId] = useState<number | null>(null);
  const [band, setBand] = useState<Band | null>(null);
  const [customerType, setCustomerType] = useState<CustomerType>("non_md");
  const [scenario, setScenario] = useState<Scenario>("good");
  const [items, dispatch] = useReducer(itemsReducer, []);

  const [result, setResult] = useState<CalculationResult | null>(null);
  const [calcLoading, setCalcLoading] = useState(false);
  const [calcError, setCalcError] = useState<string | null>(null);

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);

  // Load reference data once.
  useEffect(() => {
    Promise.all([getDiscos(), getAppliances()])
      .then(([d, a]) => {
        setDiscos(d);
        setAppliances(a);
        if (d.length > 0 && discoId === null) {
          setDiscoId(d[0].id);
          setBand("B");
        }
      })
      .catch((err) => setLoadError(err instanceof Error ? err.message : "Failed to load data."));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Restore a shared scenario from the URL, if present.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("state");
    if (!encoded) return;
    try {
      const decoded = JSON.parse(atob(encoded));
      if (decoded.discoId) setDiscoId(decoded.discoId);
      if (decoded.band) setBand(decoded.band);
      if (decoded.customerType) setCustomerType(decoded.customerType);
      if (decoded.scenario) setScenario(decoded.scenario);
      if (Array.isArray(decoded.items)) {
        dispatch({
          type: "replace",
          items: decoded.items.map((i: WizardItem) => ({ ...i, clientId: makeClientId() })),
        });
      }
    } catch {
      // ignore malformed share links
    }
  }, []);

  const addAppliance = useCallback((appliance: Appliance) => {
    dispatch({
      type: "add",
      item: {
        clientId: makeClientId(),
        applianceId: appliance.id,
        name: appliance.name,
        watts: appliance.default_watts,
        quantity: 1,
        hoursPerDay: defaultHoursFor(appliance.category),
        category: appliance.category,
        hasInverterAlternative: appliance.has_inverter_alternative,
        inverterSavingsPct: appliance.inverter_savings_pct,
      },
    });
  }, []);

  const addCustomAppliance = useCallback((name: string, watts: number) => {
    dispatch({
      type: "add",
      item: {
        clientId: makeClientId(),
        applianceId: null,
        name,
        watts,
        quantity: 1,
        hoursPerDay: defaultHoursFor("other"),
        category: "other",
        hasInverterAlternative: false,
        inverterSavingsPct: 0,
      },
    });
  }, []);

  // Debounced live calculation whenever the inputs change.
  useEffect(() => {
    if (!discoId || !band || items.length === 0) {
      setResult(null);
      setCalcError(null);
      return;
    }
    const handle = setTimeout(() => {
      setCalcLoading(true);
      setCalcError(null);
      calculate({
        disco_id: discoId,
        band,
        customer_type: customerType,
        scenario,
        items: items.map((i) => ({
          appliance_id: i.applianceId,
          name: i.applianceId ? undefined : i.name,
          watts: i.watts,
          quantity: i.quantity,
          hours_per_day: i.hoursPerDay,
        })),
      })
        .then(setResult)
        .catch((err) => setCalcError(err instanceof Error ? err.message : "Calculation failed."))
        .finally(() => setCalcLoading(false));
    }, 350);
    return () => clearTimeout(handle);
  }, [discoId, band, customerType, scenario, items]);

  const activeStep = useMemo(() => {
    if (!discoId || !band) return 1;
    if (items.length === 0) return 2;
    if (calcLoading) return 3;
    if (result) return 5;
    return 3;
  }, [discoId, band, items.length, calcLoading, result]);

  const handleSaveShare = useCallback(() => {
    const payload = { discoId, band, customerType, scenario, items };
    const encoded = btoa(JSON.stringify(payload));
    const url = `${window.location.origin}${window.location.pathname}?state=${encoded}`;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        setSavedFeedback("Copied!");
        setTimeout(() => setSavedFeedback(null), 2000);
      })
      .catch(() => {
        setSavedFeedback("Copy failed");
        setTimeout(() => setSavedFeedback(null), 2000);
      });
  }, [discoId, band, customerType, scenario, items]);

  if (loadError) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <p className="text-sm text-red-500">
          Couldn&apos;t reach the API ({loadError}). Make sure the backend is running.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen">
      <Sidebar />
      <div className="flex flex-1 flex-col min-w-0">
        <StepperHeader
          activeStep={activeStep}
          scenario={scenario}
          onScenarioChange={setScenario}
          onSaveShare={handleSaveShare}
          savedFeedback={savedFeedback}
        />
        <main className="flex-1 px-4 py-4 sm:px-6 sm:py-6">
          <div className="mx-auto max-w-6xl">
            <h1 className="text-lg sm:text-xl font-semibold">Let&apos;s estimate your electricity cost</h1>
            <p className="text-sm text-foreground/60 mt-1 mb-4 sm:mb-6">
              Follow the steps to see how much you spend and how you can save.
            </p>

            <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
              <div className="flex-1 min-w-0 space-y-4 sm:space-y-6">
                <DiscoTariffSection
                  discos={discos}
                  discoId={discoId}
                  band={band}
                  customerType={customerType}
                  onDiscoChange={setDiscoId}
                  onBandChange={setBand}
                  onCustomerTypeChange={setCustomerType}
                />
                <AppliancesSection
                  appliances={appliances}
                  items={items}
                  onAdd={addAppliance}
                  onAddCustom={addCustomAppliance}
                  onUpdateItem={(clientId, patch) => dispatch({ type: "update", clientId, patch })}
                  onRemoveItem={(clientId) => dispatch({ type: "remove", clientId })}
                />
                <UsagePatternSection
                  items={items}
                  onUpdateItem={(clientId, patch) => dispatch({ type: "update", clientId, patch })}
                  onResetToDefaults={() => dispatch({ type: "reset_hours" })}
                />
                <ReviewSection result={result} loading={calcLoading} error={calcError} />
                <ResultsSection result={result} />
                {result && (
                  <PdfReportCTA
                    discoId={discoId}
                    band={band}
                    customerType={customerType}
                    scenario={scenario}
                    items={items}
                  />
                )}
              </div>

              <SummaryPanel
                scenario={scenario}
                onScenarioChange={setScenario}
                result={result}
                loading={calcLoading}
                error={calcError}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
