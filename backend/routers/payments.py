from fastapi import APIRouter, HTTPException
from typing import List
from models.payment import Payment, PaymentCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/payments", tags=["Payments"])

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