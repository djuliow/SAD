from fastapi import APIRouter, HTTPException
from typing import List
from models.drug import Drug, DrugUpdateStock
from models.report import Prescription, PrescriptionCreate
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/drugs", tags=["Drugs"])

@router.get("/", response_model=List[Drug])
def get_drugs():
    db = read_db()
    return db.get("drugs", [])

@router.put("/{drug_id}", response_model=Drug)
def update_drug_stock(drug_id: int, drug_update: DrugUpdateStock):
    print(f"Received drug update for drug_id {drug_id}: {drug_update}")
    db = read_db()
    drugs = db.get("drugs", [])
    for i, drug in enumerate(drugs):
        if drug["id"] == drug_id:
            drugs[i]["stok"] = drug_update.stok
            db["drugs"] = drugs
            write_db(db)
            return drugs[i]
    raise HTTPException(status_code=404, detail="Drug not found")

@router.post("/prescriptions", response_model=Prescription)
def add_prescription(prescription_data: PrescriptionCreate):
    db = read_db()
    prescriptions = db.get("prescriptions", [])

    next_prescription_id = max([p.get("id", 0) for p in prescriptions]) + 1 if prescriptions else 1
    
    new_prescription = Prescription(
        id=next_prescription_id,
        **prescription_data.dict()
    )
    
    prescriptions.append(new_prescription.dict())
    db["prescriptions"] = prescriptions
    write_db(db)
    return new_prescription