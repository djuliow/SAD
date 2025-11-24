from fastapi import APIRouter
from typing import List
from models.employee import Employee
from utils.json_db import read_db

router = APIRouter(prefix="/employees", tags=["Employees"])

@router.get("/", response_model=List[Employee])
def get_employees():
    db = read_db()
    return db.get("employees", [])
