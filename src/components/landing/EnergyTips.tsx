import { Fan, Lightbulb, Refrigerator, Sun } from "lucide-react";

const TIPS = [
  {
    icon: Sun,
    title: "Reduce AC usage in peak heat",
    body: "Set your AC 1-2°C higher and use a fan alongside it — you'll barely notice the difference, but your bill will.",
  },
  {
    icon: Refrigerator,
    title: "Keep your fridge full (but not packed)",
    body: "A reasonably full fridge holds cold better than an empty one, so the compressor runs less often.",
  },
  {
    icon: Lightbulb,
    title: "Switch to LED bulbs",
    body: "LED bulbs use up to 85% less power than incandescent bulbs for the same brightness.",
  },
  {
    icon: Fan,
    title: "Turn off what you're not using",
    body: "Fans, TVs, and chargers left on standby still draw power. Switch off at the socket when you're done.",
  },
];

export function EnergyTips() {
  return (
    <section id="energy-tips" className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold">Energy-saving tips</h2>
      <p className="mt-1 text-foreground/60">Small habits that add up to real savings on your bill.</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {TIPS.map(({ icon: Icon, title, body }) => (
          <div key={title} className="rounded-xl border border-card-border bg-card-bg p-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-light text-brand">
              <Icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-sm font-semibold">{title}</p>
            <p className="mt-1 text-xs text-foreground/60">{body}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
