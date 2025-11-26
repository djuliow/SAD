from fastapi import APIRouter, HTTPException, Query, Depends
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from sqlmodel import Session, select, func
from database import get_session
from models.report import Examination, ExaminationCreate, MedicalRecordResponse, MedicalRecordListResponse, Prescription, PatientInfo, DoctorInfo
from models.queue import QueueEntry
from models.patient import Patient
from models.employee import Employee

router = APIRouter(prefix="/doctors", tags=["Doctors"])

# --- Models for Dashboard ---
class LatestExaminationSummary(BaseModel):
    patient_name: str
    diagnosis: str
    date: str
    patient_status: str  # Include patient status

class DashboardSummary(BaseModel):
    waiting_count: int
    in_progress_count: int
    pharmacy_count: int
    payment_pending_count: int
    completed_count: int # New field for 'selesai' status
    latest_examination: Optional[LatestExaminationSummary] = None

@router.get("/dashboard-summary", response_model=DashboardSummary)
def get_dashboard_summary(doctor_id: int = Query(...), session: Session = Depends(get_session)):
    # Count waiting queues for this doctor
    waiting_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status == "menunggu").where(QueueEntry.doctor_id == doctor_id)
    ).one()
    # Count in-progress queues for this doctor
    in_progress_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status == "diperiksa").where(QueueEntry.doctor_id == doctor_id)
    ).one()
    # Count pharmacy queues
    pharmacy_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status == "apotek").where(QueueEntry.doctor_id == doctor_id)
    ).one()
    # Count payment pending queues for this doctor
    payment_pending_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status == "membayar").where(QueueEntry.doctor_id == doctor_id)
    ).one()
    # Count completed queues for this doctor
    completed_count = session.exec(
        select(func.count()).select_from(QueueEntry).where(QueueEntry.status == "selesai").where(QueueEntry.doctor_id == doctor_id)
    ).one()
    
    # Latest examination for the doctor
    latest_exam_with_patient = session.exec(
        select(Examination, Patient)
        .join(Patient, Examination.patient_id == Patient.id)
        .where(Examination.doctor_id == doctor_id)
        .order_by(Examination.date.desc())
    ).first()
    
    latest_exam_summary = None
    if latest_exam_with_patient:
        latest_exam, patient = latest_exam_with_patient
        latest_exam_summary = LatestExaminationSummary(
            patient_name=patient.name,
            diagnosis=latest_exam.diagnosis,
            date=latest_exam.date.isoformat(),
            patient_status=patient.status
        )
        
    return DashboardSummary(
        waiting_count=waiting_count,
        in_progress_count=in_progress_count,
        pharmacy_count=pharmacy_count,
        payment_pending_count=payment_pending_count,
        completed_count=completed_count,
        latest_examination=latest_exam_summary
    )

@router.post("/examinations", response_model=Examination)
def create_examination_record(payload: ExaminationCreate, session: Session = Depends(get_session)):
    queue_entry = session.exec(
        select(QueueEntry).where(QueueEntry.id == payload.queue_id)
    ).first()
    if not queue_entry:
        raise HTTPException(status_code=404, detail="Queue entry not found")
    new_examination = Examination(
        patient_id=queue_entry.patient_id,
        doctor_id=payload.doctor_id,
        complaint=payload.complaint,
        diagnosis=payload.diagnosis,
        notes=payload.notes,
        # date will be set by default_factory in the model
    )
    session.add(new_examination)
    # Update queue status to 'apotek' after examination (goes to pharmacy)
    queue_entry.status = "apotek"
    session.add(queue_entry)
    # Also update patient status to 'apotek'
    patient = session.exec(select(Patient).where(Patient.id == queue_entry.patient_id)).first()
    if patient:
        patient.status = "apotek"
        session.add(patient)
    session.commit()
    session.refresh(new_examination)
    session.refresh(queue_entry)
    return new_examination

# --- Performance Tracking ---
class DoctorPerformance(BaseModel):
    doctor_id: int
    doctor_name: str
    total_patients: int
    daily_patients: int # Patients handled today

