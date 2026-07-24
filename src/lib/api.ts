import type { Appliance, CalculationResult, Disco, Scenario } from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";

async function apiGet<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`);
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
  scenario: Scenario;
  items: CalculateItemPayload[];
}

export async function calculate(payload: CalculatePayload): Promise<CalculationResult> {
  const res = await fetch(`${API_BASE}/calculate/`, {
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
