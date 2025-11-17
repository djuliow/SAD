from pydantic import BaseModel
from typing import Optional

class QueueEntry(BaseModel):
    id: int
    patient_id: int
    patient_name: str
    status: str # menunggu, diperiksa, selesai

class QueueUpdateStatus(BaseModel):
    status: str