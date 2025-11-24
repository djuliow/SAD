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
    drugs = db.get("drugs", [])
    
    prescription_to_fulfill = None
    prescription_index = -1

    for i, p in enumerate(prescriptions):
        if p.get("id") == prescription_id:
            if p.get("status") == "selesai":
                raise HTTPException(status_code=400, detail="Prescription already fulfilled")
            prescription_to_fulfill = p
            prescription_index = i
            break

    if not prescription_to_fulfill:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # Find the drug and decrease stock
    drug_to_update = None
    for i, d in enumerate(drugs):
        if d.get("id") == prescription_to_fulfill["drug_id"]:
            # Check if there is enough stock
            if d["stok"] < prescription_to_fulfill["quantity"]:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {d['nama']}. Required: {prescription_to_fulfill['quantity']}, available: {d['stok']}")
            
            drugs[i]["stok"] -= prescription_to_fulfill["quantity"]
            drug_to_update = drugs[i]
            break

    if not drug_to_update:
        raise HTTPException(status_code=404, detail="Drug in prescription not found in stock")
        
    # Update prescription status
    prescriptions[prescription_index]["status"] = "selesai"

    # Save changes to DB
    db["prescriptions"] = prescriptions
    db["drugs"] = drugs
    write_db(db)
    
    return prescriptions[prescription_index]
