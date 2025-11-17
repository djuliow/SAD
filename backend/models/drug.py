from pydantic import BaseModel

class Drug(BaseModel):
    id: int
    nama: str
    stok: int
    harga: int

class DrugUpdateStock(BaseModel):
    stok: int