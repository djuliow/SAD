import {
  Activity,
  Users,
  ListChecks,
  CreditCard,
  BarChart3,
  CalendarDays,
  Stethoscope,
  History,
  Pill,
  Package2,
  Gauge
} from "lucide-react";

type IconName =
  | "activity"
  | "users"
  | "list"
  | "credit-card"
  | "chart"
  | "calendar"
  | "stethoscope"
  | "history"
  | "pill"
  | "package";

export const LucideIconMap: Record<string, React.ComponentType<any>> = {
  activity: Activity,
  users: Users,
  list: ListChecks,
  "credit-card": CreditCard,
  chart: BarChart3,
  calendar: CalendarDays,
  stethoscope: Stethoscope,
  history: History,
  pill: Pill,
  package: Package2,
  gauge: Gauge
};

export type { IconName };
