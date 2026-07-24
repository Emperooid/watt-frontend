"use client";

import { useMemo, useState } from "react";
import { Minus, Plus, Search, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/Card";
import type { Appliance, WizardItem } from "@/lib/types";

interface AppliancesSectionProps {
  appliances: Appliance[];
  items: WizardItem[];
  onAdd: (appliance: Appliance) => void;
  onAddCustom: (name: string, watts: number) => void;
  onUpdateItem: (clientId: string, patch: Partial<WizardItem>) => void;
  onRemoveItem: (clientId: string) => void;
}

export function AppliancesSection({
  appliances,
  items,
  onAdd,
  onAddCustom,
  onUpdateItem,
  onRemoveItem,
}: AppliancesSectionProps) {
  const [query, setQuery] = useState("");
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customWatts, setCustomWatts] = useState("");

  const selectedIds = useMemo(
    () => new Set(items.map((i) => i.applianceId).filter(Boolean)),
    [items]
  );

  const suggestions = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return appliances
      .filter((a) => !selectedIds.has(a.id) && a.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [appliances, query, selectedIds]);

  function submitCustom() {
    const watts = Number(customWatts);
    if (!customName.trim() || !watts || watts <= 0) return;
    onAddCustom(customName.trim(), watts);
    setCustomName("");
    setCustomWatts("");
    setShowCustomForm(false);
  }

  return (
    <Card id="section-appliances">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
        <h2 className="text-base font-semibold">2. Add your appliances</h2>
        <button
          type="button"
          onClick={() => setShowCustomForm((v) => !v)}
          className="flex items-center gap-1 rounded-lg border border-brand px-3 py-1.5 text-sm font-medium text-brand hover:bg-brand-light"
        >
          <Plus className="h-4 w-4" />
          Add Custom Appliance
        </button>
      </div>
      <p className="text-sm text-foreground/60 mb-4">
        Select appliances you use and their power ratings.
      </p>

      {showCustomForm && (
        <div className="mb-4 flex flex-wrap items-end gap-2 rounded-lg border border-card-border p-3">
          <div className="flex-1 min-w-[140px]">
            <label className="text-xs text-foreground/60">Name</label>
            <input
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="e.g. Aquarium Pump"
              className="w-full rounded-md border border-card-border bg-transparent px-2 py-1.5 text-sm"
            />
          </div>
          <div className="w-28">
            <label className="text-xs text-foreground/60">Watts</label>
            <input
              type="number"
              value={customWatts}
              onChange={(e) => setCustomWatts(e.target.value)}
              placeholder="W"
              className="w-full rounded-md border border-card-border bg-transparent px-2 py-1.5 text-sm"
            />
          </div>
          <button
            type="button"
            onClick={submitCustom}
            className="rounded-md bg-brand px-3 py-1.5 text-sm font-medium text-white"
          >
            Add
          </button>
        </div>
      )}

      <div className="relative mb-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search appliances (e.g. Fan, TV, AC)"
          className="w-full rounded-lg border border-card-border bg-transparent py-2 pl-9 pr-3 text-sm"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 mt-1 w-full rounded-lg border border-card-border bg-card-bg shadow-lg">
            {suggestions.map((a) => (
              <li key={a.id}>
                <button
                  type="button"
                  onClick={() => {
                    onAdd(a);
                    setQuery("");
                  }}
                  className="flex w-full items-center justify-between px-3 py-2 text-sm hover:bg-brand-light"
                >
                  <span>{a.name}</span>
                  <span className="text-foreground/50">{a.default_watts}W</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-card-border px-4 py-6 text-center text-sm text-foreground/50">
          No appliances added yet. Search above to get started.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="pb-2 font-medium">Appliance</th>
                <th className="pb-2 font-medium">Power (Watt)</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium text-right">Remove</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.clientId} className="border-t border-card-border">
                  <td className="py-2 pr-2">{item.name}</td>
                  <td className="py-2 pr-2">
                    <input
                      type="number"
                      value={item.watts}
                      onChange={(e) => onUpdateItem(item.clientId, { watts: Number(e.target.value) })}
                      className="w-20 rounded-md border border-card-border bg-transparent px-2 py-1"
                    />
                  </td>
                  <td className="py-2 pr-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateItem(item.clientId, { quantity: Math.max(1, item.quantity - 1) })
                        }
                        className="rounded-md border border-card-border p-1"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="w-6 text-center">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => onUpdateItem(item.clientId, { quantity: item.quantity + 1 })}
                        className="rounded-md border border-card-border p-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                  <td className="py-2 text-right">
                    <button
                      type="button"
                      onClick={() => onRemoveItem(item.clientId)}
                      className="rounded-md p-1.5 text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-3 text-xs text-foreground/50">
        Don&apos;t see your appliance? Add a custom one with its wattage.
      </p>
    </Card>
  );
}
