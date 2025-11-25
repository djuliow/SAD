from typing import Optional
from sqlmodel import SQLModel, Field
from pydantic import BaseModel

class Drug(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    nama: str = Field(index=True)
    stok: int
    harga: int

class DrugCreate(BaseModel):
    nama: str
    stok: int
    harga: int

class DrugUpdateStock(BaseModel):
    change_amount: int

class DrugUpdate(BaseModel):
    nama: Optional[str] = None
    stok: Optional[int] = None
    harga: Optional[int] = None