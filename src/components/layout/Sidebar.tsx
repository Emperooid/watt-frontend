"use client";

import {
  BookOpen,
  Calculator,
  HelpCircle,
  Info,
  Lightbulb,
  ListChecks,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  enabled: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Calculate Cost", icon: Calculator, href: "/", enabled: true },
  { label: "My Scenarios", icon: ListChecks, href: "#", enabled: false },
  { label: "Tips & Insights", icon: Lightbulb, href: "#", enabled: false },
  { label: "Electricity 101", icon: BookOpen, href: "#", enabled: false },
  { label: "About Us", icon: Info, href: "#", enabled: false },
  { label: "FAQs", icon: HelpCircle, href: "#", enabled: false },
];

export function Sidebar() {
  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col justify-between bg-sidebar-bg text-sidebar-fg px-4 py-6">
      <div>
        <div className="flex items-center gap-2 px-2 mb-8">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand">
            <Zap className="h-5 w-5 text-white" fill="white" />
          </span>
          <div>
            <p className="text-lg font-semibold text-white leading-tight">PowerWise</p>
            <p className="text-xs text-sidebar-fg-muted leading-tight">Know. Plan. Save.</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, icon: Icon, enabled }) => (
            <button
              key={label}
              type="button"
              disabled={!enabled}
              title={enabled ? undefined : "Coming soon"}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
                enabled
                  ? "bg-brand text-white font-medium"
                  : "text-sidebar-fg-muted hover:bg-sidebar-bg-hover disabled:cursor-not-allowed"
              }`}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-brand-dark/60 bg-sidebar-bg-hover p-4">
          <Zap className="h-5 w-5 text-brand mb-2" />
          <p className="text-sm font-semibold text-white">Powering smarter decisions</p>
          <p className="text-xs text-sidebar-fg-muted mt-1">
            A free tool for every Nigerian home and business.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-lg border border-sidebar-bg-hover px-3 py-2 text-sm text-sidebar-fg">
          <span className="h-2 w-2 rounded-full bg-brand" />
          Nigeria
        </div>
      </div>
    </aside>
  );
}
