from pydantic import BaseModel
from datetime import datetime

class Payment(BaseModel):
    id: int
    patient_id: int
    examination_id: int
    drug_cost: int
    examination_fee: int
    total_amount: int
    payment_date: datetime = datetime.now()

class PaymentCreate(BaseModel):
    patient_id: int
    examination_id: int
    drug_cost: int
    examination_fee: int