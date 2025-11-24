from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Dict
from utils.json_db import read_db, write_db
from utils.jwt_dummy import generate_dummy_token

router = APIRouter(prefix="/auth", tags=["Auth"])

class UserLogin(BaseModel):
    username: str
    password: str
    role: str

@router.post("/login")
def login(user_login: UserLogin):
    db = read_db()
    users = db.get("users", [])
    for user in users:
        if user["username"] == user_login.username and user["password"] == user_login.password and user["role"] == user_login.role:
            token = generate_dummy_token(user["role"])
            # Return the full user object
            return {"user": user, "token": token}
    raise HTTPException(status_code=401, detail="Invalid credentials or role")