from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from models.payment import Payment, PaymentCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/payments", tags=["Payments"])

class PaymentWithPatientInfo(Payment):
    patient_name: str

@router.get("/", response_model=List[PaymentWithPatientInfo])
def get_payments(date: Optional[str] = None):
    db = read_db()
    payments = db.get("payments", [])
    patients = db.get("patients", [])
    
    # Create a lookup for patient names
    patient_names = {p["id"]: p["name"] for p in patients}

    # Filter payments by date if provided
    if date:
        try:
            filter_date = datetime.strptime(date, "%Y-%m-%d").date()
            payments = [p for p in payments if datetime.fromisoformat(p["payment_date"]).date() == filter_date]
        except ValueError:
            raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")
            
    # Enrich payment data with patient name
    enriched_payments = []
    for p in payments:
        patient_name = patient_names.get(p["patient_id"], "Unknown Patient")
        enriched_payment = PaymentWithPatientInfo(**p, patient_name=patient_name)
        enriched_payments.append(enriched_payment)
        
    return enriched_payments

@router.post("/", response_model=Payment)
def record_payment(payment_create: PaymentCreate):
    db = read_db()
    payments = db.get("payments", [])

    # Check for existing payment for the same examination
    if any(p.get("examination_id") == payment_create.examination_id for p in payments):
        raise HTTPException(status_code=400, detail="Payment for this examination has already been recorded.")

    next_payment_id = max([p.get("id", 0) for p in payments]) + 1 if payments else 1
    new_payment = Payment(
        id=next_payment_id, 
        total_amount=payment_create.drug_cost + payment_create.examination_fee, 
        status="LUNAS",
        **payment_create.dict()
    )
    payments.append(new_payment.dict())
    db["payments"] = payments
    write_db(db)
    return new_payment