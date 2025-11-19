"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { NAVIGATION } from "@/constants/navigation";
import { useAuthStore } from "@/store/useAuthStore";
import { Button } from "@/components/ui/button";
import { cn, findPatientName } from "@/lib/utils";
import { LucideIconMap } from "./icons";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, signOut } = useAuthStore();

  if (!user) {
    router.push("/login");
    return null;
  }

  const menu = NAVIGATION[user.role];

  return (
    <div className="flex min-h-screen bg-muted">
      <aside className="hidden w-64 flex-shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:block">
        <div className="mb-8 space-y-1">
          <p className="text-xs uppercase text-slate-400">Sistem Informasi</p>
          <h1 className="text-xl font-semibold text-slate-900">Klinik Sentosa</h1>
          <p className="text-sm text-slate-500">{user.role}</p>
        </div>
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = LucideIconMap[item.icon] ?? LucideIconMap.activity;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-medium transition-all",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-slate-600 hover:bg-slate-100"
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 rounded-2xl bg-primary/5 p-4 text-sm text-slate-700">
          <p className="font-semibold text-slate-900">Antrean Aktif</p>
          <p className="text-xs text-slate-500">Pasien terakhir:</p>
          <p className="text-sm text-primary">{findPatientName("p-001")}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-4">
          <div>
            <p className="text-sm text-slate-500">Selamat datang,</p>
            <p className="text-lg font-semibold text-slate-900">{user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => router.refresh()}>
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
            >
              Keluar
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
