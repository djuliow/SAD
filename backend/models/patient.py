from pydantic import BaseModel
from typing import Optional

class Patient(BaseModel):
    id: int
    nama: str
    alamat: str
    keluhan: str
    status: str # menunggu, diperiksa, selesai

class PatientCreate(BaseModel):
    nama: str
    alamat: str
    keluhan: str