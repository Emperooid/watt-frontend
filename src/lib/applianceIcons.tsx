import { Droplet, Fan, Laptop, Lightbulb, Refrigerator, WashingMachine, Zap } from "lucide-react";
import type { ApplianceCategory } from "./types";

export const APPLIANCE_ICON_BY_CATEGORY: Record<ApplianceCategory, React.ComponentType<{ className?: string }>> = {
  cooling: Fan,
  kitchen: Refrigerator,
  laundry: WashingMachine,
  electronics: Laptop,
  lighting: Lightbulb,
  water: Droplet,
  other: Zap,
};

export function ApplianceIcon({ category, className }: { category: ApplianceCategory; className?: string }) {
  const Icon = APPLIANCE_ICON_BY_CATEGORY[category] ?? Zap;
  return <Icon className={className} />;
}
