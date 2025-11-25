from fastapi import APIRouter, HTTPException, Depends
from typing import List
from sqlmodel import Session, select
from database import get_session
from models.drug import Drug, DrugCreate, DrugUpdateStock, DrugUpdate # Drug is now SQLModel

router = APIRouter(prefix="/drugs", tags=["Drugs"])

@router.post("/", response_model=Drug)
def create_drug(drug_create: DrugCreate, session: Session = Depends(get_session)):
    new_drug = Drug.from_orm(drug_create) # Create Drug instance from DrugCreate Pydantic model
    
    session.add(new_drug)
    session.commit()
    session.refresh(new_drug)
    
    return new_drug

@router.get("/", response_model=List[Drug])
def get_drugs(session: Session = Depends(get_session)):
    drugs = session.exec(select(Drug)).all()
    return drugs

@router.patch("/{drug_id}/stock", response_model=Drug)
def update_drug_stock(drug_id: int, drug_update: DrugUpdateStock, session: Session = Depends(get_session)):
    drug = session.exec(select(Drug).where(Drug.id == drug_id)).first()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    drug.stok += drug_update.change_amount
    if drug.stok < 0:
        drug.stok = 0 # Prevent negative stock
    
    session.add(drug)
    session.commit()
    session.refresh(drug)
    
    return drug

@router.put("/{drug_id}", response_model=Drug)
def update_drug(drug_id: int, drug_update: DrugUpdate, session: Session = Depends(get_session)):
    drug = session.exec(select(Drug).where(Drug.id == drug_id)).first()
    if not drug:
        raise HTTPException(status_code=404, detail="Drug not found")
    
    if drug_update.nama is not None:
        drug.nama = drug_update.nama
    if drug_update.stok is not None:
        drug.stok = drug_update.stok
    if drug_update.harga is not None:
        drug.harga = drug_update.harga
    
    session.add(drug)
    session.commit()
    session.refresh(drug)
    
    return drug