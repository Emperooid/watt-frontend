"use client";

import { useEffect, useState } from "react";
import { BarChart3, Bell, Home, PiggyBank, Users } from "lucide-react";
import { getWaitlistCount } from "@/lib/api";
import { WaitlistForm } from "./WaitlistForm";

const V2_FEATURES = [
  { icon: Home, label: "Add every appliance in your home, room by room" },
  { icon: BarChart3, label: "Compare good days vs bad days" },
  { icon: PiggyBank, label: "Plan your monthly electricity budget" },
  { icon: Bell, label: "Get smart, personalized savings tips" },
];

export function WaitlistSection() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    getWaitlistCount()
      .then((res) => setCount(res.count))
      .catch(() => setCount(null));
  }, []);

  return (
    <section id="waitlist" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold">
            Want to calculate your <span className="text-brand">entire home?</span>
          </h2>
          <p className="mt-3 text-foreground/70">
            Version 2 lets you add every appliance in your home, compare good days vs bad days, plan your
            monthly budget, and get smart savings tips.
          </p>

          <div className="mt-6 max-w-sm">
            <WaitlistForm />
          </div>

          <p className="mt-3 flex items-center gap-1.5 text-xs text-foreground/50">
            <Users className="h-3.5 w-3.5" />
            {count === null
              ? "Join the waitlist below."
              : count > 0
              ? `${count.toLocaleString("en-NG")} Nigerian${count === 1 ? "" : "s"} already on the waitlist.`
              : "Be the first to join the waitlist."}
          </p>
        </div>

        <div className="rounded-2xl border border-card-border bg-card-bg p-6 shadow-sm">
          <p className="mb-4 inline-block rounded-full bg-brand-light px-3 py-1 text-xs font-medium text-brand-dark">
            Coming Soon
          </p>
          <ul className="space-y-3">
            {V2_FEATURES.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-start gap-3 text-sm">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brand-light text-brand">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="pt-1.5 text-foreground/80">{label}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
