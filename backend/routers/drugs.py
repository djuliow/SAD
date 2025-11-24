from fastapi import APIRouter, HTTPException
from typing import List
from models.drug import Drug, DrugCreate, DrugUpdateStock
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/drugs", tags=["Drugs"])

@router.post("/", response_model=Drug)
def create_drug(drug_create: DrugCreate):
    db = read_db()
    drugs = db.get("drugs", [])

    next_id = max([d.get("id", 0) for d in drugs]) + 1 if drugs else 1
    new_drug = Drug(id=next_id, **drug_create.dict())
    
    drugs.append(new_drug.dict())
    db["drugs"] = drugs
    write_db(db)
    
    return new_drug

@router.get("/", response_model=List[Drug])
def get_drugs():
    db = read_db()
    return db.get("drugs", [])

@router.patch("/{drug_id}/stock", response_model=Drug)
def update_drug_stock(drug_id: int, drug_update: DrugUpdateStock):
    db = read_db()
    drugs = db.get("drugs", [])
    for i, drug in enumerate(drugs):
        if drug["id"] == drug_id:
            drugs[i]["stok"] += drug_update.change_amount
            if drugs[i]["stok"] < 0:
                drugs[i]["stok"] = 0 # Prevent negative stock
            db["drugs"] = drugs
            write_db(db)
            return drugs[i]
    raise HTTPException(status_code=404, detail="Drug not found")