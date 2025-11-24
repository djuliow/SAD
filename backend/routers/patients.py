from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from models.patient import Patient, PatientCreate
from models.queue import QueueEntry
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/patients", tags=["Patients"])

# --- Models for History Endpoint ---
class PrescriptionDetail(BaseModel):
    drug_name: str
    quantity: int
    notes: str

class ExaminationWithDetails(BaseModel):
    id: int
    doctor_id: int
    complaint: str
    diagnosis: str
    notes: str
    date: str
    prescriptions: List[PrescriptionDetail]

class PaymentDetail(BaseModel):
    id: int
    total_amount: int
    payment_date: str
    method: str

class PatientHistory(BaseModel):
    patient_info: Patient
    examinations: List[ExaminationWithDetails]
    payments: List[PaymentDetail]

# -----------------------------------------

@router.get("/", response_model=List[Patient])
def get_patients():
    db = read_db()
    return db.get("patients", [])

@router.get("/{patient_id}/history", response_model=PatientHistory)
def get_patient_history(patient_id: int):
    db = read_db()
    
    # Fetch all data tables
    patients = db.get("patients", [])
    examinations = db.get("examinations", [])
    prescriptions = db.get("prescriptions", [])
    drugs = db.get("drugs", [])
    payments = db.get("payments", [])
    
    # Find the patient
    patient_info = next((p for p in patients if p["id"] == patient_id), None)
    if not patient_info:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Aggregate Examinations and their Prescriptions
    patient_examinations = [e for e in examinations if e["patient_id"] == patient_id]
    examinations_with_details = []

    for exam in sorted(patient_examinations, key=lambda e: e['date'], reverse=True):
        exam_prescriptions = [p for p in prescriptions if p["examination_id"] == exam["id"]]
        prescriptions_details = []
        for pres in exam_prescriptions:
            drug_info = next((d for d in drugs if d["id"] == pres["drug_id"]), None)
            prescriptions_details.append(PrescriptionDetail(
                drug_name=drug_info["nama"] if drug_info else "Unknown Drug",
                quantity=pres["quantity"],
                notes=pres["notes"],
            ))
        
        examinations_with_details.append(ExaminationWithDetails(
            **exam,
            prescriptions=prescriptions_details
        ))

    # Aggregate Payments
    patient_payments = [p for p in payments if p["patient_id"] == patient_id]
    payments_details = [PaymentDetail(**p) for p in sorted(patient_payments, key=lambda p: p['payment_date'], reverse=True)]

    return PatientHistory(
        patient_info=patient_info,
        examinations=examinations_with_details,
        payments=payments_details
    )


@router.post("/", response_model=Patient)
def register_patient(patient_create: PatientCreate):
    db = read_db()
    patients = db.get("patients", [])
    queue = db.get("queue", [])

    # --- Auto-generate Medical Record Number ---
    if not patients:
        next_mrn_number = 1
    else:
        # Find the highest existing MRN
        highest_mrn = 0
        for p in patients:
            try:
                # Expects format like "RM001"
                num_part = int(p.get("medicalRecordNo", "RM000")[2:])
                if num_part > highest_mrn:
                    highest_mrn = num_part
            except (ValueError, TypeError):
                # Handle cases where MRN is malformed or not a string
                continue
        next_mrn_number = highest_mrn + 1
    
    new_medical_record_no = f"RM{next_mrn_number:03d}"
    # -----------------------------------------

    next_patient_id = max([p.get("id", 0) for p in patients]) + 1 if patients else 101
    
    # Create a new patient dictionary from the payload, excluding the (now ignored) medicalRecordNo
    patient_data = patient_create.dict(exclude={"medicalRecordNo"})

    new_patient = Patient(
        id=next_patient_id, 
        status="menunggu",
        medicalRecordNo=new_medical_record_no, 
        **patient_data
    )
    patients.append(new_patient.dict())

    next_queue_id = max([q.get("id", 0) for q in queue]) + 1 if queue else 1
    new_queue_entry = QueueEntry(
        id=next_queue_id, 
        patient_id=new_patient.id, 
        patient_name=new_patient.name, 
        medicalRecordNo=new_medical_record_no,
        status="menunggu"
    )
    queue.append(new_queue_entry.dict())

    db["patients"] = patients
    db["queue"] = queue
    write_db(db)
    return new_patient
