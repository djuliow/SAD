import { addDays, formatISO } from "date-fns";

export const users = [
  { id: "u-admin", name: "Rahma Admin", email: "admin@sentosa.id", role: "ADMIN" },
  { id: "u-dokter", name: "Dr. Bima", email: "dokter@sentosa.id", role: "DOKTER" },
  { id: "u-apoteker", name: "Sari Apoteker", email: "apoteker@sentosa.id", role: "APOTEKER" },
  { id: "u-kepala", name: "drg. Dina", email: "kepala@sentosa.id", role: "KEPALA" }
];

export const patients = [
  {
    id: "p-001",
    medicalRecordNo: "RM001",
    name: "Andi Wijaya",
    dob: "1990-01-12",
    gender: "L",
    phone: "081234567891",
    address: "Jl. Kenanga 12"
  },
  {
    id: "p-002",
    medicalRecordNo: "RM002",
    name: "Sinta Dewi",
    dob: "1988-03-04",
    gender: "P",
    phone: "081234567892",
    address: "Jl. Mawar 5"
  }
];

export const medicines = [
  { id: "m-001", name: "Paracetamol", category: "Analgesic", description: "Obat demam", stock: 120, unit: "tablet" },
  { id: "m-002", name: "Amoxicillin", category: "Antibiotik", description: "Infeksi bakteri", stock: 60, unit: "kapsul" },
  { id: "m-003", name: "Salbutamol", category: "Bronkodilator", description: "Sesak napas", stock: 40, unit: "tablet" }
];

export const queues = [
  {
    id: "q-001",
    patientId: "p-001",
    doctorId: "u-dokter",
    status: "PENDING",
    scheduledAt: formatISO(new Date())
  },
  {
    id: "q-002",
    patientId: "p-002",
    doctorId: "u-dokter",
    status: "IN_PROGRESS",
    scheduledAt: formatISO(addDays(new Date(), 1))
  }
];

export const examinations = [
  {
    id: "ex-001",
    patientId: "p-001",
    doctorId: "u-dokter",
    queueId: "q-001",
    complaint: "Demam tinggi",
    diagnosis: "Demam viral",
    notes: "Istirahat dan banyak minum",
    createdAt: formatISO(new Date())
  }
];

export const payments = [
  {
    id: "pay-001",
    patientId: "p-001",
    amount: 150000,
    method: "cash",
    status: "PAID",
    createdAt: formatISO(new Date())
  }
];

export const reports = [
  {
    id: "rep-daily-1",
    type: "DAILY",
    period: formatISO(new Date(), { representation: "date" }),
    totalPatients: 12,
    totalIncome: 1800000,
    prescriptions: 9
  },
  {
    id: "rep-monthly-1",
    type: "MONTHLY",
    period: "2025-10",
    totalPatients: 320,
    totalIncome: 42000000,
    prescriptions: 280
  }
];

export const schedules = [
  { id: "sch-001", userId: "u-dokter", role: "DOKTER", day: "Senin", shift: "Pagi" },
  { id: "sch-002", userId: "u-apoteker", role: "APOTEKER", day: "Selasa", shift: "Siang" },
  { id: "sch-003", userId: "u-kepala", role: "KEPALA", day: "Rabu", shift: "Pagi" }
];
