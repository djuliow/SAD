from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter(prefix="/schedules", tags=["Schedules"])

class ScheduleEntry(BaseModel):
    id: int
    user_id: int
    user_name: str
    day: str
    time: str
    activity: str

class ScheduleCreate(BaseModel):
    user_id: int
    user_name: str
    day: str
    time: str
    activity: str

# Dummy storage for schedules
_schedules: List[ScheduleEntry] = []
_next_schedule_id = 1

@router.get("/", response_model=List[ScheduleEntry])
def get_schedules():
    return _schedules

@router.post("/", response_model=ScheduleEntry)
def create_schedule(schedule: ScheduleCreate):
    global _next_schedule_id
    new_schedule = ScheduleEntry(id=_next_schedule_id, **schedule.dict())
    _schedules.append(new_schedule)
    _next_schedule_id += 1
    return new_schedule

@router.put("/{schedule_id}", response_model=ScheduleEntry)
def update_schedule(schedule_id: int, schedule_update: ScheduleCreate):
    for i, schedule in enumerate(_schedules):
        if schedule.id == schedule_id:
            updated_schedule = ScheduleEntry(id=schedule_id, **schedule_update.dict())
            _schedules[i] = updated_schedule
            return updated_schedule
    raise HTTPException(status_code=404, detail="Schedule entry not found")

@router.delete("/{schedule_id}", status_code=204)
def delete_schedule(schedule_id: int):
    global _schedules
    initial_len = len(_schedules)
    _schedules = [s for s in _schedules if s.id != schedule_id]
    if len(_schedules) == initial_len:
        raise HTTPException(status_code=404, detail="Schedule entry not found")
    return {"message": "Schedule deleted successfully"}