import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { patients } from "/src/lib/mockData";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (value) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(value);

export const findPatientName = (patientId) =>
  patients.find((p) => p.id === patientId)?.name ?? "-";
