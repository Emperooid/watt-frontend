export type Band = "A" | "B" | "C" | "D" | "E";

export type CustomerType = "non_md" | "md1" | "md2";

export const CUSTOMER_TYPES: { value: CustomerType; label: string; hint: string }[] = [
  { value: "non_md", label: "Non-MD", hint: "Residential / most homes & small businesses" },
  { value: "md1", label: "MD1", hint: "Maximum Demand 1 — larger commercial" },
  { value: "md2", label: "MD2", hint: "Maximum Demand 2 — industrial" },
];

export interface TariffBand {
  band: Band;
  non_md_rate: string;
  md1_rate: string;
  md2_rate: string;
  min_hours_supply: number;
}

export interface Disco {
  id: number;
  code: string;
  name: string;
  is_verified: boolean;
  tariff_bands: TariffBand[];
}

export type ApplianceCategory =
  | "cooling"
  | "kitchen"
  | "laundry"
  | "electronics"
  | "lighting"
  | "water"
  | "other";

export interface Appliance {
  id: number;
  name: string;
  default_watts: number;
  category: ApplianceCategory;
  icon: string;
  has_inverter_alternative: boolean;
  inverter_savings_pct: number;
}

export type Scenario = "good" | "bad";

/** One row in the appliance table the user is building up. */
export interface WizardItem {
  clientId: string;
  applianceId: number | null;
  name: string;
  watts: number;
  quantity: number;
  hoursPerDay: number;
  category: ApplianceCategory;
  hasInverterAlternative: boolean;
  inverterSavingsPct: number;
}

export interface CalculationLineResult {
  name: string;
  watts: number;
  quantity: number;
  hours_per_day: number;
  effective_hours: number;
  kwh_per_day: number;
  cost_per_day: number;
}

export interface CalculationTotals {
  daily_kwh: number;
  daily_cost: number;
  weekly_cost: number;
  monthly_kwh: number;
  monthly_cost: number;
  yearly_cost: number;
}

export interface CalculationRanking {
  name: string;
  kwh_per_day: number;
  share_pct: number;
}

export interface GeneratorComparison {
  grid_cost_per_month: number;
  generator_cost_per_month: number;
  savings_amount: number;
  savings_pct: number;
  assumptions: string;
}

export interface CalculationResult {
  scenario: Scenario;
  rate_per_kwh: number;
  items: CalculationLineResult[];
  totals: CalculationTotals;
  ranking: CalculationRanking[];
  insights: string[];
  generator_comparison: GeneratorComparison;
  disco: string;
  band: Band;
  customer_type: CustomerType;
}
