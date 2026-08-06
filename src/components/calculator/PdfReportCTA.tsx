"use client";

import { useState } from "react";
import { FileDown, Mail } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { initiateReport } from "@/lib/api";
import type { Band, CustomerType, Scenario, WizardItem } from "@/lib/types";

interface PdfReportCTAProps {
  discoId: number | null;
  band: Band | null;
  customerType: CustomerType;
  scenario: Scenario;
  items: WizardItem[];
}

export function PdfReportCTA({ discoId, band, customerType, scenario, items }: PdfReportCTAProps) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!discoId || !band || items.length === 0) return null;

  async function handleCheckout(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim() || !discoId || !band) return;
    setLoading(true);
    setError(null);
    try {
      const { authorization_url } = await initiateReport({
        email: email.trim(),
        disco_id: discoId,
        band,
        customer_type: customerType,
        scenario,
        items: items.map((i) => ({
          appliance_id: i.applianceId,
          name: i.applianceId ? undefined : i.name,
          watts: i.watts,
          quantity: i.quantity,
          hours_per_day: i.hoursPerDay,
        })),
      });
      window.location.href = authorization_url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't start checkout. Please try again.");
      setLoading(false);
    }
  }

  return (
    <Card className="border-brand/30 bg-brand-light/30">
      <div className="flex items-start gap-3">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand text-white">
          <FileDown className="h-4 w-4" />
        </span>
        <div className="flex-1">
          <h2 className="text-base font-semibold">Get a detailed PDF report by email</h2>
          <p className="text-sm text-foreground/60">
            A full breakdown of this setup — cost summary, appliance-by-appliance table, highest consumers,
            and savings insights — sent straight to your inbox.
          </p>

          <form onSubmit={handleCheckout} className="mt-4 flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-foreground/40" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-card-border bg-card-bg text-foreground py-2 pl-9 pr-3 text-sm"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="shrink-0 rounded-lg bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark disabled:opacity-60"
            >
              {loading ? "Redirecting…" : "Pay ₦2,000 & Email My Report"}
            </button>
          </form>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <p className="mt-2 text-xs text-foreground/40">Secure checkout via Paystack.</p>
        </div>
      </div>
    </Card>
  );
}
