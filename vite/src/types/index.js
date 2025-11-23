export type Role = "ADMIN" | "DOKTER" | "APOTEKER" | "KEPALA";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

export interface Patient {
  id: string;
  medicalRecordNo: string;
  name: string;
  dob: string;
  gender: "L" | "P";
  phone: string;
  address: string;
}

export type QueueStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";

export interface QueueItem {
  id: string;
  patientId: string;
  doctorId?: string;
  status: QueueStatus;
  scheduledAt: string;
}

export interface Examination {
  id: string;
  patientId: string;
  doctorId: string;
  queueId?: string;
  complaint: string;
  diagnosis: string;
  notes?: string;
  createdAt: string;
}

export interface Prescription {
  id: string;
  examinationId: string;
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: string;
  sentToPharmacy: boolean;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  description?: string;
  stock: number;
  unit: string;
}

export interface Payment {
  id: string;
  patientId: string;
  amount: number;
  method: "cash" | "transfer" | "card";
  status: "PENDING" | "PAID" | "VOID";
  createdAt: string;
}

export interface Report {
  id: string;
  type: "DAILY" | "MONTHLY";
  period: string;
  totalPatients: number;
  totalIncome: number;
  prescriptions: number;
}

export interface Schedule {
  id: string;
  userId: string;
  role: Role;
  day: string;
  shift: string;
}

export interface ExaminationPayload {
  complaint: string;
  diagnosis: string;
  notes?: string;
}

export interface PrescriptionPayload {
  medicineId: string;
  dosage: string;
  frequency: string;
  duration: string;
}

export interface PaymentPayload {
  patientId: string;
  amount: number;
  method: "cash" | "transfer" | "card";
}

export interface SchedulePayload {
  userId: string;
  role: Role;
  day: string;
  shift: string;
}
