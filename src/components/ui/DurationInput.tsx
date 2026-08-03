"use client";

import { useState } from "react";

interface DurationInputProps {
  /** Canonical value in hours (decimal). Minutes are converted to/from this. */
  hours: number | "";
  onChange: (hours: number | "") => void;
  className?: string;
  inputClassName?: string;
}

function round(value: number, decimals = 3): number {
  const factor = 10 ** decimals;
  return Math.round(value * factor) / factor;
}

export function DurationInput({ hours, onChange, className = "", inputClassName = "" }: DurationInputProps) {
  const [unit, setUnit] = useState<"hours" | "minutes">("hours");

  const displayValue = hours === "" ? "" : unit === "hours" ? round(hours) : round(hours * 60, 1);

  function handleValueChange(raw: string) {
    if (raw === "") {
      onChange("");
      return;
    }
    const num = Number(raw);
    onChange(unit === "hours" ? num : num / 60);
  }

  function handleUnitChange(next: "hours" | "minutes") {
    setUnit(next);
  }

  return (
    <div className={`flex items-stretch gap-1.5 ${className}`}>
      <input
        type="number"
        min={0}
        value={displayValue}
        onChange={(e) => handleValueChange(e.target.value)}
        className={`w-full rounded-lg border border-card-border bg-card-bg text-foreground px-3 py-2 text-sm ${inputClassName}`}
      />
      <select
        value={unit}
        onChange={(e) => handleUnitChange(e.target.value as "hours" | "minutes")}
        className="shrink-0 rounded-lg border border-card-border bg-card-bg text-foreground px-2 py-2 text-xs"
      >
        <option value="hours">Hrs</option>
        <option value="minutes">Min</option>
      </select>
    </div>
  );
}
