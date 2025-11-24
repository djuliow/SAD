from fastapi import APIRouter, HTTPException
from typing import List, Optional
from models.report import Prescription, PrescriptionCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/", response_model=Prescription)
def create_prescription(prescription_create: PrescriptionCreate):
    db = read_db()
    prescriptions = db.get("prescriptions", [])
    
    next_id = max([p.get("id", 0) for p in prescriptions]) + 1 if prescriptions else 1
    
    new_prescription = Prescription(
        id=next_id,
        **prescription_create.dict()
    )
    
    prescriptions.append(new_prescription.dict())
    db["prescriptions"] = prescriptions
    write_db(db)
    
    return new_prescription

@router.get("/", response_model=List[Prescription])
def get_prescriptions(status: Optional[str] = None):
    db = read_db()
    prescriptions = db.get("prescriptions", [])
    
    if status:
        return [p for p in prescriptions if p.get("status") == status]
    
    return prescriptions

@router.patch("/{prescription_id}/fulfill", response_model=Prescription)
def fulfill_prescription(prescription_id: int):
    db = read_db()
    prescriptions = db.get("prescriptions", [])
    
    for i, p in enumerate(prescriptions):
        if p.get("id") == prescription_id:
            prescriptions[i]["status"] = "selesai"
            db["prescriptions"] = prescriptions
            write_db(db)
            return prescriptions[i]
            
    raise HTTPException(status_code=404, detail="Prescription not found")
