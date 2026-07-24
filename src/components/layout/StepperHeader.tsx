"use client";

import { CloudRain, Share2, Sun } from "lucide-react";
import type { Scenario } from "@/lib/types";

export const STEPS = [
  { id: "section-disco-tariff", label: "Disco & Tariff" },
  { id: "section-appliances", label: "Appliances" },
  { id: "section-usage-pattern", label: "Usage Pattern" },
  { id: "section-review", label: "Review" },
  { id: "section-results", label: "Results" },
];

interface StepperHeaderProps {
  activeStep: number;
  scenario: Scenario;
  onScenarioChange: (scenario: Scenario) => void;
  onSaveShare: () => void;
  savedFeedback: string | null;
}

export function StepperHeader({
  activeStep,
  scenario,
  onScenarioChange,
  onSaveShare,
  savedFeedback,
}: StepperHeaderProps) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b border-card-border bg-card-bg px-6 py-4">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === activeStep;
          const isDone = stepNumber < activeStep;
          return (
            <li key={step.id} className="flex items-center">
              <button
                type="button"
                onClick={() =>
                  document.getElementById(step.id)?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="flex flex-col items-center gap-1 px-2"
              >
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium border-2 transition-colors ${
                    isActive
                      ? "bg-brand text-white border-brand"
                      : isDone
                      ? "border-brand text-brand"
                      : "border-card-border text-foreground/40"
                  }`}
                >
                  {stepNumber}
                </span>
                <span
                  className={`hidden sm:block text-xs whitespace-nowrap ${
                    isActive ? "text-brand font-medium" : "text-foreground/50"
                  }`}
                >
                  {step.label}
                </span>
              </button>
              {stepNumber !== STEPS.length && (
                <span className="hidden sm:block h-px w-6 md:w-10 bg-card-border" />
              )}
            </li>
          );
        })}
      </ol>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 rounded-lg border border-card-border p-1 text-sm">
          <button
            type="button"
            onClick={() => onScenarioChange("good")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 ${
              scenario === "good" ? "bg-brand-light text-brand-dark" : "text-foreground/60"
            }`}
          >
            <Sun className="h-3.5 w-3.5" />
            Good day
          </button>
          <button
            type="button"
            onClick={() => onScenarioChange("bad")}
            className={`flex items-center gap-1 rounded-md px-2 py-1 ${
              scenario === "bad" ? "bg-brand-light text-brand-dark" : "text-foreground/60"
            }`}
          >
            <CloudRain className="h-3.5 w-3.5" />
            Bad day
          </button>
        </div>

        <button
          type="button"
          onClick={onSaveShare}
          className="flex items-center gap-2 rounded-lg border border-brand px-3 py-2 text-sm font-medium text-brand hover:bg-brand-light"
        >
          <Share2 className="h-4 w-4" />
          {savedFeedback ?? "Save & Share"}
        </button>
      </div>
    </header>
  );
}
