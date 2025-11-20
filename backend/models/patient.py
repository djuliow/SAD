from pydantic import BaseModel
from typing import Optional

class Patient(BaseModel):
    id: int
    medicalRecordNo: str
    name: str
    dob: str
    gender: str  # L or P
    phone: str
    address: str
    status: str  # menunggu, diperiksa, selesai

class PatientCreate(BaseModel):
    medicalRecordNo: str
    name: str
    dob: str
    gender: str
    phone: str
    address: str
