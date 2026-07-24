"use client";

import { Minus, Plus, RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DEFAULT_HOURS_BY_CATEGORY } from "@/lib/format";
import type { WizardItem } from "@/lib/types";

interface UsagePatternSectionProps {
  items: WizardItem[];
  onUpdateItem: (clientId: string, patch: Partial<WizardItem>) => void;
  onResetToDefaults: () => void;
}

export function UsagePatternSection({ items, onUpdateItem, onResetToDefaults }: UsagePatternSectionProps) {
  return (
    <Card id="section-usage-pattern">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-base font-semibold">3. Tell us how long you use them</h2>
        <button
          type="button"
          onClick={onResetToDefaults}
          className="flex items-center gap-1 rounded-lg border border-card-border px-3 py-1.5 text-sm text-foreground/70 hover:border-brand/50"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Set All to Default
        </button>
      </div>
      <p className="text-sm text-foreground/60 mb-4">Set average daily usage hours for each appliance.</p>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-card-border px-4 py-6 text-center text-sm text-foreground/50">
          Add appliances above first.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="pb-2 font-medium">Appliance</th>
                <th className="pb-2 font-medium">Power (Watt)</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium">Daily Usage (Hours)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.clientId} className="border-t border-card-border">
                  <td className="py-2 pr-2">{item.name}</td>
                  <td className="py-2 pr-2 text-foreground/60">{item.watts} W</td>
                  <td className="py-2 pr-2 text-foreground/60">{item.quantity}</td>
                  <td className="py-2">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateItem(item.clientId, { hoursPerDay: Math.max(0, item.hoursPerDay - 1) })
                        }
                        className="rounded-md border border-card-border p-1"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <input
                        type="number"
                        min={0}
                        max={24}
                        value={item.hoursPerDay}
                        onChange={(e) =>
                          onUpdateItem(item.clientId, { hoursPerDay: Number(e.target.value) })
                        }
                        className="w-14 rounded-md border border-card-border bg-transparent px-2 py-1 text-center"
                      />
                      <button
                        type="button"
                        onClick={() =>
                          onUpdateItem(item.clientId, {
                            hoursPerDay: Math.min(24, item.hoursPerDay + 1),
                          })
                        }
                        className="rounded-md border border-card-border p-1"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}

export function defaultHoursFor(category: string): number {
  return DEFAULT_HOURS_BY_CATEGORY[category] ?? 2;
}
