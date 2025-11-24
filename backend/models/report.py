from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ReportSummary(BaseModel):
    total_patients: int
    total_income: int
    drugs_used: dict # {drug_name: quantity_used}

class Report(BaseModel):
    id: int
    generated_at: datetime = datetime.now()
    type: str # DAILY, MONTHLY
    period: str # YYYY-MM-DD or YYYY-MM
    summary: ReportSummary

class Examination(BaseModel):
    id: int
    patient_id: int
    doctor_id: int
    diagnosis: str
    notes: str
    date: str

class Prescription(BaseModel):
    id: Optional[int] = None
    examination_id: int
    drug_id: int
    quantity: int
    notes: str
    status: str # menunggu, selesai

class PrescriptionCreate(BaseModel):
    examination_id: int
    drug_id: int
    quantity: int
    notes: str
    status: str = "menunggu"