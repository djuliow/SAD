from fastapi import APIRouter, HTTPException
from typing import List
from models.queue import QueueEntry, QueueUpdateStatus
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/queue", tags=["Queue"])

@router.get("/", response_model=List[QueueEntry])
def get_queue():
    db = read_db()
    return db.get("queue", [])

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