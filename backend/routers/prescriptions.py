from fastapi import APIRouter, HTTPException, Depends, Query
from typing import List, Optional
from sqlmodel import Session, select
from database import get_session
from models.report import Prescription, PrescriptionCreate, Examination # Prescription is in report.py
from models.patient import Patient
from models.drug import Drug # Need Drug for stock management

router = APIRouter(prefix="/prescriptions", tags=["Prescriptions"])

@router.post("/", response_model=Prescription)
def create_prescription(prescription_create: PrescriptionCreate, session: Session = Depends(get_session)):
    new_prescription = Prescription(
        examination_id=prescription_create.examination_id,
        drug_id=prescription_create.drug_id,
        quantity=prescription_create.quantity,
        notes=prescription_create.notes,
        status=prescription_create.status  # This will use "menunggu" as default
    )

    session.add(new_prescription)
    session.commit()
    session.refresh(new_prescription)

    return new_prescription

@router.get("/", response_model=List[Prescription])
def get_prescriptions(session: Session = Depends(get_session), status: Optional[str] = None):
    query = select(Prescription)
    if status:
        query = query.where(Prescription.status == status)
    
    prescriptions = session.exec(query).all()
    return prescriptions

@router.patch("/{prescription_id}/fulfill", response_model=Prescription)
def fulfill_prescription(prescription_id: int, session: Session = Depends(get_session)):
    from models.patient import Patient
    from models.queue import QueueEntry
    from models.report import Examination

    prescription_to_fulfill = session.exec(select(Prescription).where(Prescription.id == prescription_id)).first()
    if not prescription_to_fulfill:
        raise HTTPException(status_code=404, detail="Prescription not found")

    if prescription_to_fulfill.status == "selesai":
        raise HTTPException(status_code=400, detail="Prescription already fulfilled")

    # Find the drug and decrease stock
    drug_to_update = session.exec(select(Drug).where(Drug.id == prescription_to_fulfill.drug_id)).first()
    if not drug_to_update:
        raise HTTPException(status_code=404, detail="Drug in prescription not found in stock")

    # Check if there is enough stock
    if drug_to_update.stok < prescription_to_fulfill.quantity:
        raise HTTPException(status_code=400, detail=f"Not enough stock for {drug_to_update.nama}. Required: {prescription_to_fulfill.quantity}, available: {drug_to_update.stok}")

    drug_to_update.stok -= prescription_to_fulfill.quantity
    session.add(drug_to_update)

    # Update prescription status
    prescription_to_fulfill.status = "selesai"
    session.add(prescription_to_fulfill)

    # Check if all prescriptions for the examination are now fulfilled
    examination_id = prescription_to_fulfill.examination_id
    all_prescriptions = session.exec(
        select(Prescription).where(Prescription.examination_id == examination_id)
    ).all()

    # Check if all prescriptions for this examination are now 'selesai'
    all_fulfilled = all(p.status == "selesai" for p in all_prescriptions)

    if all_fulfilled:
        # Find the examination to get the patient_id
        examination = session.exec(
            select(Examination).where(Examination.id == examination_id)
        ).first()

        if examination:
            # Update patient and queue status to 'membayar' after getting medicine from pharmacy
            patient = session.exec(select(Patient).where(Patient.id == examination.patient_id)).first()
            if patient:
                patient.status = "membayar"
                session.add(patient)

            # Find the queue entry based on patient
            queue_entry = session.exec(
                select(QueueEntry).where(QueueEntry.patient_id == examination.patient_id)
                .order_by(QueueEntry.id.desc())
            ).first()

            if queue_entry:
                queue_entry.status = "membayar"
                session.add(queue_entry)

    session.commit()
    session.refresh(prescription_to_fulfill)
    if drug_to_update:
        session.refresh(drug_to_update)
    if patient:
        session.refresh(patient)
    if queue_entry:
        session.refresh(queue_entry)

    return prescription_to_fulfill


@router.patch("/{prescription_id}", response_model=Prescription)
def update_prescription(prescription_id: int, prescription_update: PrescriptionCreate, session: Session = Depends(get_session)):
    """Update prescription details"""
    prescription = session.exec(select(Prescription).where(Prescription.id == prescription_id)).first()
    if not prescription:
        raise HTTPException(status_code=404, detail="Prescription not found")

    # Only allow updating if prescription is not fulfilled yet
    if prescription.status == "selesai":
        raise HTTPException(status_code=400, detail="Cannot update a fulfilled prescription")

    # Update prescription details
    prescription.drug_id = prescription_update.drug_id
    prescription.quantity = prescription_update.quantity
    prescription.notes = prescription_update.notes
    # We don't update status, examination_id, it should remain the same

    session.add(prescription)
    session.commit()
    session.refresh(prescription)

    return prescription

