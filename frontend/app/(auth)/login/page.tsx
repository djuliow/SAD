"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { authenticate } from "@/lib/mockApi";
import { useAuthStore } from "@/store/useAuthStore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({ email: "admin@sentosa.id", password: "password" });
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      try {
        const auth = await authenticate(form.email, form.password);
        const { token, ...user } = auth;
        setAuth({ user, token });
        toast.success("Berhasil masuk");
        const roleToPath: Record<string, string> = {
          ADMIN: "/admin/dashboard",
          DOKTER: "/dokter/dashboard",
          APOTEKER: "/apotek/dashboard",
          KEPALA: "/kepala/laporan"
        };
        router.push(roleToPath[user.role]);
      } catch (error: any) {
        toast.error(error.message ?? "Login gagal");
      }
    });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary/5 via-white to-primary/10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <h1 className="text-2xl font-semibold text-slate-900">Sistem Klinik Sentosa</h1>
        <p className="text-sm text-slate-500">Masuk menggunakan akun internal</p>
        <div className="mt-6 space-y-4">
          <div>
            <p className="text-xs uppercase text-slate-400">Email</p>
            <Input
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
            />
          </div>
          <div>
            <p className="text-xs uppercase text-slate-400">Password</p>
            <Input
              type="password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
            />
          </div>
          <Button className="w-full" disabled={isPending} onClick={handleLogin}>
            {isPending ? "Memproses..." : "Masuk"}
          </Button>
          <div className="text-xs text-slate-400">
            <p>Contoh akun:</p>
            <ul className="list-disc pl-4">
              <li>Admin: admin@sentosa.id</li>
              <li>Dokter: dokter@sentosa.id</li>
              <li>Apoteker: apoteker@sentosa.id</li>
              <li>Kepala Klinik: kepala@sentosa.id</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
