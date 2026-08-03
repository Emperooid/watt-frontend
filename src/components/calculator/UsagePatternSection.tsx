"use client";

import { RefreshCcw } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { DurationInput } from "@/components/ui/DurationInput";
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
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
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
      <p className="text-sm text-foreground/60 mb-4">Set average daily usage for each appliance, in hours or minutes.</p>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed border-card-border px-4 py-6 text-center text-sm text-foreground/50">
          Add appliances above first.
        </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-120 text-sm">
            <thead>
              <tr className="text-left text-foreground/50">
                <th className="pb-2 font-medium">Appliance</th>
                <th className="pb-2 font-medium">Power (Watt)</th>
                <th className="pb-2 font-medium">Quantity</th>
                <th className="pb-2 font-medium">Daily Usage</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => (
                <tr key={item.clientId} className="border-t border-card-border">
                  <td className="py-2 pr-2">{item.name}</td>
                  <td className="py-2 pr-2 text-foreground/60">{item.watts} W</td>
                  <td className="py-2 pr-2 text-foreground/60">{item.quantity}</td>
                  <td className="py-2">
                    <DurationInput
                      hours={item.hoursPerDay}
                      onChange={(h) => onUpdateItem(item.clientId, { hoursPerDay: h === "" ? 0 : h })}
                      className="w-40"
                    />
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
