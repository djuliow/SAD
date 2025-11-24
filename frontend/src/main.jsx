import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import App from './App';
import LoginPage from './pages/login/page';
import AdminDashboardPage from './pages/admin/dashboard/page';
import AdminRegistrationPage from './pages/admin/pendaftaran/page';
import AdminMedicalRecordPage from './pages/admin/rekam-medis/page';
import AdminQueuePage from './pages/admin/antrian/page';
import AdminPaymentPage from './pages/admin/pembayaran/page';
import AdminReportPage from './pages/admin/laporan/page';
import AdminSchedulePage from './pages/admin/jadwal/page';
import ApotekDashboardPage from './pages/apotek/dashboard/page';
import ApotekPrescriptionPage from './pages/apotek/resep/page';
import ApotekStockPage from './pages/apotek/stok/page';
import DokterDashboardPage from './pages/dokter/dashboard/page';
import DokterQueuePage from './pages/dokter/antrian/page';
import DokterHistoryPage from './pages/dokter/riwayat/page';
import PemeriksaanDetailPage from './pages/dokter/pemeriksaan/[id]/page';
import KepalaReportPage from './pages/kepala/laporan/page';
import KepalaSchedulePage from './pages/kepala/jadwal/page';
import KepalaKaryawanPage from './pages/kepala/karyawan/page';
import KepalaPasienPage from './pages/kepala/pasien/page';

import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/" element={<App />}>
          <Route path="admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="admin/pendaftaran" element={<AdminRegistrationPage />} />
          <Route path="admin/rekam-medis" element={<AdminMedicalRecordPage />} />
          <Route path="admin/antrian" element={<AdminQueuePage />} />
          <Route path="admin/pembayaran" element={<AdminPaymentPage />} />
          <Route path="admin/laporan" element={<AdminReportPage />} />
          <Route path="admin/jadwal" element={<AdminSchedulePage />} />
          <Route path="apotek/dashboard" element={<ApotekDashboardPage />} />
          <Route path="apotek/resep" element={<ApotekPrescriptionPage />} />
          <Route path="apotek/stok" element={<ApotekStockPage />} />
          <Route path="dokter/dashboard" element={<DokterDashboardPage />} />
          <Route path="dokter/antrian" element={<DokterQueuePage />} />
          <Route path="dokter/riwayat" element={<DokterHistoryPage />} />
          <Route path="dokter/pemeriksaan/:id" element={<PemeriksaanDetailPage />} />
          <Route path="kepala/laporan" element={<KepalaReportPage />} />
          <Route path="kepala/jadwal" element={<KepalaSchedulePage />} />
          <Route path="kepala/karyawan" element={<KepalaKaryawanPage />} />
          <Route path="kepala/pasien" element={<KepalaPasienPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);