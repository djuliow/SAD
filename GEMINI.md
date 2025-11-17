# 🏥 AI PROJECT BUILD PROMPT — SISTEM INFORMASI KLINIK SENTOSA (FULLSTACK)

You are an expert fullstack developer proficient in **FastAPI (Python)** and **React.js (JavaScript)**.  
Your task is to **create a complete fullstack application** for **"Sistem Informasi Klinik Sentosa"**, based on the specification below.  

This project must include:
- ✅ Complete **FastAPI backend** with dummy JSON database.
- ✅ Modern **React.js frontend** with Tailwind CSS.
- ✅ Proper folder structure, modular code, and documentation.
- ✅ Ready-to-run configuration for local development (`uvicorn` for backend, `vite` for frontend).

---

## 🧱 GENERAL SPECIFICATION

### 🎯 Objective
Build a web-based clinic management system to digitize patient registration, medical examinations, prescriptions, payments, and reports at **Klinik Sentosa**.  
The system must have multiple user roles:
- **Admin**
- **Dokter**
- **Apoteker**
- **Kepala Klinik**
- **Pasien**

---

## ⚙️ TECHNOLOGY STACK

| Layer | Technology | Purpose |
|--------|-------------|----------|
| Frontend | React.js + Tailwind CSS | UI / UX |
| Backend | FastAPI (Python 3.11+) | REST API |
| Storage | JSON File (Dummy) | Temporary data storage |
| Auth | Dummy login (no encryption) | Role-based access control |
| Communication | REST API (Axios) | Data exchange |
| Deployment | Localhost / VPS | Test and deploy environment |

---

# 🧩 BACKEND (FASTAPI)

## 📁 Project Structure

Create a folder called `/backend` with the following structure:

```

/backend
│
├── main.py
├── database.json
├── requirements.txt
│
├── models/
│   ├── user.py
│   ├── patient.py
│   ├── drug.py
│   ├── queue.py
│   ├── payment.py
│   ├── report.py
│
├── routers/
│   ├── auth.py
│   ├── patients.py
│   ├── queue.py
│   ├── doctors.py
│   ├── drugs.py
│   ├── payments.py
│   ├── reports.py
│   └── schedules.py
│
└── utils/
├── json_db.py
├── jwt_dummy.py
└── helpers.py

```

---

## 📦 Requirements.txt

```

fastapi
uvicorn
pydantic

````

---

## 💾 Dummy Database (`database.json`)

```json
{
  "users": [
    {"id": 1, "username": "admin", "password": "admin123", "role": "admin"},
    {"id": 2, "username": "dokter1", "password": "dokter123", "role": "dokter"},
    {"id": 3, "username": "apoteker", "password": "apotek123", "role": "apoteker"},
    {"id": 4, "username": "kepala", "password": "kepala123", "role": "kepala"}
  ],
  "patients": [
    {"id": 101, "nama": "Budi Santoso", "alamat": "Airmadidi", "keluhan": "Demam", "status": "menunggu"}
  ],
  "queue": [],
  "examinations": [],
  "prescriptions": [],
  "drugs": [
    {"id": 1, "nama": "Paracetamol", "stok": 100, "harga": 5000}
  ],
  "payments": [],
  "reports": []
}
````

---

## 🧠 Backend Functionality

### Authentication (`auth.py`)

* Endpoint: `POST /auth/login`
* Dummy login (check from `database.json`)
* Returns `{username, role, token}`

### Patients (`patients.py`)

* `GET /patients` → List all patients
* `POST /patients` → Register a new patient
* Automatically creates queue entry

### Queue (`queue.py`)

* `GET /queue` → Show patient queue
* `PUT /queue/{id}` → Update patient status

### Doctor (`doctors.py`)

* `POST /examinations` → Save examination data (diagnosis, notes)
* Linked with patient ID and doctor ID

### Drugs & Prescriptions (`drugs.py`)

* `GET /drugs` → View drug stock
* `PUT /drugs/{id}` → Update stock
* `POST /prescriptions` → Add prescription linked to examination

### Payments (`payments.py`)

* `POST /payments` → Record payment (exam fee + drug cost)
* Data stored in `payments` and reflected in reports

### Reports (`reports.py`)

