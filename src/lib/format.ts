export function formatNaira(value: number, decimals = 2): string {
  return `₦${value.toLocaleString("en-NG", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })}`;
}

export function formatKwh(value: number): string {
  return `${value.toLocaleString("en-NG", { maximumFractionDigits: 2 })} kWh`;
}

export const DEFAULT_HOURS_BY_CATEGORY: Record<string, number> = {
  cooling: 8,
  kitchen: 1,
  laundry: 1,
  electronics: 5,
  lighting: 6,
  water: 1,
  other: 2,
};