@router.patch("/fulfill-all/{examination_id}", response_model=List[Prescription])
def fulfill_all_prescriptions(examination_id: int, session: Session = Depends(get_session)):
    """Fulfill all prescriptions for a single examination at once"""
    from models.report import Examination
    from models.patient import Patient
    from models.queue import QueueEntry

    # Get all prescriptions for this examination
    prescriptions = session.exec(
        select(Prescription).where(Prescription.examination_id == examination_id)
    ).all()

    if not prescriptions:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No prescriptions found for this examination")

    # Check if all prescriptions are not already fulfilled
    if all(p.status == "selesai" for p in prescriptions):
        raise HTTPException(status_code=400, detail="All prescriptions for this examination have already been fulfilled")

    # Process each prescription
    updated_prescriptions = []
    for prescription in prescriptions:
        if prescription.status != "selesai":
            # Find the drug and decrease stock
            drug_to_update = session.exec(select(Drug).where(Drug.id == prescription.drug_id)).first()
            if not drug_to_update:
                raise HTTPException(status_code=404, detail=f"Drug in prescription not found in stock: {prescription.drug_id}")

            # Check if there is enough stock
            if drug_to_update.stok < prescription.quantity:
                raise HTTPException(status_code=400, detail=f"Not enough stock for {drug_to_update.nama}. Required: {prescription.quantity}, available: {drug_to_update.stok}")

            drug_to_update.stok -= prescription.quantity
            session.add(drug_to_update)

            # Update prescription status
            prescription.status = "selesai"
            session.add(prescription)

            updated_prescriptions.append(prescription)

    # Update patient and queue status to 'membayar' since all medicines are given
    examination = session.exec(
        select(Examination).where(Examination.id == examination_id)
    ).first()

    if examination:
        # Update patient and queue status to 'membayar' after getting medicine from pharmacy
        patient = session.exec(select(Patient).where(Patient.id == examination.patient_id)).first()
        if patient:
            patient.status = "membayar"
            session.add(patient)

        # Find the queue entry based on patient
        queue_entry = session.exec(
            select(QueueEntry).where(QueueEntry.patient_id == examination.patient_id)
            .order_by(QueueEntry.id.desc())
        ).first()

        if queue_entry:
            queue_entry.status = "membayar"
            session.add(queue_entry)

    session.commit()

    # Refresh updated records
    for pres in updated_prescriptions:
        session.refresh(pres)

    if patient:
        session.refresh(patient)
    if queue_entry:
        session.refresh(queue_entry)

    return updated_prescriptions


# Import BaseModel for response model
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PrescriptionWithPatientInfo(BaseModel):
    id: int
    examination_id: int
    drug_id: int
    quantity: int
    notes: str
    status: str
    patient_name: str
    patient_medical_record_no: str
    drug_name: str
    drug_price: int
    prescription_date: datetime
@router.get("/report", response_model=List[PrescriptionWithPatientInfo])
def get_prescription_report(
    session: Session = Depends(get_session),
    status: Optional[str] = Query(None, description="Filter by prescription status (menunggu/selesai)")
):
    """Get prescription report with patient and drug information"""
    # Build query based on status filter
    query = select(
        Prescription
    )

    if status:
        query = query.where(Prescription.status == status)

    prescriptions = session.exec(query).all()

    result = []
    for pres in prescriptions:
        # Get related information for each prescription
        patient_name = "Data tidak ditemukan"
        patient_medical_record_no = "N/A"
        drug_name = "Data tidak ditemukan"
        drug_price = 0
        prescription_date = getattr(pres, 'created_at', datetime.now())

        # Get related data using manual queries to avoid join issues
        try:
            # Get patient info via examination
            if pres.examination_id:
                examination = session.exec(
                    select(Examination).where(Examination.id == pres.examination_id)
                ).first()

                if examination:
                    patient = session.exec(
                        select(Patient).where(Patient.id == examination.patient_id)
                    ).first()

                    if patient:
                        patient_name = patient.name
                        patient_medical_record_no = patient.medicalRecordNo or "N/A"

                    if examination.date:
                        prescription_date = examination.date

            # Get drug info
            if pres.drug_id:
                drug = session.exec(
                    select(Drug).where(Drug.id == pres.drug_id)
                ).first()

                if drug:
                    drug_name = drug.nama
                    drug_price = drug.harga or 0

        except Exception as e:
            # Log error but continue processing
            print(f"Error getting related data for prescription {pres.id}: {str(e)}")
            pass

        prescription_data = {
            "id": pres.id,
            "examination_id": pres.examination_id or 0,  # Use 0 as default if None
            "drug_id": pres.drug_id or 0,  # Use 0 as default if None
            "quantity": pres.quantity,
            "notes": pres.notes,
            "status": pres.status,
            "patient_name": patient_name,
            "patient_medical_record_no": patient_medical_record_no,
            "drug_name": drug_name,
            "drug_price": drug_price,
            "prescription_date": prescription_date
        }

        result.append(PrescriptionWithPatientInfo(**prescription_data))

    return result
