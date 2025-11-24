from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, patients, queue, doctors, drugs, payments, reports, schedules, prescriptions, employees, bills

app = FastAPI(title="Klinik Sentosa API", version="1.0")

origins = [
    "http://localhost",
    "http://localhost:3000",
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(queue.router)
app.include_router(doctors.router)
app.include_router(drugs.router)
app.include_router(payments.router)
app.include_router(reports.router)
app.include_router(schedules.router)
app.include_router(prescriptions.router)
app.include_router(employees.router)
app.include_router(bills.router)

@app.get("/")
def root():
    return {"message": "Welcome to Klinik Sentosa API"}