@router.get("/performance", response_model=List[DoctorPerformance])
def get_doctor_performance(session: Session = Depends(get_session)):
    from models.employee import Employee # Import here to avoid circular dependency if any
    
    # Get all doctors
    doctors = session.exec(select(Employee).where(Employee.role == "dokter")).all()
    
    performance_list = []
    for doctor in doctors:
        # Total patients (completed queues)
        total_patients = session.exec(
            select(func.count()).select_from(QueueEntry)
            .where(QueueEntry.doctor_id == doctor.id)
            .where(QueueEntry.status == "selesai")
        ).one()
        
        # Daily patients (completed queues today)
        today = datetime.now().date()
        daily_patients = session.exec(
            select(func.count()).select_from(QueueEntry)
            .where(QueueEntry.doctor_id == doctor.id)
            .where(QueueEntry.status == "selesai")
            .where(func.date(QueueEntry.created_at) == str(today))
        ).one()
        
        performance_list.append(DoctorPerformance(
            doctor_id=doctor.id,
            doctor_name=doctor.name,
            total_patients=total_patients,
            daily_patients=daily_patients
        ))

    return performance_list


@router.get("/medical-records/my-patients", response_model=MedicalRecordListResponse)
def get_medical_records_for_my_patients(
    doctor_id: int = Query(...),
    session: Session = Depends(get_session)
):
    """
    Get medical records for patients examined by the specified doctor
    """
    # Get examinations by this doctor with patient and doctor details
    examinations = session.exec(
        select(Examination)
        .where(Examination.doctor_id == doctor_id)
        .order_by(Examination.date.desc())
    ).all()

    records = []
    for exam in examinations:
        # Get patient info
        patient = session.exec(
            select(Patient).where(Patient.id == exam.patient_id)
        ).first()

        # Get doctor info
        doctor = session.exec(
            select(Employee).where(Employee.id == exam.doctor_id)
        ).first()

        # Get prescriptions for this examination
        prescriptions = session.exec(
            select(Prescription).where(Prescription.examination_id == exam.id)
        ).all()

        record = MedicalRecordResponse(
            id=exam.id,
            patient_id=exam.patient_id,
            complaint=exam.complaint,
            diagnosis=exam.diagnosis,
            notes=exam.notes,
            date=exam.date,
            patient=PatientInfo(
                id=patient.id,
                medicalRecordNo=patient.medicalRecordNo,
                name=patient.name,
                dob=patient.dob,
                gender=patient.gender,
                phone=patient.phone,
                address=patient.address
            ) if patient else None,
            doctor=DoctorInfo(
                id=doctor.id,
                name=doctor.name
            ) if doctor else None,
            prescriptions=prescriptions
        )
        records.append(record)

    return MedicalRecordListResponse(
        records=records,
        total=len(records)
    )


@router.get("/medical-records/all", response_model=MedicalRecordListResponse)
def get_all_medical_records(
    doctor_id: int = Query(...),
    session: Session = Depends(get_session)
):
    """
    Get all medical records (for authorized doctors)
    Note: This endpoint should be used with proper authorization in production
    """
    # Get all examinations ordered by date (newest first)
    examinations = session.exec(
        select(Examination)
        .order_by(Examination.date.desc())
    ).all()

    records = []
    for exam in examinations:
        # Get patient info
        patient = session.exec(
            select(Patient).where(Patient.id == exam.patient_id)
        ).first()

        # Get doctor info
        doctor = session.exec(
            select(Employee).where(Employee.id == exam.doctor_id)
        ).first()

        # Get prescriptions for this examination
        prescriptions = session.exec(
            select(Prescription).where(Prescription.examination_id == exam.id)
        ).all()

        record = MedicalRecordResponse(
            id=exam.id,
            patient_id=exam.patient_id,
            complaint=exam.complaint,
            diagnosis=exam.diagnosis,
            notes=exam.notes,
            date=exam.date,
            patient=PatientInfo(
                id=patient.id,
                medicalRecordNo=patient.medicalRecordNo,
                name=patient.name,
                dob=patient.dob,
                gender=patient.gender,
                phone=patient.phone,
                address=patient.address
            ) if patient else None,
            doctor=DoctorInfo(
                id=doctor.id,
                name=doctor.name
            ) if doctor else None,
            prescriptions=prescriptions
        )
        records.append(record)

    return MedicalRecordListResponse(
        records=records,
        total=len(records)
    )