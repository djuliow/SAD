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



### 👨‍💼 Admin (Administrator)
Peran ini memiliki akses penuh untuk mengelola operasional harian klinik.
- **Dashboard**: Menampilkan ringkasan real-time seperti jumlah pasien hari ini, total pendapatan harian, dan statistik kunjungan.
- **Pendaftaran Pasien**:
  - Form registrasi pasien baru dengan validasi data.
  - Pencarian data pasien lama.
  - Pembuatan Nomor Rekam Medis (RM) otomatis.
- **Manajemen Antrian**:
  - Monitoring antrian poli umum/gigi secara real-time.
  - Fitur pemanggilan pasien.
  - Update status antrian (Menunggu -> Diperiksa -> Apotek -> Membayar-> Selesai).
- **Jadwal Dokter**:
  - Pengaturan jadwal praktik dokter per hari dan jam.
  - Visualisasi jadwal yang mudah dibaca.
- **Pembayaran (Kasir)**:
  - Perhitungan otomatis total biaya (Jasa Dokter + Obat).
  - Cetak struk pembayaran.
  - Riwayat transaksi pembayaran.
- **Laporan Harian**: Rekapitulasi pendapatan dan kunjungan per hari.

### 👨‍⚕️ Dokter
Antarmuka khusus untuk tenaga medis melakukan pemeriksaan.
- **Dashboard Dokter**: Jadwal praktik hari ini dan daftar pasien yang menunggu.
- **Antrian Pasien**:
  - Melihat daftar pasien dalam antrian pemeriksaan.
  - Memulai sesi konsultasi.
- **Pemeriksaan & Diagnosa**:
  - Input keluhan (anamnesa) dan diagnosa.
  - Input tindakan medis yang dilakukan.
  - Penulisan resep obat digital yang terintegrasi dengan stok apotek.
- **Riwayat Medis**: Akses cepat ke riwayat pemeriksaan pasien sebelumnya untuk referensi medis.

### 💊 Apoteker
Fokus pada manajemen obat dan penyerahan resep.
- **Dashboard Apotek**: Notifikasi resep baru yang masuk dari dokter.
- **Manajemen Resep**:
  - Verifikasi resep dari dokter.
  - Penyiapan obat dan update status (Disiapkan -> Selesai).
- **Inventori Obat**:
  - Manajemen stok obat (Masuk/Keluar).
  - Peringatan stok menipis.
  - Manajemen data obat (Harga, Satuan, Kategori).
- **Laporan Apotek**: Laporan pengeluaran obat harian.

### 👔 Kepala Klinik
Dashboard eksekutif untuk monitoring dan pengambilan keputusan.
- **Laporan Eksekutif**:
  - Laporan pendapatan komprehensif (Harian/Bulanan/Tahunan).
  - Grafik tren kunjungan pasien.
- **Manajemen SDM (Karyawan)**: Pengelolaan data dokter, perawat, dan staf admin.
- **Analisis Kinerja**: Monitoring performa dokter dan efisiensi pelayanan.
- **Data Pasien**: Analisis demografi dan database seluruh pasien.
- **Monitoring Jadwal**: Melihat overview jadwal operasional klinik.

## 🛠️ Teknologi yang Digunakan

### Backend
- **Framework**: FastAPI (Python)
- **Server**: Uvicorn
- **Validation**: Pydantic
- **CORS**: Middleware untuk komunikasi frontend-backend
- **Storage**: SQLite (database/sqlite.db)

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
source .venv/bin/activate

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
source .venv/bin/activate

