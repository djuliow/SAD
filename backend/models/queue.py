from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class QueueEntry(BaseModel):
    id: int
    patient_id: int
    patient_name: str

    medicalRecordNo: Optional[str] = "RM000"
    status: str # menunggu, diperiksa, selesai
    created_at: str = Field(default_factory=lambda: datetime.now().isoformat())

class QueueUpdateStatus(BaseModel):
    status: str