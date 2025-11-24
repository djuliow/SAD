from pydantic import BaseModel, Field
from datetime import datetime

class Payment(BaseModel):
    id: int
    patient_id: int
    examination_id: int
    drug_cost: int
    examination_fee: int
    total_amount: int
    payment_date: str = Field(default_factory=lambda: datetime.now().isoformat())
    method: str
    status: str

class PaymentCreate(BaseModel):
    patient_id: int
    examination_id: int
    drug_cost: int
    examination_fee: int
    method: str