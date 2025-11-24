from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime
from models.payment import Payment, PaymentCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/payments", tags=["Payments"])

@router.get("/", response_model=List[Payment])
def get_payments(date: Optional[str] = None):
    db = read_db()
    payments = db.get("payments", [])
    
    if not date:
        return payments
        
    # Filter by date if provided
    try:
        filter_date = datetime.strptime(date, "%Y-%m-%d").date()
        return [p for p in payments if datetime.fromisoformat(p["payment_date"]).date() == filter_date]
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD.")

@router.post("/", response_model=Payment)
def record_payment(payment_create: PaymentCreate):
    db = read_db()
    payments = db.get("payments", [])

    next_payment_id = max([p.get("id", 0) for p in payments]) + 1 if payments else 1
    new_payment = Payment(id=next_payment_id, total_amount=payment_create.drug_cost + payment_create.examination_fee, **payment_create.dict())
    payments.append(new_payment.dict())
    db["payments"] = payments
    write_db(db)
    return new_payment