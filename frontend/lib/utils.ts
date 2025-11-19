import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { patients } from "./mockData";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export const findPatientName = (patientId: string) =>
  patients.find((p) => p.id === patientId)?.name ?? "-";
