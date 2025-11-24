from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date

from utils.json_db import read_db

router = APIRouter(prefix="/admin", tags=["Admin"])

# --- Models for Dashboard ---
class RecentQueue(BaseModel):
    id: int
    patient_name: str
    medicalRecordNo: str
    status: str

class AdminDashboardSummary(BaseModel):
    total_patients_all_time: int
    patients_today_count: int
    active_queue_count: int
    income_today: float
    recent_queues: List[RecentQueue]

# --------------------------

@router.get("/dashboard-summary", response_model=AdminDashboardSummary)
def get_admin_dashboard_summary():
    db = read_db()
    patients = db.get("patients", [])
    queues = db.get("queue", [])
    payments = db.get("payments", [])
    
    today = date.today()

    # --- Calculations ---
    
    # 1. Patient Counts
    total_patients_all_time = len(patients)
    
    patients_today_count = 0
    for q in queues:
        try:
            queue_date = datetime.fromisoformat(q["created_at"]).date()
            if queue_date == today:
                patients_today_count += 1
        except (ValueError, TypeError, KeyError):
            # Ignore entries with malformed or missing created_at
            continue

    # 2. Active Queue Count
    active_queue_count = len([q for q in queues if q.get("status") != "selesai"])

    # 3. Income Today
    income_today = 0
    for p in payments:
        try:
            payment_date = datetime.fromisoformat(p["payment_date"]).date()
            if payment_date == today:
                income_today += p.get("total_amount", 0)
        except (ValueError, TypeError):
            continue
            
    # 4. Recent Queues
    # Helper to extract number from MRN, e.g., "RM001" -> 1
    patient_map = {p["id"]: p for p in patients}

    def get_mrn_number(q):
        mrn = q.get("medicalRecordNo")
        if not mrn:
            # Try to find in patient map
            patient = patient_map.get(q["patient_id"])
            if patient:
                mrn = patient.get("medicalRecordNo")
        
        if not mrn:
            return 0

        try:
            return int(mrn[2:])
        except (ValueError, TypeError):
            return 0

    sorted_queues = sorted(queues, key=get_mrn_number)
    recent_queues_data = sorted_queues[:5]
    recent_queues = []
    for q in recent_queues_data:
        mrn = q.get("medicalRecordNo")
        if not mrn:
             patient = patient_map.get(q["patient_id"])
             if patient:
                 mrn = patient.get("medicalRecordNo")
        
        recent_queues.append(RecentQueue(
            id=q["id"],
            patient_name=q["patient_name"],
            medicalRecordNo=mrn or "RM000", 
            status=q["status"]
        ))
    
    return AdminDashboardSummary(
        total_patients_all_time=total_patients_all_time,
        patients_today_count=patients_today_count,
        active_queue_count=active_queue_count,
        income_today=income_today,
        recent_queues=recent_queues
    )
