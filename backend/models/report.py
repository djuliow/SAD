from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from sqlmodel import SQLModel, Field
import json # Import json for serialization of ReportSummary

class ReportSummary(BaseModel):
    total_patients: int
    total_income: int
    total_expenses: Optional[int] = 0
    notes: Optional[str] = ""
    drugs_used: dict # {drug_name: quantity_used}

class Report(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    generated_at: datetime = Field(default_factory=datetime.now)
    type: str = Field(index=True) # DAILY, MONTHLY
    period: str = Field(index=True) # YYYY-MM-DD or YYYY-MM
    summary: str # Storing ReportSummary as JSON string

    # Helper methods to handle serialization/deserialization of summary
    def get_summary_obj(self) -> ReportSummary:
        return ReportSummary.parse_raw(self.summary)

    def set_summary_obj(self, summary_obj: ReportSummary):
        self.summary = summary_obj.json()

class Examination(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(index=True)
    doctor_id: int = Field(index=True)
    complaint: str
    diagnosis: str
    notes: str
    date: datetime = Field(default_factory=datetime.now)

class ExaminationCreate(BaseModel):
    queue_id: int
    doctor_id: int
    complaint: str
    diagnosis: str
    notes: str

class Prescription(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    examination_id: int = Field(index=True)
    drug_id: int = Field(index=True)
    quantity: int
    notes: str
    status: str # menunggu, selesai

class PrescriptionCreate(BaseModel):
    examination_id: int
    drug_id: int
    quantity: int
    notes: str
    status: str = "menunggu"