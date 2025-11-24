from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any
from utils.json_db import read_db

router = APIRouter(prefix="/bills", tags=["Bills"])

EXAMINATION_FEE = 50000  # Fixed examination fee as discussed

class PendingBill(BaseModel):
    examination_id: int
    patient_id: int
    patient_name: str
    drug_cost: int
    examination_fee: int
    total_amount: int
    details: List[Dict[str, Any]]

@router.get("/pending", response_model=List[PendingBill])
def get_pending_bills():
    db = read_db()
    prescriptions = db.get("prescriptions", [])
    payments = db.get("payments", [])
    examinations = db.get("examinations", [])
    patients = db.get("patients", [])
    drugs = db.get("drugs", [])

    paid_examination_ids = {p["examination_id"] for p in payments}
    
    pending_prescriptions = [
        p for p in prescriptions if p["status"] == "selesai" and p["examination_id"] not in paid_examination_ids
    ]

    bills = {}
    for pres in pending_prescriptions:
        exam_id = pres["examination_id"]
        if exam_id not in bills:
            
            exam = next((e for e in examinations if e["id"] == exam_id), None)
            if not exam:
                continue

            patient = next((p for p in patients if p["id"] == exam["patient_id"]), None)
            if not patient:
                continue

            bills[exam_id] = {
                "examination_id": exam_id,
                "patient_id": patient["id"],
                "patient_name": patient["name"],
                "drug_cost": 0,
                "examination_fee": EXAMINATION_FEE,
                "details": []
            }

        drug = next((d for d in drugs if d["id"] == pres["drug_id"]), None)
        if drug:
            cost = pres["quantity"] * drug["harga"]
            bills[exam_id]["drug_cost"] += cost
            bills[exam_id]["details"].append({
                "drug_name": drug["nama"],
                "quantity": pres["quantity"],
                "price_per_unit": drug["harga"],
                "total_cost": cost
            })

    # Final calculation for total_amount
    pending_bills = []
    for bill in bills.values():
        bill["total_amount"] = bill["drug_cost"] + bill["examination_fee"]
        pending_bills.append(bill)

    return pending_bills
