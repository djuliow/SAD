from pydantic import BaseModel

class Drug(BaseModel):
    id: int
    nama: str
    stok: int
    harga: int

class DrugCreate(BaseModel):
    nama: str
    stok: int
    harga: int

class DrugUpdateStock(BaseModel):
    change_amount: int