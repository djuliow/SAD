from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

from sqlmodel import Session, select, func
from database import get_session
from models.patient import Patient, PatientCreate, PatientUpdate
from models.queue import QueueEntry
from models.report import Examination, Prescription # Examination and Prescription are in report.py
from models.drug import Drug
from models.payment import Payment
from models.employee import Employee

router = APIRouter(prefix="/patients", tags=["Patients"])

# --- Models for History Endpoint ---
class PrescriptionDetail(BaseModel):
    drug_name: str
    quantity: int
    notes: str

class DoctorInfo(BaseModel):
    id: int
    name: str

class ExaminationWithDetails(BaseModel):
    id: int
    doctor_id: int
    doctor: DoctorInfo
    complaint: str
    diagnosis: str
    notes: str
    date: str
    prescriptions: List[PrescriptionDetail]

class PaymentDetail(BaseModel):
    id: int
    total_amount: int
    payment_date: str
    method: str

class PatientHistory(BaseModel):
    patient_info: Patient
    examinations: List[ExaminationWithDetails]
    payments: List[PaymentDetail]

class VisitStats(BaseModel):
    date: str
    count: int

class PatientStats(BaseModel):
    daily_visits: List[VisitStats]
    monthly_visits: List[VisitStats]

# -----------------------------------------

@router.get("/stats", response_model=PatientStats)
def get_patient_stats(session: Session = Depends(get_session)):
    # Daily visits (last 7 days)
    # Note: SQLite specific date function
    daily_results = session.exec(
        select(func.strftime('%Y-%m-%d', QueueEntry.created_at), func.count(QueueEntry.id))
        .where(func.date(QueueEntry.created_at) >= func.date('now', '-7 days'))
        .group_by(func.strftime('%Y-%m-%d', QueueEntry.created_at))
        .order_by(func.strftime('%Y-%m-%d', QueueEntry.created_at))
    ).all()
    
    # Monthly visits (last 6 months)
    monthly_results = session.exec(
        select(func.strftime('%Y-%m', QueueEntry.created_at), func.count(QueueEntry.id))
        .where(func.date(QueueEntry.created_at) >= func.date('now', '-6 months'))
        .group_by(func.strftime('%Y-%m', QueueEntry.created_at))
        .order_by(func.strftime('%Y-%m', QueueEntry.created_at))
    ).all()
    
    return PatientStats(
        daily_visits=[VisitStats(date=r[0], count=r[1]) for r in daily_results],
        monthly_visits=[VisitStats(date=r[0], count=r[1]) for r in monthly_results]
    )

@router.get("/", response_model=List[Patient])
def get_patients(session: Session = Depends(get_session)):
    patients = session.exec(select(Patient)).all()
    return patients

@router.get("/{patient_id}/history", response_model=PatientHistory)
def get_patient_history(patient_id: int, session: Session = Depends(get_session)):
    patient_info = session.exec(select(Patient).where(Patient.id == patient_id)).first()
    if not patient_info:
        raise HTTPException(status_code=404, detail="Patient not found")

    # Aggregate Examinations and their Prescriptions
    patient_examinations = session.exec(
        select(Examination).where(Examination.patient_id == patient_id).order_by(Examination.date.desc())
    ).all()
    examinations_with_details = []

    for exam in patient_examinations:
        exam_prescriptions = session.exec(
            select(Prescription).where(Prescription.examination_id == exam.id)
        ).all()
        prescriptions_details = []
        for pres in exam_prescriptions:
            drug_info = session.exec(select(Drug).where(Drug.id == pres.drug_id)).first()
            prescriptions_details.append(PrescriptionDetail(
                drug_name=drug_info.nama if drug_info else "Unknown Drug",
                quantity=pres.quantity,
                notes=pres.notes,
            ))

        # Get doctor info
        doctor_info = session.exec(select(Employee).where(Employee.id == exam.doctor_id)).first()
        doctor_data = DoctorInfo(
            id=doctor_info.id if doctor_info else exam.doctor_id,
            name=doctor_info.name if doctor_info else "Dokter Tidak Diketahui"
        )

        examinations_with_details.append(ExaminationWithDetails(
            id=exam.id,
            doctor_id=exam.doctor_id,
            doctor=doctor_data,
            complaint=exam.complaint,
            diagnosis=exam.diagnosis,
            notes=exam.notes,
            date=exam.date.isoformat(), # Convert datetime to string for response model
            prescriptions=prescriptions_details
        ))

    # Aggregate Payments
    patient_payments = session.exec(
        select(Payment).where(Payment.patient_id == patient_id).order_by(Payment.payment_date.desc())
    ).all()
    payments_details = [PaymentDetail(
        id=p.id,
        total_amount=p.total_amount,
        payment_date=p.payment_date.isoformat(), # Convert datetime to string
        method=p.method
    ) for p in patient_payments]

    return PatientHistory(
        patient_info=patient_info,
        examinations=examinations_with_details,
        payments=payments_details
    )

@router.post("/", response_model=Patient)
def register_patient(patient_create: PatientCreate, session: Session = Depends(get_session)):
    # --- Auto-generate Medical Record Number ---
    # Find the highest existing MRN number
    last_patient = session.exec(select(Patient).order_by(Patient.id.desc())).first()
    if last_patient and last_patient.medicalRecordNo:
        try:
            highest_mrn = int(last_patient.medicalRecordNo[2:])
        except (ValueError, TypeError):
            highest_mrn = 0 # Fallback if malformed
    else:
        highest_mrn = 0
    
    next_mrn_number = highest_mrn + 1
    new_medical_record_no = f"RM{next_mrn_number:03d}"
    # -----------------------------------------

    # Create new Patient
    new_patient = Patient(
        medicalRecordNo=new_medical_record_no, 
        status="menunggu",
        name=patient_create.name,
        dob=patient_create.dob,
        gender=patient_create.gender,
        phone=patient_create.phone,
        address=patient_create.address
    )
    session.add(new_patient)
    session.commit()
    session.refresh(new_patient) # To get the auto-generated ID

    # Create new QueueEntry
    new_queue_entry = QueueEntry(
        patient_id=new_patient.id, 
        patient_name=new_patient.name, 
        medicalRecordNo=new_medical_record_no,
        doctor_id=patient_create.doctor_id,
        status="menunggu"
    )
    session.add(new_queue_entry)
    session.commit()
    session.refresh(new_queue_entry) # To get the auto-generated ID
    
    return new_patient

@router.put("/{patient_id}", response_model=Patient)
def update_patient(patient_id: int, patient_update: PatientUpdate, session: Session = Depends(get_session)):
    patient = session.get(Patient, patient_id)
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    
    patient_data = patient_update.dict(exclude_unset=True)
    for key, value in patient_data.items():
        setattr(patient, key, value)
        
    session.add(patient)
    session.commit()
    session.refresh(patient)
    return patient
