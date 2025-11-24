from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from models.queue import QueueEntry, QueueUpdateStatus
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/queue", tags=["Queue"])

@router.get("/", response_model=List[QueueEntry])
def get_queue():
    db = read_db()
    queue = db.get("queue", [])
    patients = db.get("patients", [])
    patient_map = {p["id"]: p for p in patients}

    for q in queue:
        if "medicalRecordNo" not in q:
            patient = patient_map.get(q["patient_id"])
            if patient:
                q["medicalRecordNo"] = patient.get("medicalRecordNo", "RM000")
            else:
                q["medicalRecordNo"] = "RM000"
    
    return queue

@router.get("/{queue_id}/details")
def get_queue_details(queue_id: int):
    db = read_db()
    queue = db.get("queue", [])
    patients = db.get("patients", [])
    examinations = db.get("examinations", [])

    queue_entry = next((q for q in queue if q["id"] == queue_id), None)
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    patient = next((p for p in patients if p["id"] == queue_entry["patient_id"]), None)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient for this queue not found")

    patient_history = [e for e in examinations if e["patient_id"] == patient["id"]]

    return {
        "queue": queue_entry,
        "patient": patient,
        "history": patient_history
    }

@router.put("/{queue_id}", response_model=QueueEntry)
def update_queue_status(queue_id: int, status_update: QueueUpdateStatus):
    db = read_db()
    queue = db.get("queue", [])
    patients = db.get("patients", [])

    for i, entry in enumerate(queue):
        if entry["id"] == queue_id:
            queue[i]["status"] = status_update.status
            # Update patient status as well
            for patient in patients:
                if patient["id"] == entry["patient_id"]:
                    patient["status"] = status_update.status
                    break
            db["queue"] = queue
            db["patients"] = patients
            write_db(db)
            return queue[i]
    raise HTTPException(status_code=404, detail="Queue entry not found")

@router.delete("/{queue_id}", status_code=status.HTTP_200_OK)
def cancel_queue_entry(queue_id: int):
    db = read_db()
    queue = db.get("queue", [])
    
    initial_len = len(queue)
    queue = [q for q in queue if q["id"] != queue_id]
    
    if len(queue) == initial_len:
        raise HTTPException(status_code=404, detail="Queue entry not found")
        
    db["queue"] = queue
    write_db(db)
    return {"message": f"Queue entry {queue_id} cancelled successfully"}