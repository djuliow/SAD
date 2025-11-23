import { apiRequest } from './apiService';

export async function authenticate(username, password, role) {
  const response = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ username, password, role }),
  });
  return response;
}

export async function listPatients() {
  const response = await apiRequest('/patients');
  return response;
}

export async function registerPatient(payload) {
  const response = await apiRequest('/patients', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function listQueues(status) {
  let endpoint = '/queue';
  if (status) {
    endpoint += `?status=${status}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function advanceQueue(queueId, nextStatus) {
  const response = await apiRequest(`/queue/${queueId}/advance`, {
    method: 'PATCH',
    body: JSON.stringify({ status: nextStatus }),
  });
  return response;
}

export async function createExamination(queueId, doctorId, payload) {
  const requestBody = {
    queue_id: queueId,
    doctor_id: doctorId,
    ...payload
  };
  const response = await apiRequest('/examinations', {
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
  const response = await apiRequest('/prescriptions', {
    method: 'POST',
    body: JSON.stringify(requestBody),
  });
  return response;
}

export async function listPrescriptions(sentToPharmacy) {
  let endpoint = '/prescriptions';
  if (sentToPharmacy !== undefined) {
    endpoint += `?sent_to_pharmacy=${sentToPharmacy}`;
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

export async function listMedicines() {
  const response = await apiRequest('/drugs');
  return response;
}

export async function updateStock(medicineId, amount) {
  const response = await apiRequest(`/drugs/${medicineId}/stock`, {
    method: 'PATCH',
    body: JSON.stringify({ change_amount: amount }),
  });
  return response;
}

export async function listPayments() {
  const response = await apiRequest('/payments');
  return response;
}

export async function createPayment(payload) {
  const response = await apiRequest('/payments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}

export async function listReports(type) {
  let endpoint = '/reports';
  if (type) {
    endpoint += `?type=${type}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function generateReport(type, period) {
  const response = await apiRequest('/reports', {
    method: 'POST',
    body: JSON.stringify({ type, period }),
  });
  return response;
}

export async function listSchedules(role) {
  let endpoint = '/schedules';
  if (role) {
    endpoint += `?role=${role}`;
  }
  const response = await apiRequest(endpoint);
  return response;
}

export async function upsertSchedule(payload) {
  const response = await apiRequest('/schedules', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  return response;
}