from typing import Optional
from sqlmodel import SQLModel, Field
from datetime import datetime
from pydantic import BaseModel # Keep BaseModel for QueueUpdateStatus

class QueueEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    patient_id: int = Field(index=True)
    patient_name: str
    medicalRecordNo: Optional[str] = "RM000" # Consider if this should be directly from Patient model via relationship
    status: str # menunggu, diperiksa, apotek, membayar, selesai
    created_at: datetime = Field(default_factory=datetime.now)

class QueueUpdateStatus(BaseModel):
    status: str