
export const NAVIGATION = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "activity" },
    { label: "Pendaftaran", href: "/admin/pendaftaran", icon: "users" },
    { label: "Antrean", href: "/admin/antrian", icon: "list" },
    { label: "Pembayaran", href: "/admin/pembayaran", icon: "credit-card" },
    { label: "Laporan", href: "/admin/laporan", icon: "chart" },
    { label: "Jadwal", href: "/admin/jadwal", icon: "calendar" }
  ],
  dokter: [
    { label: "Dashboard", href: "/dokter/dashboard", icon: "stethoscope" },
    { label: "Antrean", href: "/dokter/antrian", icon: "list" },
    { label: "Rekam Medis", href: "/dokter/riwayat", icon: "history" }
  ],
  apoteker: [
    { label: "Dashboard", href: "/apotek/dashboard", icon: "activity" },
    { label: "Resep", href: "/apotek/resep", icon: "pill" },
    { label: "Stok", href: "/apotek/stok", icon: "package" }
  ],
  kepala: [
    { label: "Laporan", href: "/kepala/laporan", icon: "chart" },
    { label: "Jadwal", href: "/kepala/jadwal", icon: "calendar" },
    { label: "Data Karyawan", href: "/kepala/karyawan", icon: "users" },
    { label: "Data Pasien", href: "/kepala/pasien", icon: "user" }
  ]
};
