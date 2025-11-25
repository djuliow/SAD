from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from sqlmodel import Session, select
from database import get_session
from models.user import User # Import the SQLModel User
from models.employee import Employee # Import Employee model

# from utils.jwt_dummy import generate_dummy_token # Removed as file was deleted

def generate_dummy_token(role: str):
    import time
    return f"dummy-token-{role}-{int(time.time())}"

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserLogin(BaseModel):
    username: str
    password: str
    role: str

@router.post("/login")
def login(user_login: UserLogin, session: Session = Depends(get_session)):
    # 1. Check Employee table first
    employee = session.exec(
        select(Employee).where(
            Employee.username == user_login.username,
            Employee.password == user_login.password,
            Employee.role == user_login.role
        )
    ).first()

    if employee:
        token = generate_dummy_token(employee.role)
        return {"user": employee, "token": token}

    # 2. Fallback to User table
    user = session.exec(
        select(User).where(
            User.username == user_login.username,
            User.password == user_login.password,
            User.role == user_login.role
        )
    ).first()

    if user:
        token = generate_dummy_token(user.role)
        return {"user": user, "token": token}

    raise HTTPException(status_code=401, detail="Invalid credentials or role")