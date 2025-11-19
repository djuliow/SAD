import { Role } from "@/types";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

export const NAVIGATION: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: "Dashboard", href: "/admin/dashboard", icon: "activity" },
    { label: "Pendaftaran", href: "/admin/pendaftaran", icon: "users" },
    { label: "Antrean", href: "/admin/antrian", icon: "list" },
    { label: "Pembayaran", href: "/admin/pembayaran", icon: "credit-card" },
    { label: "Laporan", href: "/admin/laporan", icon: "chart" },
    { label: "Jadwal", href: "/admin/jadwal", icon: "calendar" }
  ],
  DOKTER: [
    { label: "Dashboard", href: "/dokter/dashboard", icon: "stethoscope" },
    { label: "Antrean", href: "/dokter/antrian", icon: "list" },
    { label: "Riwayat", href: "/dokter/riwayat", icon: "history" }
  ],
  APOTEKER: [
    { label: "Dashboard", href: "/apotek/dashboard", icon: "activity" },
    { label: "Resep", href: "/apotek/resep", icon: "pill" },
    { label: "Stok", href: "/apotek/stok", icon: "package" }
  ],
  KEPALA: [
    { label: "Laporan", href: "/kepala/laporan", icon: "chart" },
    { label: "Jadwal", href: "/kepala/jadwal", icon: "calendar" }
  ]
};
