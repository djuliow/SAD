from fastapi import APIRouter, Depends
from typing import List
from sqlmodel import Session, select
from database import get_session
from models.employee import Employee # Employee is now SQLModel

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/", response_model=List[Employee])
def get_employees(session: Session = Depends(get_session)):
    employees = session.exec(select(Employee)).all()
    return employees
