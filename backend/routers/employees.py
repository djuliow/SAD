from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlmodel import Session, select
from database import get_session
from models.employee import Employee # Employee is now SQLModel

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/", response_model=List[Employee])
def get_employees(session: Session = Depends(get_session)):
    employees = session.exec(select(Employee)).all()
    return employees

@router.post("/", response_model=Employee)
def create_employee(employee: Employee, session: Session = Depends(get_session)):
    session.add(employee)
    session.commit()
    session.refresh(employee)
    return employee

@router.put("/{employee_id}", response_model=Employee)
def update_employee(employee_id: int, employee_data: Employee, session: Session = Depends(get_session)):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee_data_dict = employee_data.dict(exclude_unset=True)
    for key, value in employee_data_dict.items():
        setattr(employee, key, value)
        
    session.add(employee)
    
    # Update associated schedules if name changed
    if "name" in employee_data_dict:
        from models.schedule import ScheduleEntry
        schedules = session.exec(select(ScheduleEntry).where(ScheduleEntry.user_id == employee_id)).all()
        for schedule in schedules:
            schedule.user_name = employee.name
            session.add(schedule)
            
    session.commit()
    session.refresh(employee)
    return employee

@router.delete("/{employee_id}")
def delete_employee(employee_id: int, session: Session = Depends(get_session)):
    employee = session.get(Employee, employee_id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
        
    # Delete associated schedules
    from models.schedule import ScheduleEntry
    schedules = session.exec(select(ScheduleEntry).where(ScheduleEntry.user_id == employee_id)).all()
    for schedule in schedules:
        session.delete(schedule)
        
    session.delete(employee)
    session.commit()
    return {"ok": True}
