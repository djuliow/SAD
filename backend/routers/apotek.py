from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import List
from sqlmodel import Session, select
from database import get_session
from models.report import Prescription, Examination
from models.patient import Patient
from models.queue import QueueEntry

router = APIRouter(prefix="/apotek", tags=["Apotek"])

class PendingPatientResponse(BaseModel):
    patient: Patient
    examination: Examination
    prescriptions: List[Prescription]
    queue_status: str

@router.get("/pending-patients", response_model=List[PendingPatientResponse])
def get_pending_patients(session: Session = Depends(get_session)):
    """Get patients with pending prescriptions that need to be fulfilled"""
    # Get all prescriptions with 'menunggu' status
    pending_prescriptions = session.exec(
        select(Prescription).where(Prescription.status == "menunggu")
    ).all()

    # Group prescriptions by examination_id
    from collections import defaultdict
    prescription_groups = defaultdict(list)
    for pres in pending_prescriptions:
        prescription_groups[pres.examination_id].append(pres)

    result = []
    for exam_id, prescriptions in prescription_groups.items():
        # Get examination
        examination = session.exec(
            select(Examination).where(Examination.id == exam_id)
        ).first()

        if examination:
            # Get patient
            patient = session.exec(
                select(Patient).where(Patient.id == examination.patient_id)
            ).first()

            if patient:
                # Get current queue status
                queue_entry = session.exec(
                    select(QueueEntry).where(QueueEntry.patient_id == patient.id)
                    .order_by(QueueEntry.id.desc())
                ).first()

                result.append(PendingPatientResponse(
                    patient=patient,
                    examination=examination,
                    prescriptions=prescriptions,
                    queue_status=queue_entry.status if queue_entry else "unknown"
                ))

    return result

@router.get("/queue", response_model=List[QueueEntry])
def get_apotek_queue(session: Session = Depends(get_session)):
    """Get all queue entries for apotek (patients with 'apotek' status)"""
    queue_entries = session.exec(
        select(QueueEntry).where(QueueEntry.status == "apotek")
    ).all()

    return queue_entries

@router.patch("/{queue_id}/set-apotek-status", response_model=QueueEntry)
def set_apotek_status(queue_id: int, session: Session = Depends(get_session)):
    """Manually set queue status to 'apotek' (for cases where status flow needs correction)"""
    from models.patient import Patient
    queue_entry = session.exec(select(QueueEntry).where(QueueEntry.id == queue_id)).first()
    if not queue_entry:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Queue entry not found")

    # Update queue status to 'apotek'
    queue_entry.status = "apotek"
    session.add(queue_entry)

    # Update patient status to 'apotek' as well
    patient = session.exec(select(Patient).where(Patient.id == queue_entry.patient_id)).first()
    if patient:
        patient.status = "apotek"
        session.add(patient)

    session.commit()
    session.refresh(queue_entry)
    if patient:
        session.refresh(patient)

    return queue_entry