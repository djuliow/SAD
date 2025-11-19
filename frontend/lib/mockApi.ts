"use server";

import { revalidatePath } from "next/cache";
import { addDays, formatISO } from "date-fns";
import {
  Examination,
  ExaminationPayload,
  Patient,
  Payment,
  PaymentPayload,
  Prescription,
  PrescriptionPayload,
  QueueItem,
  QueueStatus,
  Report,
  Role,
  Schedule,
  SchedulePayload,
  User
} from "@/types";
import { medicines as seedMedicines, patients as seedPatients, payments as seedPayments, queues as seedQueues, reports as seedReports, schedules as seedSchedules, examinations as seedExaminations, users } from "./mockData";

let patientStore = [...seedPatients];
let queueStore = [...seedQueues];
let examinationStore = [...seedExaminations];
let prescriptionStore: Prescription[] = [
  {
    id: "rx-001",
    examinationId: "ex-001",
    medicineId: "m-001",
    dosage: "3x1",
    frequency: "setiap 8 jam",
    duration: "5 hari",
    sentToPharmacy: true
  }
];
let medicineStore = [...seedMedicines];
let paymentStore = [...seedPayments];
let reportStore = [...seedReports];
let scheduleStore = [...seedSchedules];

const simulateDelay = async () => new Promise((resolve) => setTimeout(resolve, 300));

export async function authenticate(email: string, password: string) {
  await simulateDelay();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Kredensial tidak valid");
  return { ...user, token: "dummy-token" };
}

export async function listPatients() {
  await simulateDelay();
  return patientStore;
}

export async function registerPatient(payload: Omit<Patient, "id">) {
  await simulateDelay();
  const exists = patientStore.some((p) => p.medicalRecordNo === payload.medicalRecordNo);
  if (exists) throw new Error("Nomor rekam medis sudah terdaftar");
  const newPatient: Patient = { id: `p-${Date.now()}`, ...payload };
  patientStore = [newPatient, ...patientStore];
  queueStore = [
    {
      id: `q-${Date.now()}`,
      patientId: newPatient.id,
      status: "PENDING",
      scheduledAt: formatISO(new Date())
    },
    ...queueStore
  ];
  revalidatePath("/admin/pendaftaran");
  revalidatePath("/admin/antrian");
  return newPatient;
}

export async function listQueues(status?: QueueStatus) {
  await simulateDelay();
  return status ? queueStore.filter((q) => q.status === status) : queueStore;
}

export async function advanceQueue(queueId: string, nextStatus: QueueStatus) {
  await simulateDelay();
  queueStore = queueStore.map((q) => (q.id === queueId ? { ...q, status: nextStatus } : q));
  if (nextStatus === "COMPLETED") {
    reportStore = reportStore.map((report) =>
      report.type === "DAILY"
        ? {
            ...report,
            totalPatients: report.totalPatients + 1
          }
        : report
    );
  }
  revalidatePath("/dokter/antrian");
  revalidatePath("/admin/antrian");
  return queueStore.find((q) => q.id === queueId);
}

export async function createExamination(
  queueId: string,
  doctorId: string,
  payload: ExaminationPayload
) {
  await simulateDelay();
  const queueItem = queueStore.find((q) => q.id === queueId);
  if (!queueItem) throw new Error("Antrean tidak ditemukan");
  const exam: Examination = {
    id: `ex-${Date.now()}`,
    patientId: queueItem.patientId,
    doctorId,
    queueId,
    complaint: payload.complaint,
    diagnosis: payload.diagnosis,
    notes: payload.notes,
    createdAt: formatISO(new Date())
  };
  examinationStore = [exam, ...examinationStore];
  queueStore = queueStore.map((q) => (q.id === queueId ? { ...q, status: "COMPLETED" } : q));
  revalidatePath(`/dokter/pemeriksaan/${queueId}`);
  return exam;
}

export async function listExaminations(patientId?: string) {
  await simulateDelay();
  return patientId
    ? examinationStore.filter((ex) => ex.patientId === patientId)
    : examinationStore;
}

