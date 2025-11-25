from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class Patient(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    medicalRecordNo: str = Field(index=True, unique=True)
    name: str = Field(index=True)
    dob: str
    gender: str  # L or P
    phone: str
    address: str
    status: str  # menunggu, diperiksa, apotek, membayar, selesai

class PatientCreate(BaseModel):
    medicalRecordNo: Optional[str] = None
    name: str
    dob: str
    gender: str
    phone: str
    address: str
    doctor_id: Optional[int] = None
