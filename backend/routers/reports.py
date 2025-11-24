from fastapi import APIRouter, Body, HTTPException, Depends
from typing import List
from datetime import datetime
from sqlmodel import Session, select, func # Import func for aggregation
from database import get_session
from models.report import Report, ReportSummary, Examination, Prescription # Report, Examination, Prescription are now SQLModels
from models.payment import Payment # Payment is now SQLModel
from models.drug import Drug # Drug is now SQLModel

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.post("/", response_model=Report)
def generate_and_store_report(payload: dict = Body(...), session: Session = Depends(get_session)):
    report_type = payload.get("type")
    period = payload.get("period")

    if not report_type or not period:
        raise HTTPException(status_code=400, detail="Report type and period are required")

    # Base query for payments
    payments_query = select(Payment)
    
    # Filter payments based on period
    try:
        if report_type == "DAILY":
            filter_date = datetime.strptime(period, "%Y-%m-%d").date()
            payments_query = payments_query.where(func.date(Payment.payment_date) == filter_date.isoformat())
        elif report_type == "MONTHLY":
            # For monthly, compare YYYY-MM
            filter_month = datetime.strptime(period, "%Y-%m").strftime("%Y-%m")
            payments_query = payments_query.where(func.strftime('%Y-%m', Payment.payment_date) == filter_month)
        else:
            raise HTTPException(status_code=400, detail="Invalid report type. Use DAILY or MONTHLY.")
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid date format. Use YYYY-MM-DD for DAILY or YYYY-MM for MONTHLY.")

    # Check if manual summary is provided
    manual_summary = payload.get("manual_summary")
    
    if manual_summary:
        report_summary = ReportSummary(
            total_patients=manual_summary.get("total_patients", 0),
            total_income=manual_summary.get("total_income", 0),
            total_expenses=manual_summary.get("total_expenses", 0),
            notes=manual_summary.get("notes", ""),
            drugs_used=manual_summary.get("drugs_used", {})
        )
    else:
        filtered_payments = session.exec(payments_query).all()

        # --- Calculation Logic using SQLModel ---

        # 1. Total income from filtered payments
        total_income = sum(p.total_amount for p in filtered_payments)

        paid_examination_ids = {p.examination_id for p in filtered_payments}

        # 2. Total unique patients from paid examinations in the period
        # Need to query examinations that were paid for in this period
        total_patients = 0
        drugs_used = {}
        
        if paid_examination_ids:
            paid_patients_count = session.exec(
                select(func.count(func.distinct(Examination.patient_id)))
                .where(Examination.id.in_(list(paid_examination_ids)))
            ).first()
            total_patients = paid_patients_count if paid_patients_count else 0

            # 3. Drugs used from prescriptions linked to paid examinations in the period
            prescriptions_in_period = session.exec(
                select(Prescription, Drug)
                .join(Drug)
                .where(Prescription.examination_id.in_(list(paid_examination_ids)))
            ).all()
            
            for pres, drug in prescriptions_in_period:
                drugs_used[drug.nama] = drugs_used.get(drug.nama, 0) + pres.quantity

        report_summary = ReportSummary(
            total_patients=total_patients,
            total_income=total_income,
            drugs_used=drugs_used
        )

    # Storing logic
    new_report = Report(
        generated_at=datetime.now(),
        type=report_type,
        period=period,
        summary=report_summary.json() # Serialize ReportSummary to JSON string
    )
    
    session.add(new_report)
    session.commit()
    session.refresh(new_report)
    
    return new_report

@router.get("/", response_model=List[Report])
def get_all_reports(session: Session = Depends(get_session)):
    reports = session.exec(select(Report).order_by(Report.generated_at.desc())).all()
    return reports