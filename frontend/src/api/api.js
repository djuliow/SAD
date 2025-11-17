import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const login = (data) => API.post("/auth/login", data);
export const getPatients = () => API.get("/patients");
export const addPatient = (data) => API.post("/patients", data);
export const getReports = () => API.get("/reports");
// Add other API calls as needed
export const getQueue = () => API.get("/queue");
export const updateQueueStatus = (id, data) => API.put(`/queue/${id}`, data);
export const getDrugs = () => API.get("/drugs");
export const updateDrugStock = (id, data) => API.put(`/drugs/${id}`, data);
export const addPrescription = (data) => API.post("/drugs/prescriptions", data);
export const recordPayment = (data) => API.post("/payments", data);
export const getSchedules = () => API.get("/schedules");
export const createSchedule = (data) => API.post("/schedules", data);
export const updateSchedule = (id, data) => API.put(`/schedules/${id}`, data);
export const deleteSchedule = (id) => API.delete(`/schedules/${id}`);
export const saveExamination = (data) => API.post("/doctors/examinations", data);
