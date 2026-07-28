import type { Appliance, CalculationResult, CustomerType, Disco, Scenario } from "./types";

const PRODUCTION_API_BASE = "https://watt-backend-qin8.onrender.com/api";
const LOCAL_API_BASE = "http://localhost:8000/api";

function getApiBase(): string {
  if (process.env.NEXT_PUBLIC_API_URL) return process.env.NEXT_PUBLIC_API_URL;
  const isLocal =
    typeof window !== "undefined" && ["localhost", "127.0.0.1"].includes(window.location.hostname);
  return isLocal ? LOCAL_API_BASE : PRODUCTION_API_BASE;
}

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${getApiBase()}${path}`);
  if (!res.ok) {
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  return res.json();
}

export function getDiscos(): Promise<Disco[]> {
  return apiGet<Disco[]>("/discos/");
}

export function getAppliances(): Promise<Appliance[]> {
  return apiGet<Appliance[]>("/appliances/");
}

export interface CalculateItemPayload {
  appliance_id: number | null;
  name?: string;
  watts: number;
  quantity: number;
  hours_per_day: number;
}

export interface CalculatePayload {
  disco_id: number;
  band: string;
  customer_type: CustomerType;
  scenario: Scenario;
  items: CalculateItemPayload[];
}

export async function calculate(payload: CalculatePayload): Promise<CalculationResult> {
  const res = await fetch(`${getApiBase()}/calculate/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.detail ?? `Calculation failed with status ${res.status}`);
  }
  return res.json();
}

export interface WaitlistResponse {
  count: number;
  already_joined?: boolean;
}

export function getWaitlistCount(): Promise<WaitlistResponse> {
  return apiGet<WaitlistResponse>("/waitlist/");
}

export async function joinWaitlist(email: string): Promise<WaitlistResponse> {
  const res = await fetch(`${getApiBase()}/waitlist/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.email?.[0] ?? "Couldn't join the waitlist. Please try again.");
  }
  return res.json();
}
