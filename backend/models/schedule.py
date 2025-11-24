from typing import Optional
from sqlmodel import SQLModel, Field

class ScheduleEntry(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    user_id: int = Field(index=True)
    user_name: str
    day: str # e.g., "Monday", "Tuesday"
    time: str # e.g., "09:00-17:00"
    activity: str # e.g., "Clinic Duty", "Meeting"

class ScheduleCreate(SQLModel): # This remains a Pydantic model for input
    user_id: int
    user_name: str
    day: str
    time: str
    activity: str