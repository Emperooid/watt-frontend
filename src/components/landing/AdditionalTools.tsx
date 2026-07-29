import { OutageCalculator } from "./OutageCalculator";
import { RechargeCalculator } from "./RechargeCalculator";

export function AdditionalTools() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold">More quick tools</h2>
      <p className="mt-1 text-foreground/60">A few more ways to make sense of your electricity spending.</p>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <RechargeCalculator />
        <OutageCalculator />
      </div>
    </section>
  );
}
