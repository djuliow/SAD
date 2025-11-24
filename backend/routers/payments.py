from fastapi import APIRouter, HTTPException, Depends, Query
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlmodel import Session, select, func
from database import get_session
from models.payment import Payment, PaymentCreate
from models.patient import Patient
from models.queue import QueueEntry
from models.report import Examination

router = APIRouter(prefix="/payments", tags=["Payments"])

class PaymentWithPatientInfo(Payment):
    patient_name: str

@router.get("/", response_model=List[PaymentWithPatientInfo])
def get_payments(session: Session = Depends(get_session), date: Optional[str] = None):
    try:
        query = select(Payment, Patient).join(Patient, Payment.patient_id == Patient.id)

        if date:
            try:
                query = query.where(func.date(Payment.payment_date) == date)
            except ValueError:
                raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

        payments_with_patients = session.exec(query).all()

        enriched_payments = []
        for payment, patient in payments_with_patients:
            payment_data = payment.model_dump() # Use model_dump() for Pydantic v2
            payment_data["patient_name"] = patient.name
            enriched_payment = PaymentWithPatientInfo(**payment_data)
            enriched_payments.append(enriched_payment)

        return enriched_payments
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving payments: {str(e)}")

@router.post("/", response_model=Payment)
def record_payment(payment_create: PaymentCreate, session: Session = Depends(get_session)):
    existing_payment = session.exec(
        select(Payment).where(Payment.examination_id == payment_create.examination_id)
    ).first()
    if existing_payment:
        raise HTTPException(status_code=400, detail="Payment for this examination has already been recorded.")

    # Get examination to find the queue entry
    examination = session.exec(
        select(Examination).where(Examination.id == payment_create.examination_id)
    ).first()
    
    if not examination:
        raise HTTPException(status_code=404, detail="Examination not found")

    new_payment = Payment(
        total_amount=payment_create.drug_cost + payment_create.examination_fee, 
        status="LUNAS",
        patient_id=payment_create.patient_id,
        examination_id=payment_create.examination_id,
        drug_cost=payment_create.drug_cost,
        examination_fee=payment_create.examination_fee,
        method=payment_create.method
    )
    session.add(new_payment)
    
    # Update queue status to 'selesai' after payment (transition from 'membayar')
    queue_entry = session.exec(
        select(QueueEntry).where(QueueEntry.patient_id == payment_create.patient_id)
        .order_by(QueueEntry.id.desc())
    ).first()

    if queue_entry:
        # Update queue status to 'selesai' from any status when payment is made
        queue_entry.status = "selesai"
        session.add(queue_entry)

    # Update patient status to 'selesai' when payment is made
    patient = session.exec(
        select(Patient).where(Patient.id == payment_create.patient_id)
    ).first()

    if patient:
        # Update patient status to 'selesai' from any status when payment is made
        patient.status = "selesai"
        session.add(patient)
    
    session.commit()
    session.refresh(new_payment)
    return new_payment