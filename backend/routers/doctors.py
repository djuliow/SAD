from fastapi import APIRouter, HTTPException, Query
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from models.report import Examination, ExaminationCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/doctors", tags=["Doctors"])

# --- Models for Dashboard ---
class LatestExaminationSummary(BaseModel):
    patient_name: str
    diagnosis: str
    date: str

class DashboardSummary(BaseModel):
    waiting_count: int
    in_progress_count: int
    latest_examination: Optional[LatestExaminationSummary] = None

# --------------------------

@router.get("/dashboard-summary", response_model=DashboardSummary)
def get_dashboard_summary(doctor_id: int = Query(...)):
    db = read_db()
    queues = db.get("queue", [])
    examinations = db.get("examinations", [])
    patients = db.get("patients", [])

    # Calculate queue counts
    waiting_count = len([q for q in queues if q["status"] == "menunggu"])
    in_progress_count = len([q for q in queues if q["status"] == "diperiksa"])

    # Find doctor's latest examination
    doctors_examinations = [e for e in examinations if e["doctor_id"] == doctor_id]
    if not doctors_examinations:
        return DashboardSummary(
            waiting_count=waiting_count,
            in_progress_count=in_progress_count,
            latest_examination=None
        )

    latest_exam = max(doctors_examinations, key=lambda e: e['date'])
    
    patient_name = "Unknown"
    patient = next((p for p in patients if p["id"] == latest_exam["patient_id"]), None)
    if patient:
        patient_name = patient["name"]
        
    latest_exam_summary = LatestExaminationSummary(
        patient_name=patient_name,
        diagnosis=latest_exam["diagnosis"],
        date=latest_exam["date"]
    )

    return DashboardSummary(
        waiting_count=waiting_count,
        in_progress_count=in_progress_count,
        latest_examination=latest_exam_summary
    )


@router.post("/examinations", response_model=Examination)
def create_examination_record(payload: ExaminationCreate):
    db = read_db()
    examinations = db.get("examinations", [])
    queues = db.get("queue", [])

    # Find patient_id from queue
    queue_entry = next((q for q in queues if q["id"] == payload.queue_id), None)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    next_examination_id = max([e.get("id", 0) for e in examinations]) + 1 if examinations else 1
    
    new_examination = Examination(
        id=next_examination_id,
        patient_id=queue_entry["patient_id"],
        doctor_id=payload.doctor_id,
        complaint=payload.complaint,
        diagnosis=payload.diagnosis,
        notes=payload.notes,
        date=datetime.now().isoformat()
    )

    examinations.append(new_examination.dict())
    db["examinations"] = examinations
    write_db(db)
    
    return new_examination