export async function createPrescription(
  examId: string,
  payload: PrescriptionPayload
) {
  await simulateDelay();
  const stock = medicineStore.find((m) => m.id === payload.medicineId);
  if (!stock || stock.stock <= 0) {
    throw new Error("Stok obat habis");
  }
  stock.stock -= 1;
  const prescription: Prescription = {
    id: `rx-${Date.now()}`,
    examinationId: examId,
    medicineId: payload.medicineId,
    dosage: payload.dosage,
    frequency: payload.frequency,
    duration: payload.duration,
    sentToPharmacy: true
  };
  prescriptionStore = [prescription, ...prescriptionStore];
  revalidatePath("/apotek/resep");
  return prescription;
}

export async function listPrescriptions(sentToPharmacy?: boolean) {
  await simulateDelay();
  return typeof sentToPharmacy === "boolean"
    ? prescriptionStore.filter((p) => p.sentToPharmacy === sentToPharmacy)
    : prescriptionStore;
}

export async function fulfillPrescription(prescriptionId: string) {
  await simulateDelay();
  prescriptionStore = prescriptionStore.map((p) =>
    p.id === prescriptionId ? { ...p, sentToPharmacy: false } : p
  );
  revalidatePath("/apotek/resep");
  return prescriptionStore.find((p) => p.id === prescriptionId);
}

export async function listMedicines() {
  await simulateDelay();
  return medicineStore;
}

export async function updateStock(medicineId: string, amount: number) {
  await simulateDelay();
  medicineStore = medicineStore.map((m) =>
    m.id === medicineId ? { ...m, stock: Math.max(0, m.stock + amount) } : m
  );
  revalidatePath("/apotek/stok");
  return medicineStore.find((m) => m.id === medicineId);
}

export async function listPayments() {
  await simulateDelay();
  return paymentStore;
}

export async function createPayment(payload: PaymentPayload) {
  await simulateDelay();
  const payment: Payment = {
    id: `pay-${Date.now()}`,
    status: "PAID",
    createdAt: formatISO(new Date()),
    ...payload
  };
  paymentStore = [payment, ...paymentStore];
  reportStore = reportStore.map((report) =>
    report.type === "DAILY"
      ? { ...report, totalIncome: report.totalIncome + payload.amount }
      : report
  );
  revalidatePath("/admin/pembayaran");
  revalidatePath("/admin/laporan");
  revalidatePath("/kepala/laporan");
  return payment;
}

export async function listReports(type?: Report["type"]) {
  await simulateDelay();
  return type ? reportStore.filter((report) => report.type === type) : reportStore;
}

export async function generateReport(type: Report["type"], period: string) {
  await simulateDelay();
  const newReport: Report = {
    id: `rep-${Date.now()}`,
    type,
    period,
    totalIncome: Math.floor(Math.random() * 50_000_000),
    totalPatients: Math.floor(Math.random() * 500),
    prescriptions: Math.floor(Math.random() * 400)
  };
  reportStore = [newReport, ...reportStore];
  revalidatePath("/kepala/laporan");
  return newReport;
}

export async function listSchedules(role?: Role) {
  await simulateDelay();
  return role ? scheduleStore.filter((sch) => sch.role === role) : scheduleStore;
}

export async function upsertSchedule(payload: SchedulePayload) {
  await simulateDelay();
  let schedule = scheduleStore.find((sch) => sch.id === payload.userId + payload.day);
  if (schedule) {
    schedule = { ...schedule, ...payload };
    scheduleStore = scheduleStore.map((sch) => (sch.id === schedule?.id ? schedule! : sch));
  } else {
    schedule = { id: payload.userId + payload.day, ...payload } as Schedule;
    scheduleStore = [schedule, ...scheduleStore];
  }
  revalidatePath("/admin/jadwal");
  revalidatePath("/kepala/jadwal");
  return schedule;
}

export async function resetState() {
  patientStore = [...seedPatients];
  queueStore = [...seedQueues];
  examinationStore = [...seedExaminations];
  prescriptionStore = [];
  medicineStore = [...seedMedicines];
  paymentStore = [...seedPayments];
  reportStore = [...seedReports];
  scheduleStore = [...seedSchedules];
  return true;
}
