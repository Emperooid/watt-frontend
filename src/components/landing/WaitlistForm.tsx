"use client";

import { useState } from "react";
import { Bell } from "lucide-react";
import { joinWaitlist } from "@/lib/api";

export function WaitlistForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStatus("loading");
    try {
      const res = await joinWaitlist(email.trim());
      setStatus("done");
      setMessage(res.already_joined ? "You're already on the list!" : "You're on the list!");
      setEmail("");
    } catch (err) {
      setStatus("error");
      setMessage(err instanceof Error ? err.message : "Something went wrong.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex flex-col gap-2" : "flex flex-col sm:flex-row gap-2"}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email address"
        className={`flex-1 rounded-lg border px-3 py-2 text-sm ${
          compact
            ? "border-sidebar-bg-hover bg-transparent text-white placeholder:text-sidebar-fg-muted"
            : "border-card-border bg-card-bg text-foreground"
        }`}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="flex items-center justify-center gap-1.5 rounded-lg bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dark disabled:opacity-60"
      >
        <Bell className="h-3.5 w-3.5" />
        {status === "loading" ? "Joining…" : "Notify Me"}
      </button>
      {message && (
        <p className={`text-xs ${status === "error" ? "text-red-400" : "text-brand"}`}>{message}</p>
      )}
    </form>
  );
}
