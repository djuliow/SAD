from fastapi import APIRouter, Body, HTTPException
from typing import List
from datetime import datetime
from models.report import Report, ReportSummary
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=Report)
def generate_and_store_report(payload: dict = Body(...)):
    report_type = payload.get("type")
    period = payload.get("period")

    if not report_type or not period:
        raise HTTPException(status_code=400, detail="Report type and period are required")

    db = read_db()
    all_payments = db.get("payments", [])
    examinations = db.get("examinations", [])
    prescriptions = db.get("prescriptions", [])
    drugs = db.get("drugs", [])

    # Filter payments based on period
    filtered_payments = []
    try:
        if report_type == "DAILY":
            filter_date = datetime.strptime(period, "%Y-%m-%d").date()
            filtered_payments = [p for p in all_payments if datetime.fromisoformat(p["payment_date"]).date() == filter_date]
        elif report_type == "MONTHLY":
            filter_month = datetime.strptime(period, "%Y-%m").strftime("%Y-%m")
            filtered_payments = [p for p in all_payments if datetime.fromisoformat(p["payment_date"]).strftime("%Y-%m") == filter_month]
        else:
            raise HTTPException(status_code=400, detail="Invalid report type. Use DAILY or MONTHLY.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD for DAILY or YYYY-MM for MONTHLY.")

    # --- Corrected Calculation Logic ---

    # 1. Total income from filtered payments
    total_income = sum(p.get("total_amount", 0) for p in filtered_payments)

    paid_examination_ids = {p["examination_id"] for p in filtered_payments}

    # 2. Total unique patients from paid examinations in the period
    paid_patient_ids = {e["patient_id"] for e in examinations if e["id"] in paid_examination_ids}
    total_patients = len(paid_patient_ids)

    # 3. Drugs used from prescriptions linked to paid examinations in the period
    drugs_used = {}
    prescriptions_in_period = [p for p in prescriptions if p["examination_id"] in paid_examination_ids]
    
    for p in prescriptions_in_period:
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
        generated_at=datetime.now().isoformat(),
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