# Sistem Informasi Klinik Sentosa

A Next.js 14 + TypeScript + TailwindCSS implementation that simulates Klinik Sentosa's full workflow end-to-end (admin, dokter, apotek, kepala klinik).

## Tech Stack

- Next.js 14 App Router
- TypeScript, ESLint
- TailwindCSS + ShadCN-inspired UI primitives
- Prisma schema (SQLite) for data modelling
- Zustand for auth state
- Mock server actions for CRUD, queue logic, stock deduction, report generation

## Getting Started

```bash
cd /Users/ralfipoluakan/Desktop/SAD/frontend
npm install
npm run dev
```

- Application runs at http://localhost:3000
- Login with one of the seeded emails (password is any value)

## Roles & Routes

| Role | Entry Route | Highlights |
| --- | --- | --- |
| Admin | /admin/dashboard | Pendaftaran, antrean, pembayaran, laporan, jadwal |
| Dokter | /dokter/dashboard | Pemeriksaan, hasil, resep, riwayat |
| Apoteker | /apotek/dashboard | Resep masuk, serah obat, stok |
| Kepala Klinik | /kepala/laporan | Laporan harian/bulanan, jadwal staf |

## Data Model

All domain entities are described inside `prisma/schema.prisma`. Run `npx prisma format` to validate the schema, or `npx prisma migrate dev` if you later back the mock APIs with a real database.
