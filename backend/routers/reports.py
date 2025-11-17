from fastapi import APIRouter, HTTPException
from typing import List
from models.report import ReportSummary
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/", response_model=ReportSummary)
def generate_report():
    db = read_db()
    patients = db.get("patients", [])
    payments = db.get("payments", [])
    prescriptions = db.get("prescriptions", [])
    drugs = db.get("drugs", [])

    total_patients = len(patients)
    total_income = sum([p.get("total_amount", 0) for p in payments])

    drugs_used = {}
    for p in prescriptions:
        drug_id = p["drug_id"]
        quantity = p["quantity"]
        drug_name = next((d["nama"] for d in drugs if d["id"] == drug_id), f"Unknown Drug {drug_id}")
        drugs_used[drug_name] = drugs_used.get(drug_name, 0) + quantity

    return ReportSummary(total_patients=total_patients, total_income=total_income, drugs_used=drugs_used)