import { apiRequest } from './apiService';

export async function authenticate(username, password, role) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, role }),
  });
  return response;
}

export async function getAdminDashboardSummary() {
  const response = await apiRequest('/admin/dashboard-summary');
  return response;
}

export async function listPatients() {
  const response = await apiRequest('/patients/');
  return response;
}

export async function getPatientHistory(patientId) {
  const response = await apiRequest(`/patients/${patientId}/history`);
  return response;
}

export async function registerPatient(payload) {
  const response = await apiRequest('/patients/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function updatePatient(id, payload) {
  const response = await apiRequest(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function listQueues(status, doctorId) {
  let endpoint = '/queue/';
  const params = new URLSearchParams();
  if (status) params.append('status', status);
  if (doctorId) params.append('doctor_id', doctorId);

  if (params.toString()) {
    endpoint += `?${params.toString()}`;
  }

  const response = await apiRequest(endpoint);
  return response;
}

export async function advanceQueue(queueId, nextStatus) {
  const response = await apiRequest(`/queue/${queueId}`, {
    method: 'PUT',
    body: JSON.stringify({ status: nextStatus }),
  });
  return response;
}

export async function cancelQueue(queueId) {
  const response = await apiRequest(`/queue/${queueId}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getQueueDetails(queueId) {
  const response = await apiRequest(`/queue/${queueId}/details`);
  return response;
}

export async function getDoctorDashboardSummary(doctorId) {
  const response = await apiRequest(`/doctors/dashboard-summary?doctor_id=${doctorId}`);
  return response;
}

export async function createExamination(queueId, doctorId, payload) {
  const requestBody = {
    queue_id: queueId,
    doctor_id: doctorId,
    ...payload
  };
  const response = await apiRequest('/doctors/examinations', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return response;
}

export async function listExaminations(patientId) {
  let endpoint = '/examinations';
  if (patientId) {
    endpoint += `?patient_id=${patientId}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function createPrescription(examId, payload) {
  const requestBody = {
    examination_id: examId,
    ...payload
  };
  const response = await apiRequest('/prescriptions/', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return response;
}

export async function updatePrescription(prescriptionId, payload) {
  const response = await apiRequest(`/prescriptions/${prescriptionId}`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function getPrescriptionReport(status) {
  let endpoint = '/prescriptions/report';
  if (status) {
    endpoint += `?status=${status}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function listPrescriptions(status) {
  let endpoint = '/prescriptions/';
  if (status) {
    endpoint += `?status=${status}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function fulfillPrescription(prescriptionId) {
  const response = await apiRequest(`/prescriptions/${prescriptionId}/fulfill`, {
    method: 'PATCH',
  });
  return response;
}

export async function createDrug(payload) {
  const response = await apiRequest('/drugs/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function listMedicines() {
  const response = await apiRequest('/drugs/');
  return response;
}

export async function updateStock(medicineId, amount) {
  const response = await apiRequest(`/drugs/${medicineId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ change_amount: amount }),
  });
  return response;
}

export async function updateMedicine(id, data) {
  const response = await apiRequest(`/drugs/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
  return response;
}

export async function listPaymentsByDate(date) {
  let endpoint = '/payments/';
  if (date) {
    endpoint += `?date=${date}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function listPendingBills() {
  const response = await apiRequest('/bills/pending');
  return response;
}

export async function createPayment(payload) {
  const response = await apiRequest('/payments/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function listAllPayments() {
  const response = await apiRequest('/payments/');
  return response;
}

export async function listReports() {
  const response = await apiRequest('/reports/');
  return response;
}

export async function generateReport(type, period, manual_summary = null) {
  const payload = { type, period };
  if (manual_summary) {
    payload.manual_summary = manual_summary;
  }
  const response = await apiRequest('/reports/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function getPendingPatientsForApotek() {
  const response = await apiRequest('/apotek/pending-patients');
  return response;
}

export async function getApotekQueue() {
  const response = await apiRequest('/apotek/queue');
  return response;
}

export async function setApotekStatus(queueId) {
  const response = await apiRequest(`/apotek/${queueId}/set-apotek-status`, {
    method: 'PATCH',
  });
  return response;
}

export async function fulfillAllPrescriptions(examinationId) {
  const response = await apiRequest(`/prescriptions/fulfill-all/${examinationId}`, {
    method: 'PATCH',
  });
  return response;
}


export async function listSchedules(role) {
  let endpoint = '/schedules/';
  if (role) {
    endpoint += `?role=${role}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function upsertSchedule(payload) {

  const response = await apiRequest('/schedules/', {

    method: 'POST',

    body: JSON.stringify(payload),

  });

  return response;

}



export async function listEmployees() {
  const response = await apiRequest('/employees/');
  return response;
}

export async function createEmployee(payload) {
  const response = await apiRequest('/employees/', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function updateEmployee(id, payload) {
  const response = await apiRequest(`/employees/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function deleteEmployee(id) {
  const response = await apiRequest(`/employees/${id}`, {
    method: 'DELETE',
  });
  return response;
}

export async function getPatientStats() {
  const response = await apiRequest('/patients/stats');
  return response;
}

export async function getDoctorPerformance() {
  const response = await apiRequest('/doctors/performance');
  return response;
}

export async function getMyPatientsMedicalRecords(doctorId) {
  const response = await apiRequest(`/doctors/medical-records/my-patients?doctor_id=${doctorId}`);
  return response;
}

export async function getAllMedicalRecords(doctorId) {
  const response = await apiRequest(`/doctors/medical-records/all?doctor_id=${doctorId}`);
  return response;
}
