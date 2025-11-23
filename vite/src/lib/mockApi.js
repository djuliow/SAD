
import { addDays, formatISO } from "date-fns";
import { medicines as seedMedicines, patients as seedPatients, payments as seedPayments, queues as seedQueues, reports as seedReports, schedules as seedSchedules, examinations as seedExaminations, users } from "./mockData";

let patientStore = [...seedPatients];
let queueStore = [...seedQueues];
let examinationStore = [...seedExaminations];
let prescriptionStore = [
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

export async function authenticate(email, password) {
  await simulateDelay();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error("Kredensial tidak valid");
  return { ...user, token: "dummy-token" };
}

export async function listPatients() {
  await simulateDelay();
  return patientStore;
}

export async function registerPatient(payload) {
  await simulateDelay();
  const exists = patientStore.some((p) => p.medicalRecordNo === payload.medicalRecordNo);
  if (exists) throw new Error("Nomor rekam medis sudah terdaftar");
  const newPatient = { id: `p-${Date.now()}`, ...payload };
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
  return newPatient;
}

export async function listQueues(status) {
  await simulateDelay();
  return status ? queueStore.filter((q) => q.status === status) : queueStore;
}

export async function advanceQueue(queueId, nextStatus) {
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
  return queueStore.find((q) => q.id === queueId);
}

export async function createExamination(
  queueId,
  doctorId,
  payload
) {
  await simulateDelay();
  const queueItem = queueStore.find((q) => q.id === queueId);
  if (!queueItem) throw new Error("Antrean tidak ditemukan");
  const exam = {
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
  return exam;
}

export async function listExaminations(patientId) {
  await simulateDelay();
  return patientId
    ? examinationStore.filter((ex) => ex.patientId === patientId)
    : examinationStore;
}

export async function createPrescription(
  examId,
  payload
) {
  await simulateDelay();
  const stock = medicineStore.find((m) => m.id === payload.medicineId);
  if (!stock || stock.stock <= 0) {
    throw new Error("Stok obat habis");
  }
  stock.stock -= 1;
  const prescription = {
    id: `rx-${Date.now()}`,
    examinationId: examId,
    medicineId: payload.medicineId,
    dosage: payload.dosage,
    frequency: payload.frequency,
    duration: payload.duration,
    sentToPharmacy: true
  };
  prescriptionStore = [prescription, ...prescriptionStore];
  return prescription;
}

export async function listPrescriptions(sentToPharmacy) {
  await simulateDelay();
  return typeof sentToPharmacy === "boolean"
    ? prescriptionStore.filter((p) => p.sentToPharmacy === sentToPharmacy)
    : prescriptionStore;
}

export async function fulfillPrescription(prescriptionId) {
  await simulateDelay();
  prescriptionStore = prescriptionStore.map((p) =>
    p.id === prescriptionId ? { ...p, sentToPharmacy: false } : p
  );
  return prescriptionStore.find((p) => p.id === prescriptionId);
}

export async function listMedicines() {
  await simulateDelay();
  return medicineStore;
}

export async function updateStock(medicineId, amount) {
  await simulateDelay();
  medicineStore = medicineStore.map((m) =>
    m.id === medicineId ? { ...m, stock: Math.max(0, m.stock + amount) } : m
  );
  return medicineStore.find((m) => m.id === medicineId);
}

export async function listPayments() {
  await simulateDelay();
  return paymentStore;
}

export async function createPayment(payload) {
  await simulateDelay();
  const payment = {
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
  return payment;
}

export async function listReports(type) {
  await simulateDelay();
  return type ? reportStore.filter((report) => report.type === type) : reportStore;
}

export async function generateReport(type, period) {
  await simulateDelay();
  const newReport = {
    id: `rep-${Date.now()}`,
    type,
    period,
    totalIncome: Math.floor(Math.random() * 50_000_000),
    totalPatients: Math.floor(Math.random() * 500),
    prescriptions: Math.floor(Math.random() * 400)
  };
  reportStore = [newReport, ...reportStore];
  return newReport;
}

export async function listSchedules(role) {
  await simulateDelay();
  return role ? scheduleStore.filter((sch) => sch.role === role) : scheduleStore;
}

export async function upsertSchedule(payload) {
  await simulateDelay();
  let schedule = scheduleStore.find((sch) => sch.id === payload.userId + payload.day);
  if (schedule) {
    schedule = { ...schedule, ...payload };
    scheduleStore = scheduleStore.map((sch) => (sch.id === schedule?.id ? schedule : sch));
  } else {
    schedule = { id: payload.userId + payload.day, ...payload };
    scheduleStore = [schedule, ...scheduleStore];
  }
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
