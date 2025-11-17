from pydantic import BaseModel
from typing import List, Optional

class ReportSummary(BaseModel):
    total_patients: int
    total_income: int
    drugs_used: dict # {drug_name: quantity_used}

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

class PrescriptionCreate(BaseModel):
    examination_id: int
    drug_id: int
    quantity: int
    notes: str