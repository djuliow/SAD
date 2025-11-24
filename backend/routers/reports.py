from fastapi import APIRouter, Body
from typing import List
from datetime import datetime
from models.report import Report, ReportSummary
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=Report)
def generate_and_store_report(payload: dict = Body(...)):
    report_type = payload.get("type")
    period = payload.get("period")
    
    db = read_db()
    
    # Calculation logic
    patients = db.get("patients", [])
    all_payments = db.get("payments", [])
    prescriptions = db.get("prescriptions", [])
    drugs = db.get("drugs", [])

    # Filter payments based on period
    filtered_payments = []
    if period:
        try:
            if report_type == "DAILY":
                filter_date = datetime.strptime(period, "%Y-%m-%d").date()
                filtered_payments = [p for p in all_payments if datetime.fromisoformat(p["payment_date"]).date() == filter_date]
            elif report_type == "MONTHLY":
                filter_month = datetime.strptime(period, "%Y-%m").strftime("%Y-%m")
                filtered_payments = [p for p in all_payments if datetime.fromisoformat(p["payment_date"]).strftime("%Y-%m") == filter_month]
        except ValueError:
            # Silently ignore invalid periods, or raise HTTPException
            pass
    else:
        filtered_payments = all_payments

    total_patients = len(patients) # Cumulative
    total_income = sum(p.get("total_amount", 0) for p in filtered_payments)

    drugs_used = {} # Cumulative
    for p in prescriptions:
        drug_id = p.get("drug_id")
        quantity = p.get("quantity")
        if not drug_id or not quantity: continue
        drug_name = next((d.get("nama") for d in drugs if d.get("id") == drug_id), f"Unknown Drug ID: {drug_id}")
        drugs_used[drug_name] = drugs_used.get(drug_name, 0) + quantity

    report_summary = ReportSummary(
        total_patients=total_patients, 
        total_income=total_income, 
        drugs_used=drugs_used
    )

    # Storing logic
    reports = db.get("reports", [])
    next_id = max([r.get("id", 0) for r in reports]) + 1 if reports else 1
    new_report = Report(
        id=next_id, 
        type=report_type,
        period=period,
        summary=report_summary
    )
    
    reports.append(new_report.dict())
    db["reports"] = reports
    write_db(db)
    
    return new_report

@router.get("/", response_model=List[Report])
def get_all_reports():
    db = read_db()
    # Sort by generated_at date, newest first
    return sorted(db.get("reports", []), key=lambda r: r.get("generated_at"), reverse=True)