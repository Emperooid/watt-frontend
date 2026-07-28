import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PowerlineIllustration } from "./PowerlineIllustration";

const BADGES = ["100% Free", "No Sign Up", "Instant Results"];

export function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
        <div>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Watt Am I <span className="text-brand">Using?</span>
          </h1>
          <p className="mt-4 text-lg text-foreground/70">
            Find out how much any appliance costs to run in{" "}
            <span className="font-medium text-brand">under 20 seconds.</span>
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-foreground/60">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-brand" />
              {BADGES[0]}
            </span>
            <span>•</span>
            <span>{BADGES[1]}</span>
            <span>•</span>
            <span>{BADGES[2]}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#calculator"
              className="rounded-lg bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Try the Quick Calculator
            </a>
            <Link
              href="/planner"
              className="flex items-center gap-1.5 rounded-lg border border-card-border px-5 py-2.5 text-sm font-medium text-foreground/80 hover:border-brand/50 hover:text-brand"
            >
              Plan your whole home <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        <PowerlineIllustration />
      </div>
    </section>
  );
}
