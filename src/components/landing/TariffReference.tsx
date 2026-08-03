"use client";

import { formatNaira } from "@/lib/format";
import { useDiscos } from "@/lib/useDiscos";

export function TariffReference() {
  const { discos } = useDiscos();

  // NERC's MYTO order sets the same Non-MD/MD1/MD2 rate per band across every
  // Disco, so any one Disco's tariff_bands is representative of them all.
  const reference = discos[0];
  if (!reference) return null;

  return (
    <section className="mx-auto max-w-6xl scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
      <h2 className="text-2xl font-bold">Nigeria&apos;s electricity tariff bands</h2>
      <p className="mt-1 text-foreground/60">
        NERC&apos;s approved rates apply the same way across all {discos.length} distribution companies —
        this is what determines the rate used below.
      </p>

      <div className="mt-6 overflow-x-auto rounded-xl border border-card-border bg-card-bg">
        <table className="w-full min-w-140 text-sm">
          <thead>
            <tr className="border-b border-card-border text-left text-foreground/50">
              <th className="p-3 font-medium">Band</th>
              <th className="p-3 font-medium">Min. Daily Supply</th>
              <th className="p-3 font-medium">Non-MD (₦/kWh)</th>
              <th className="p-3 font-medium">MD1 (₦/kWh)</th>
              <th className="p-3 font-medium">MD2 (₦/kWh)</th>
            </tr>
          </thead>
          <tbody>
            {reference.tariff_bands.map((t) => (
              <tr key={t.band} className="border-b border-card-border last:border-0">
                <td className="p-3 font-medium">Band {t.band}</td>
                <td className="p-3 text-foreground/70">{t.min_hours_supply}+ hours/day</td>
                <td className="p-3">{formatNaira(Number(t.non_md_rate))}</td>
                <td className="p-3">{formatNaira(Number(t.md1_rate))}</td>
                <td className="p-3">{formatNaira(Number(t.md2_rate))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-foreground/40">
        Covers {discos.map((d) => d.code).join(", ")}. Non-MD is the standard residential/small-business
        rate; MD1/MD2 apply to larger commercial and industrial customers with demand meters. Source: NERC
        MYTO Order (nerc.gov.ng).
      </p>
    </section>
  );
}
