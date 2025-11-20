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
    <div className="flex min-h-screen bg-sky-blue">
      <aside className="hidden w-64 flex-shrink-0 border-r border-navy/20 bg-navy px-4 py-6 shadow-xl lg:block">
        <div className="mb-8 space-y-1 rounded-xl bg-teal p-5 text-white shadow-lg">
          <p className="text-xs uppercase text-white/80 font-semibold">Sistem Informasi</p>
          <h1 className="text-xl font-bold text-white">Klinik Sentosa</h1>
          <p className="text-sm text-white/90">{user.role}</p>
        </div>
        <nav className="space-y-1">
          {menu.map((item) => {
            const Icon = LucideIconMap[item.icon] ?? LucideIconMap.activity;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
                  active
                    ? "bg-teal text-white shadow-lg"
                    : "text-white/80 hover:bg-teal/30 hover:text-white"
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="mt-10 rounded-2xl bg-teal/20 border border-teal/30 p-4 text-sm">
          <p className="font-bold text-white">Antrean Aktif</p>
          <p className="text-xs text-white/70 mt-1">Pasien terakhir:</p>
          <p className="text-sm font-semibold text-teal/90 mt-1 bg-white/10 px-2 py-1 rounded">{findPatientName("p-001")}</p>
        </div>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-navy/20 bg-navy px-6 py-4 shadow-md">
          <div>
            <p className="text-sm text-white/80 font-medium">Selamat datang,</p>
            <p className="text-lg font-bold text-white">{user.name}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white/80 hover:bg-teal/30 hover:text-white" onClick={() => {
              if (typeof window !== 'undefined') {
                router.refresh();
              }
            }}>
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-teal/50 bg-teal/10 text-white hover:bg-teal hover:text-white hover:border-teal shadow-sm"
              onClick={() => {
                signOut();
                router.push("/login");
              }}
            >
              Keluar
            </Button>
          </div>
        </header>
        <main className="flex-1 px-6 py-6 bg-sky-blue">{children}</main>
      </div>
    </div>
  );
}
