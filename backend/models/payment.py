from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from pydantic import BaseModel # Keep BaseModel for PaymentCreate

class Payment(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(index=True)
    examination_id: int = Field(index=True)
    drug_cost: int
    examination_fee: int
    total_amount: int
    payment_date: datetime = Field(default_factory=datetime.now) # Use datetime object
    method: str
    status: str

class PaymentCreate(BaseModel):
    patient_id: int
    examination_id: int
    drug_cost: int
    examination_fee: int
    method: str