from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from sqlmodel import Session, select
from database import get_session
from models.user import User # Import the SQLModel User
from utils.jwt_dummy import generate_dummy_token # Keep for now as per plan

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserLogin(BaseModel):
    username: str
    password: str
    role: str

@router.post("/login")
def login(user_login: UserLogin, session: Session = Depends(get_session)):
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