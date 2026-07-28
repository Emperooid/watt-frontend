"use client";

import { useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Calculator,
  HelpCircle,
  Home,
  Info,
  Lightbulb,
  ListChecks,
  Menu,
  X,
  Zap,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  href: string;
  enabled: boolean;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Home", icon: Home, href: "/", enabled: true },
  { label: "Home Planner", icon: Calculator, href: "/planner", enabled: true },
  { label: "My Scenarios", icon: ListChecks, href: "#", enabled: false },
  { label: "Tips & Insights", icon: Lightbulb, href: "#", enabled: false },
  { label: "Electricity 101", icon: BookOpen, href: "#", enabled: false },
  { label: "About Us", icon: Info, href: "#", enabled: false },
  { label: "FAQs", icon: HelpCircle, href: "#", enabled: false },
];

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <>
      <div>
        <Link href="/" className="flex items-center gap-2 px-2 mb-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </span>
          <div>
            <p className="text-base font-semibold text-white leading-tight">WattAmIUsing</p>
            <p className="text-xs text-sidebar-fg-muted leading-tight">Home Planner</p>
          </div>
        </Link>

        <nav className="flex flex-col gap-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href, enabled }) => {
            const isPlanner = href === "/planner";
            const content = (
              <>
                <Icon className="h-4 w-4 shrink-0" />
                {label}
              </>
            );
            const className = `flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-left transition-colors ${
              isPlanner
                ? "bg-brand text-white font-medium"
                : enabled
                ? "text-sidebar-fg hover:bg-sidebar-bg-hover"
                : "text-sidebar-fg-muted hover:bg-sidebar-bg-hover cursor-not-allowed"
            }`;

            if (!enabled) {
              return (
                <button key={label} type="button" disabled title="Coming soon" className={className}>
                  {content}
                </button>
              );
            }
            return (
              <Link key={label} href={href} onClick={onNavigate} className={className}>
                {content}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-3">
        <div className="rounded-xl border border-brand-dark/60 bg-sidebar-bg-hover p-3">
          <Zap className="h-4 w-4 text-brand mb-2" />
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
    </>
  );
}

export function Sidebar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar */}
      <div className="flex lg:hidden items-center justify-between bg-sidebar-bg text-sidebar-fg px-4 py-3">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand">
            <Zap className="h-4 w-4 text-white" fill="white" />
          </span>
          <p className="text-base font-semibold text-white leading-tight">WattAmIUsing</p>
        </Link>
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
          className="rounded-lg p-2 text-sidebar-fg hover:bg-sidebar-bg-hover"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative flex w-64 max-w-[80vw] flex-col justify-between bg-sidebar-bg text-sidebar-fg px-4 py-5 shadow-xl">
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
              className="absolute right-3 top-3 rounded-lg p-1.5 text-sidebar-fg hover:bg-sidebar-bg-hover"
            >
              <X className="h-4 w-4" />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-56 shrink-0 flex-col justify-between bg-sidebar-bg text-sidebar-fg px-3 py-5">
        <SidebarContent />
      </aside>
    </>
  );
}
