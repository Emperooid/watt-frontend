"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, XCircle } from "lucide-react";
import { getReportStatus } from "@/lib/api";
import type { ReportStatusResponse } from "@/lib/api";

const MAX_ATTEMPTS = 8;
const POLL_DELAY_MS = 2500;

function ReportStatusContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");

  const [result, setResult] = useState<ReportStatusResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reference) {
      setError("Missing payment reference.");
      return;
    }
    let cancelled = false;
    let attempts = 0;

    async function poll() {
      attempts += 1;
      try {
        const status = await getReportStatus(reference as string);
        if (cancelled) return;
        setResult(status);
        if (status.status === "pending" && attempts < MAX_ATTEMPTS) {
          setTimeout(poll, POLL_DELAY_MS);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : "Couldn't check payment status.");
      }
    }

    poll();
    return () => {
      cancelled = true;
    };
  }, [reference]);

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col items-center justify-center px-4 text-center">
      {error && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-lg font-semibold">Something went wrong</h1>
          <p className="mt-1 text-sm text-foreground/60">{error}</p>
        </>
      )}

      {!error && (!result || result.status === "pending") && (
        <>
          <Loader2 className="h-12 w-12 animate-spin text-brand" />
          <h1 className="mt-4 text-lg font-semibold">Confirming your payment…</h1>
          <p className="mt-1 text-sm text-foreground/60">This usually takes a few seconds.</p>
        </>
      )}

      {!error && result?.status === "paid" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-brand" />
          <h1 className="mt-4 text-lg font-semibold">Payment successful!</h1>
          <p className="mt-1 text-sm text-foreground/60">
            {result.report_sent
              ? "Your PDF report is on its way to your inbox — check your email in a few minutes."
              : "We're putting your report together and will email it to you shortly."}
          </p>
        </>
      )}

      {!error && result?.status === "failed" && (
        <>
          <XCircle className="h-12 w-12 text-red-500" />
          <h1 className="mt-4 text-lg font-semibold">Payment didn&apos;t go through</h1>
          <p className="mt-1 text-sm text-foreground/60">
            No charge was completed. You can try again from the Home Planner.
          </p>
        </>
      )}

      <Link
        href="/planner"
        className="mt-6 rounded-lg border border-card-border bg-card-bg px-4 py-2 text-sm font-medium hover:border-brand/50 hover:text-brand"
      >
        Back to Home Planner
      </Link>
    </div>
  );
}

export default function ReportStatusPage() {
  return (
    <Suspense fallback={null}>
      <ReportStatusContent />
    </Suspense>
  );
}
