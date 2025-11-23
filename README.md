# 🏥 Sistem Informasi Klinik Sentosa

Sistem manajemen klinik berbasis web yang komprehensif untuk mengelola operasional klinik, termasuk pendaftaran pasien, antrian, pemeriksaan dokter, apotek, pembayaran, dan pelaporan.

## 📋 Daftar Isi

- [Tentang Proyek](#tentang-proyek)
- [Fitur Utama](#fitur-utama)
- [Teknologi yang Digunakan](#teknologi-yang-digunakan)
- [Prasyarat](#prasyarat)
- [Instalasi](#instalasi)
- [Menjalankan Aplikasi](#menjalankan-aplikasi)
- [Struktur Proyek](#struktur-proyek)
- [Akun Default](#akun-default)
- [API Documentation](#api-documentation)
- [Screenshot](#screenshot)
- [Kontribusi](#kontribusi)

## 🎯 Tentang Proyek

Sistem Informasi Klinik Sentosa adalah aplikasi web lengkap yang dirancang untuk memudahkan pengelolaan operasional klinik kesehatan. Sistem ini menyediakan antarmuka yang intuitif untuk berbagai peran pengguna (Admin, Dokter, Apoteker, Kepala Klinik) dengan fitur-fitur yang disesuaikan dengan kebutuhan masing-masing.

### Tujuan Proyek

- Meningkatkan efisiensi pelayanan pasien
- Mengelola antrian pasien secara digital
- Mempermudah proses pendaftaran dan rekam medis
- Mengelola stok obat dan resep
- Menyediakan laporan dan analitik klinik
- Mengelola jadwal dokter dan pembayaran

## ✨ Fitur Utama

### 👨‍💼 Admin
- **Dashboard**: Ringkasan statistik klinik (pasien hari ini, total pasien, pendapatan)
- **Pendaftaran Pasien**: Mendaftarkan pasien baru dan mengelola data pasien
- **Antrian**: Mengelola antrian pasien dengan status real-time
- **Jadwal Dokter**: Mengatur dan melihat jadwal praktik dokter
- **Pembayaran**: Mengelola transaksi pembayaran pasien
- **Laporan**: Melihat laporan keuangan dan statistik klinik

### 👨‍⚕️ Dokter
- **Dashboard**: Informasi pasien dan jadwal praktik
- **Antrian**: Melihat daftar pasien yang menunggu
- **Pemeriksaan**: Melakukan pemeriksaan, mendiagnosis, dan memberikan resep
- **Riwayat**: Melihat riwayat pemeriksaan pasien

### 💊 Apoteker
- **Dashboard**: Ringkasan resep dan stok obat
- **Resep**: Memproses resep dari dokter
- **Stok Obat**: Mengelola inventori obat (tambah, edit, hapus)

### 👔 Kepala Klinik
- **Laporan**: Melihat laporan lengkap keuangan dan operasional
- **Jadwal**: Melihat jadwal seluruh dokter

## 🛠️ Teknologi yang Digunakan

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Validation**: Pydantic
- **CORS**: Middleware untuk komunikasi frontend-backend
- **Storage**: JSON-based database (database.json)

### Frontend
- **Framework**: React 19.2.0
- **Build Tool**: Vite 7.2.4
- **Routing**: React Router DOM 7.9.6
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: Radix UI, Lucide Icons
- **Form Management**: React Hook Form + Zod Validation
- **State Management**: Zustand 5.0.8
- **Date Handling**: date-fns 4.1.0
- **Notifications**: Sonner 2.0.7

## 📦 Prasyarat

Pastikan Anda telah menginstal:

- **Node.js** (versi 18.x atau lebih baru)
- **npm** atau **yarn**
- **Python** (versi 3.8 atau lebih baru)
- **pip** (Python package manager)

## 🚀 Instalasi

### 1. Clone Repository

```bash
git clone <repository-url>
cd SAD
```

### 2. Setup Backend

```bash
# Masuk ke direktori backend
cd backend

# Buat virtual environment (recommended)
python -m venv .venv

# Aktifkan virtual environment
# Untuk Windows:
.venv\Scripts\activate

# Untuk Mac/Linux:
# source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

> 💡 **Catatan**: Setiap kali akan menjalankan backend, pastikan virtual environment sudah diaktifkan. Anda akan melihat `(.venv)` di awal command prompt jika sudah aktif.

### 3. Setup Frontend

```bash
# Masuk ke direktori frontend
cd ../frontend

# Install dependencies
npm install
```

## ▶️ Menjalankan Aplikasi

### Menjalankan Backend

```bash
# Dari direktori backend
cd backend

# Aktifkan virtual environment (jika menggunakan venv)
# Windows:
.venv\Scripts\activate

# Mac/Linux:
# source .venv/bin/activate

# Jalankan server FastAPI
uvicorn main:app --reload --port 8000
```

Server akan berjalan di: `http://localhost:8000`

API Documentation otomatis tersedia di:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Menjalankan Frontend

Buka terminal baru:

```bash
# Dari direktori frontend
cd frontend

# Jalankan development server
npm run dev
```

Aplikasi akan berjalan di: `http://localhost:5173`

## 📁 Struktur Proyek

```
SAD/
├── backend/
│   ├── main.py                 # Entry point aplikasi FastAPI
│   ├── database.json           # Database JSON untuk penyimpanan data
│   ├── requirements.txt        # Dependencies Python
│   ├── models/                 # Pydantic models untuk validasi data
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── queue.py
│   │   ├── doctor.py
│   │   └── ...
│   ├── routers/                # API endpoints
│   │   ├── auth.py            # Autentikasi & login
│   │   ├── patients.py        # Manajemen pasien
│   │   ├── queue.py           # Manajemen antrian
│   │   ├── doctors.py         # Manajemen dokter
│   │   ├── drugs.py           # Manajemen obat
│   │   ├── payments.py        # Manajemen pembayaran
│   │   ├── reports.py         # Laporan
│   │   └── schedules.py       # Jadwal dokter
│   └── utils/                  # Utility functions
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # Entry point React
│   │   ├── App.jsx            # Root component
│   │   ├── index.css          # Global styles
│   │   ├── pages/             # Halaman aplikasi
│   │   │   ├── admin/         # Halaman admin
│   │   │   │   ├── dashboard/
│   │   │   │   ├── pendaftaran/
│   │   │   │   ├── antrian/
│   │   │   │   ├── jadwal/
│   │   │   │   ├── pembayaran/
│   │   │   │   └── laporan/
│   │   │   ├── dokter/        # Halaman dokter
│   │   │   │   ├── dashboard/
│   │   │   │   ├── antrian/
│   │   │   │   ├── pemeriksaan/
│   │   │   │   └── riwayat/
│   │   │   ├── apotek/        # Halaman apoteker
│   │   │   │   ├── dashboard/
│   │   │   │   ├── resep/
│   │   │   │   └── stok/
│   │   │   ├── kepala/        # Halaman kepala klinik
│   │   │   │   ├── laporan/
│   │   │   │   └── jadwal/
│   │   │   └── login/         # Halaman login
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # UI components (buttons, cards, etc)
│   │   │   └── ...
│   │   ├── api/              # API client functions
│   │   ├── store/            # Zustand store
│   │   ├── lib/              # Utilities
│   │   └── types/            # Type definitions
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
└── README.md
```

## 🔐 Akun Default

Sistem menyediakan akun default untuk testing:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Dokter | `dokter` | `dokter123` |
| Apoteker | `apoteker` | `apotek123` |
| Kepala Klinik | `kepala` | `kepala123` |

⚠️ **Penting**: Ganti password default ini sebelum menggunakan sistem di production!

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints Utama

#### Authentication
- `POST /auth/login` - Login user
- `GET /auth/me` - Get current user info

#### Patients
- `GET /patients` - Get all patients
- `GET /patients/{id}` - Get patient by ID
- `POST /patients` - Create new patient
- `PUT /patients/{id}` - Update patient
- `DELETE /patients/{id}` - Delete patient

#### Queue
- `GET /queue` - Get all queue entries
- `GET /queue/{id}` - Get queue entry by ID
- `POST /queue` - Add to queue
- `PUT /queue/{id}` - Update queue status

#### Doctors
- `GET /doctors` - Get all doctors
- `GET /doctors/{id}` - Get doctor by ID
- `POST /doctors` - Create doctor
- `PUT /doctors/{id}` - Update doctor

#### Drugs
- `GET /drugs` - Get all drugs
- `GET /drugs/{id}` - Get drug by ID
- `POST /drugs` - Create drug
- `PUT /drugs/{id}` - Update drug stock

#### Payments
- `GET /payments` - Get all payments
- `POST /payments` - Create payment

#### Reports
- `GET /reports` - Get reports
- `GET /reports/summary` - Get summary statistics

#### Schedules
- `GET /schedules` - Get doctor schedules
- `POST /schedules` - Create schedule

Untuk dokumentasi lengkap, kunjungi `http://localhost:8000/docs` setelah menjalankan backend.

## 📸 Screenshot

> _Tambahkan screenshot aplikasi Anda di sini_

## 🔄 Development Workflow

### Menambahkan Fitur Baru

1. **Backend**: Buat model di `models/`, tambahkan router di `routers/`
2. **Frontend**: Buat halaman di `pages/`, tambahkan komponennya
3. **API Integration**: Update `api/` dengan endpoint baru
4. **Testing**: Test fitur secara menyeluruh

### Build untuk Production

**Frontend:**
```bash
cd frontend
npm run build
```

File production akan berada di `frontend/dist/`

**Backend:**
```bash
# Jalankan tanpa reload
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 🐛 Troubleshooting

### Backend tidak bisa diakses
- Pastikan port 8000 tidak digunakan aplikasi lain
- Periksa apakah semua dependencies terinstall dengan benar
- Cek file `database.json` ada dan valid

### Frontend tidak bisa connect ke Backend
- Periksa CORS settings di `backend/main.py`
- Pastikan backend berjalan di `http://localhost:8000`
- Cek network tab di browser untuk detail error

### Database JSON corrupt
- Backup `database.json` terlebih dahulu
- Reset ke struktur default jika diperlukan

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan:

1. Fork repository
2. Buat branch fitur (`git checkout -b feature/AmazingFeature`)
3. Commit perubahan (`git commit -m 'Add some AmazingFeature'`)
4. Push ke branch (`git push origin feature/AmazingFeature`)
5. Buat Pull Request

## 📝 Lisensi

Proyek ini dibuat untuk keperluan akademik.

## 👥 Tim Pengembang

Proyek ini dikembangkan oleh:

- **Julio Derill Juan Weol**
- **Marcelo Ralfi Poluakan**
- **Evangjelika Coralie Pietersz**
- **Adriel Miseal Walintukan**

## 📞 Kontak

Untuk pertanyaan atau saran, silakan hubungi tim pengembang.

---

**Dibuat dengan ❤️ untuk Klinik Sentosa**