# Jalankan server FastAPI
uvicorn main:app --reload
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
│   ├── database.py             # Konfigurasi database
│   ├── database/               # Direktori database
│   │   └── sqlite.db          # File database SQLite
│   ├── requirements.txt        # Dependencies Python
│   ├── models/                 # Pydantic models untuk validasi data
│   │   ├── user.py
│   │   ├── patient.py
│   │   ├── queue.py
│   │   ├── doctor.py
│   │   └── ...
│   ├── routers/                # API endpoints
│   │   ├── auth.py            # Autentikasi & login
│   │   ├── admin.py           # Dashboard admin
│   │   ├── patients.py        # Manajemen pasien
│   │   ├── queue.py           # Manajemen antrian
│   │   ├── doctors.py         # Manajemen dokter
│   │   ├── drugs.py           # Manajemen obat
│   │   ├── prescriptions.py   # Manajemen resep
│   │   ├── payments.py        # Manajemen pembayaran
│   │   ├── bills.py           # Tagihan
│   │   ├── reports.py         # Laporan
│   │   ├── schedules.py       # Jadwal dokter
│   │   ├── employees.py       # Manajemen karyawan
│   │   └── apotek.py          # Dashboard apotek
│   └── utils/                  # Utility functions
│
├── frontend/
│   ├── src/
│   │   ├── main.jsx           # Entry point React
│   │   ├── App.jsx            # Root component
│   │   ├── index.css          # Global styles
│   │   ├── pages/             # Halaman aplikasi
│   │   │   ├── admin/         # Halaman admin
│   │   │   ├── dokter/        # Halaman dokter
│   │   │   ├── apotek/        # Halaman apoteker
│   │   │   ├── kepala/        # Halaman kepala klinik
│   │   │   └── login/         # Halaman login
│   │   ├── components/        # Reusable components
│   │   │   ├── ui/           # UI components (buttons, cards, etc)
│   │   │   ├── cards/        # Card components
│   │   │   ├── forms/        # Form components
│   │   │   ├── layout/       # Layout components
│   │   │   ├── tables/       # Table components
│   │   │   ├── features/     # Feature specific components
│   │   │   └── ...
│   │   ├── api/              # API client functions
│   │   ├── store/            # Zustand store
│   │   ├── lib/              # Utilities
│   │   └── constants/        # Constants
│   ├── public/               # Static assets
│   ├── package.json
│   ├── vite.config.js
│   ├── eslint.config.js
│   └── index.html
│
└── README.md
```

## 🔐 Akun Default

Sistem menyediakan akun default untuk testing:

| Role | Username | Password |
|------|----------|----------|
| Admin | `admin` | `admin123` |
| Apoteker | `apoteker` | `apotek123` |
| Kepala Klinik | `kepala` | `kepala123` |
| Dokter | _Dibuat oleh Kepala_ | _Dibuat oleh Kepala_ |

⚠️ **Penting**: Ganti password default ini sebelum menggunakan sistem di production!

## 📚 API Documentation

### Base URL
```
http://localhost:8000
```

### Endpoints Utama

#### Authentication
- `POST /auth/login` - Login user

#### Patients
- `GET /patients` - Get all patients
- `POST /patients` - Register new patient (and add to queue)
- `GET /patients/{id}/history` - Get patient history
- `GET /patients/stats` - Get patient statistics

#### Queue
- `GET /queue` - Get all queue entries
- `GET /queue/{id}/details` - Get queue details
- `PUT /queue/{id}` - Update queue status
- `DELETE /queue/{id}` - Cancel/Delete queue entry

#### Doctors
- `GET /doctors/dashboard-summary` - Get doctor dashboard summary
- `POST /doctors/examinations` - Create examination record
- `GET /doctors/performance` - Get doctor performance stats

#### Drugs
- `GET /drugs` - Get all drugs
- `POST /drugs` - Create new drug
- `PUT /drugs/{id}` - Update drug details
- `PATCH /drugs/{id}/stock` - Update drug stock

#### Payments
- `GET /payments` - Get all payments
- `POST /payments` - Create payment

#### Reports
- `GET /reports` - Get reports
- `POST /reports` - Generate report

#### Schedules
- `GET /schedules` - Get doctor schedules
- `POST /schedules` - Create schedule
- `PUT /schedules/{id}` - Update schedule
- `DELETE /schedules/{id}` - Delete schedule

#### Employees (Manajemen SDM)
- `GET /employees` - Get all employees (including doctors)
- `POST /employees` - Create employee
- `PUT /employees/{id}` - Update employee
- `DELETE /employees/{id}` - Delete employee

#### Prescriptions
- `GET /prescriptions` - Get all prescriptions
- `POST /prescriptions` - Create prescription
- `PATCH /prescriptions/{id}` - Update prescription
- `PATCH /prescriptions/{id}/fulfill` - Fulfill prescription

#### Apotek
- `GET /apotek/queue` - Get pharmacy queue
- `GET /apotek/pending-patients` - Get patients waiting for pharmacy

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
- Cek file `database/sqlite.db` ada

### Frontend tidak bisa connect ke Backend
- Periksa CORS settings di `backend/main.py`
- Pastikan backend berjalan di `http://localhost:8000`
- Cek network tab di browser untuk detail error

### Database Corrupt
- Backup `database/sqlite.db` terlebih dahulu
- Hapus file jika ingin reset database (akan dibuat ulang saat restart)

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
