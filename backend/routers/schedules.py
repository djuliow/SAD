from fastapi import APIRouter, HTTPException, Depends
from typing import List, Dict
from sqlmodel import Session, select
from database import get_session
from models.schedule import ScheduleEntry, ScheduleCreate # ScheduleEntry is now SQLModel

router = APIRouter(prefix="/schedules", tags=["Schedules"])

@router.get("/", response_model=List[ScheduleEntry])
def get_schedules(session: Session = Depends(get_session)):
    schedules = session.exec(select(ScheduleEntry)).all()
    return schedules

@router.post("/", response_model=ScheduleEntry)
def create_schedule(schedule: ScheduleCreate, session: Session = Depends(get_session)):
    new_schedule = ScheduleEntry.from_orm(schedule)
    
    session.add(new_schedule)
    session.commit()
    session.refresh(new_schedule)
    
    return new_schedule

@router.put("/{schedule_id}", response_model=ScheduleEntry)
def update_schedule(schedule_id: int, schedule_update: ScheduleCreate, session: Session = Depends(get_session)):
    schedule = session.exec(select(ScheduleEntry).where(ScheduleEntry.id == schedule_id)).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    
    schedule.user_id = schedule_update.user_id
    schedule.user_name = schedule_update.user_name
    schedule.day = schedule_update.day
    schedule.time = schedule_update.time
    schedule.activity = schedule_update.activity
    
    session.add(schedule)
    session.commit()
    session.refresh(schedule)
    
    return schedule

@router.delete("/{schedule_id}", status_code=204)
def delete_schedule(schedule_id: int, session: Session = Depends(get_session)):
    schedule = session.exec(select(ScheduleEntry).where(ScheduleEntry.id == schedule_id)).first()
    if not schedule:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
        
    session.delete(schedule)
    session.commit()
    return