* `GET /reports` → Generate report (daily/monthly)
* Returns summary of patients, income, drugs used

### Schedules (`schedules.py`)

* `GET /schedules` → Retrieve doctor/nurse schedules
* `POST /schedules` → Update schedule

---

## 🧰 Utilities

### `json_db.py`

Handles reading/writing JSON database.

```python
import json, os
DB_PATH = "database.json"

def read_db():
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, "w") as f: json.dump({}, f)
    with open(DB_PATH, "r") as f:
        return json.load(f)

def write_db(data):
    with open(DB_PATH, "w") as f:
        json.dump(data, f, indent=2)
```

### `jwt_dummy.py`

```python
def generate_dummy_token(role: str):
    return f"dummy-token-{role}"
```

---

## 🚀 main.py

```python
from fastapi import FastAPI
from routers import auth, patients, queue, doctors, drugs, payments, reports, schedules

app = FastAPI(title="Klinik Sentosa API", version="1.0")

app.include_router(auth.router)
app.include_router(patients.router)
app.include_router(queue.router)
app.include_router(doctors.router)
app.include_router(drugs.router)
app.include_router(payments.router)
app.include_router(reports.router)
app.include_router(schedules.router)

@app.get("/")
def root():
    return {"message": "Welcome to Klinik Sentosa API"}
```

---

## 🧩 Run Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
```

The API should now be available at:

* Swagger UI → [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
* Root endpoint → [http://127.0.0.1:8000/](http://127.0.0.1:8000/)

---

# 💻 FRONTEND (REACT + TAILWIND)

## 📁 Project Structure

Create a folder called `/frontend`:

```
/frontend
│
├── index.html
├── package.json
├── vite.config.js
│
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── api/
│   │   └── api.js
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   └── Card.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Patients.jsx
│   │   ├── Queue.jsx
│   │   ├── Drugs.jsx
│   │   ├── Payments.jsx
│   │   ├── Reports.jsx
│   │   └── Schedules.jsx
│   └── styles/
│       └── global.css
```

---

## 📦 Dependencies

```bash
npm create vite@latest frontend --template react
cd frontend
npm install axios react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

In `tailwind.config.js`:

```js
content: ["./index.html", "./src/**/*.{js,jsx}"]
```

In `src/styles/global.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

---

## ⚙️ Frontend Functionality

### Login Page

* Form: username + password
* On submit → `POST /auth/login`
* Save token & role in `localStorage`
* Redirect to Dashboard

### Dashboard

* Role-based content:

  * Admin → pasien, antrean, pembayaran, laporan
  * Dokter → antrean, pemeriksaan, resep
  * Apoteker → stok obat, resep
  * Kepala Klinik → laporan dan jadwal
* Use React Router for navigation

### Pages

* **Patients.jsx:** CRUD pasien
* **Queue.jsx:** Show and update patient queue
* **Drugs.jsx:** Manage stock & prescriptions
* **Payments.jsx:** Input payment & show summary
* **Reports.jsx:** Fetch `/reports`
* **Schedules.jsx:** Manage doctor schedules

---

## 🌐 API Integration

`src/api/api.js`

```js
import axios from "axios";

const API = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const login = (data) => API.post("/auth/login", data);
export const getPatients = () => API.get("/patients");
export const addPatient = (data) => API.post("/patients", data);
export const getReports = () => API.get("/reports");
```

---

## 🧭 Routing

`src/main.jsx`

```jsx
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./styles/global.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<App />}>
        <Route index element={<Dashboard />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
```

---

## 🚀 Run Frontend

```bash
cd frontend
npm run dev
```

The app should run at:
👉 `http://localhost:5173`

---

# ✅ FINAL DELIVERABLES

After execution, AI agent must generate:

1. `/backend` (FastAPI app)
2. `/frontend` (React app)
3. Working dummy JSON database
4. Endpoints connected to frontend
5. Readable, commented code
6. Ready to run locally via:

   * `uvicorn main:app --reload`
   * `npm run dev`

---

# 🧠 ACTION

**Now build this entire project (frontend + backend)** under the root folder.
Ensure:

* Both layers can run independently.
* FastAPI provides clean REST API documented in `/docs`.
* React UI connects properly to FastAPI endpoints.
* Use the dummy JSON as temporary storage for all CRUD operations.

