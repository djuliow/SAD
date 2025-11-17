from fastapi import APIRouter, HTTPException
from typing import List
from models.patient import Patient, PatientCreate
from models.queue import QueueEntry
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/patients", tags=["Patients"])

@router.get("/", response_model=List[Patient])
def get_patients():
    db = read_db()
    return db.get("patients", [])

@router.post("/", response_model=Patient)
def register_patient(patient_create: PatientCreate):
    db = read_db()
    patients = db.get("patients", [])
    queue = db.get("queue", [])

    next_patient_id = max([p.get("id", 0) for p in patients]) + 1 if patients else 101
    new_patient = Patient(id=next_patient_id, status="menunggu", **patient_create.dict())
    patients.append(new_patient.dict())

    next_queue_id = max([q.get("id", 0) for q in queue]) + 1 if queue else 1
    new_queue_entry = QueueEntry(id=next_queue_id, patient_id=new_patient.id, patient_name=new_patient.nama, status="menunggu")
    queue.append(new_queue_entry.dict())

    db["patients"] = patients
    db["queue"] = queue
    write_db(db)
    return new_patient