from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime, date

from sqlmodel import Session, select, func # Import func for aggregation
from sqlalchemy import text
from database import get_session
from models.patient import Patient
from models.queue import QueueEntry
from models.payment import Payment
from models.schedule import ScheduleEntry

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
    queue_counts: Dict[str, int] # Added for queue counts by status
    doctor_schedules: List[ScheduleEntry] = []

# --------------------------

@router.get("/dashboard-summary", response_model=AdminDashboardSummary)
def get_admin_dashboard_summary(session: Session = Depends(get_session)):
    today = date.today()

    # --- Calculations ---
    
    # 1. Patient Counts
    total_patients_all_time = session.exec(select(func.count(Patient.id))).one()

    patients_today_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(func.date(QueueEntry.created_at) == today.isoformat())
    ).one()

    # 2. Active Queue Count
    active_queue_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status != "selesai")
    ).one()

    # 3. Income Today
    income_today_result = session.exec(
        select(func.sum(Payment.total_amount)).where(func.date(Payment.payment_date) == today.isoformat())
    ).first()
    income_today = float(income_today_result) if income_today_result else 0.0

    # 4. Recent Queues (Last 5, ordered by creation date, then by patient_id implicitly for stability)
    # We need to fetch Patient medicalRecordNo for the queue entries
    recent_queues_db = session.exec(
        select(QueueEntry, Patient)
        .join(Patient, QueueEntry.patient_id == Patient.id)
        .order_by(QueueEntry.id.desc()) # Order by most recent queues (ID desc)
    ).fetchmany(5)

    recent_queues = []
    for queue_entry, patient in recent_queues_db:
        recent_queues.append(RecentQueue(
            id=queue_entry.id,
            patient_name=queue_entry.patient_name,
            medicalRecordNo=patient.medicalRecordNo, # Get medicalRecordNo from the joined Patient
            status=queue_entry.status
        ))
    
    # 5. Queue Counts by Status
    queue_counts = {
        "menunggu": session.exec(select(func.count(QueueEntry.id)).where(QueueEntry.status == "menunggu")).one(),
        "diperiksa": session.exec(select(func.count(QueueEntry.id)).where(QueueEntry.status == "diperiksa")).one(),
        "membayar": session.exec(select(func.count(QueueEntry.id)).where(QueueEntry.status == "membayar")).one(),
        "selesai": session.exec(select(func.count(QueueEntry.id)).where(QueueEntry.status == "selesai")).one(),
    }

    # 6. Doctor Schedules
    doctor_schedules = session.exec(select(ScheduleEntry)).all()

    return AdminDashboardSummary(
        total_patients_all_time=total_patients_all_time,
        patients_today_count=patients_today_count,
        active_queue_count=active_queue_count,
        income_today=income_today,
        recent_queues=recent_queues,
        queue_counts=queue_counts,
        doctor_schedules=doctor_schedules
    )
