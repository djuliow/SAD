from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from models.report import Examination, ExaminationCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/doctors", tags=["Doctors"])

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