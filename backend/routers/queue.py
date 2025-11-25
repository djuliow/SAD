from fastapi import APIRouter, HTTPException, status, Depends
from typing import List, Optional
from sqlmodel import Session, select
from database import get_session
from models.queue import QueueEntry, QueueUpdateStatus
from models.patient import Patient
from models.report import Examination
from models.payment import Payment

router = APIRouter(prefix="/queue", tags=["Queue"])

@router.get("/", response_model=List[QueueEntry])
def get_queue(status: Optional[str] = None, doctor_id: Optional[int] = None, session: Session = Depends(get_session)):
    query = select(QueueEntry, Patient).join(Patient, QueueEntry.patient_id == Patient.id)
    
    if status:
        query = query.where(QueueEntry.status == status)
        
    if doctor_id:
        query = query.where(QueueEntry.doctor_id == doctor_id)
        
    queue_entries_with_patients = session.exec(query.order_by(QueueEntry.id.asc())).all()

    # Update medicalRecordNo from Patient table to ensure it's always correct
    result = []
    for queue_entry, patient in queue_entries_with_patients:
        # Update the medicalRecordNo from the Patient record
        queue_entry.medicalRecordNo = patient.medicalRecordNo
        result.append(queue_entry)
    
    return result

@router.get("/{queue_id}/details")
def get_queue_details(queue_id: int, session: Session = Depends(get_session)):
    queue_entry = session.exec(select(QueueEntry).where(QueueEntry.id == queue_id)).first()
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    patient = session.exec(select(Patient).where(Patient.id == queue_entry.patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient for this queue not found")

    patient_history = session.exec(select(Examination).where(Examination.patient_id == patient.id)).all()

    return {
        "queue": queue_entry,
        "patient": patient,
        "history": patient_history
    }

@router.put("/{queue_id}", response_model=QueueEntry)
def update_queue_status(queue_id: int, status_update: QueueUpdateStatus, session: Session = Depends(get_session)):
    queue_entry = session.exec(select(QueueEntry).where(QueueEntry.id == queue_id)).first()
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    patient = session.exec(select(Patient).where(Patient.id == queue_entry.patient_id)).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient for this queue not found")

    # Optional: Validate status transitions to ensure proper flow
    valid_statuses = {"menunggu", "diperiksa", "apotek", "membayar", "selesai"}
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Valid statuses: {', '.join(sorted(valid_statuses))}")

    queue_entry.status = status_update.status
    patient.status = status_update.status

    session.add(queue_entry)
    session.add(patient)
    session.commit()
    session.refresh(queue_entry)
    session.refresh(patient)

    return queue_entry

@router.delete("/{queue_id}", status_code=status.HTTP_200_OK)
def cancel_queue_entry(queue_id: int, session: Session = Depends(get_session)):
    queue_entry = session.exec(select(QueueEntry).where(QueueEntry.id == queue_id)).first()
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")

    # Get patient ID before deleting queue entry
    patient_id = queue_entry.patient_id

    # Delete the queue entry
    session.delete(queue_entry)

    # Check for other queue entries (excluding the one being deleted)
    other_queue_entries = session.exec(
        select(QueueEntry).where(QueueEntry.patient_id == patient_id).where(QueueEntry.id != queue_id)
    ).all()

    # Check for examinations
    examinations = session.exec(
        select(Examination).where(Examination.patient_id == patient_id)
    ).all()

    # Check for payments
    payments = session.exec(
        select(Payment).where(Payment.patient_id == patient_id)
    ).all()

    # Only delete patient if they don't have examinations or payments (meaning they just registered but didn't proceed)
    if not examinations and not payments and not other_queue_entries:
        from models.patient import Patient
        patient = session.exec(select(Patient).where(Patient.id == patient_id)).first()
        if patient:
            session.delete(patient)

    session.commit()

    return {"message": f"Queue entry {queue_id} deleted successfully, patient was {'deleted' if not examinations and not payments and not other_queue_entries else 'kept'}"}