from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Any
from sqlmodel import Session, select
from database import get_session
from models.report import Prescription # Assuming Prescription is now in its own file
from models.payment import Payment
from models.report import Examination # Examination is in report.py
from models.patient import Patient
from models.drug import Drug

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
def get_pending_bills(session: Session = Depends(get_session)):
    prescriptions = session.exec(select(Prescription)).all()
    payments = session.exec(select(Payment)).all()
    examinations = session.exec(select(Examination)).all()
    patients = session.exec(select(Patient)).all()
    drugs = session.exec(select(Drug)).all()

    # Create dictionaries for faster lookup
    patient_map = {p.id: p for p in patients}
    drug_map = {d.id: d for d in drugs}
    examination_map = {e.id: e for e in examinations}
    paid_examination_ids = {p.examination_id for p in payments}
    
    pending_prescriptions = [
        p for p in prescriptions if p.status == "selesai" and p.examination_id not in paid_examination_ids
    ]

    bills = {}
    for pres in pending_prescriptions:
        exam_id = pres.examination_id
        if exam_id not in bills:
            
            exam = examination_map.get(exam_id)
            if not exam:
                continue

            patient = patient_map.get(exam.patient_id)
            if not patient:
                continue

            bills[exam_id] = {
                "examination_id": exam_id,
                "patient_id": patient.id,
                "patient_name": patient.name,
                "drug_cost": 0,
                "examination_fee": EXAMINATION_FEE,
                "details": []
            }

        drug = drug_map.get(pres.drug_id)
        if drug:
            cost = pres.quantity * drug.harga
            bills[exam_id]["drug_cost"] += cost
            bills[exam_id]["details"].append({
                "drug_name": drug.nama,
                "quantity": pres.quantity,
                "price_per_unit": drug.harga,
                "total_cost": cost
            })

    # Final calculation for total_amount
    pending_bills = []
    for bill in bills.values():
        bill["total_amount"] = bill["drug_cost"] + bill["examination_fee"]
        pending_bills.append(PendingBill(**bill)) # Convert dict to Pydantic model
    
    return pending_bills
