from fastapi import APIRouter, HTTPException
from typing import List
from models.report import Examination
from utils.json_db import read_db, write_db

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.post("/examinations", response_model=Examination)
def save_examination(examination: Examination):
    db = read_db()
    examinations = db.get("examinations", [])

    next_examination_id = max([e.get("id", 0) for e in examinations]) + 1 if examinations else 1
    examination.id = next_examination_id
    examinations.append(examination.dict())
    db["examinations"] = examinations
    write_db(db)
    return examination