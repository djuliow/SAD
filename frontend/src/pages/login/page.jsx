
import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate } from "/src/api/api.js";
import { useAuthStore } from "/src/store/useAuthStore";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { Select, SelectItem } from "/src/components/ui/select";
import { toast } from "sonner";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [form, setForm] = useState({
    username: "admin",
    password: "admin123",
    role: "admin"
  });

  // Define credentials mapping
  const roleCredentials = {
    admin: { username: "admin", password: "admin123" },
    dokter: { username: "dokter", password: "dokter123" },
    apoteker: { username: "apoteker", password: "apotek123" },
    kepala: { username: "kepala", password: "kepala123" }
  };
  const [isPending, startTransition] = useTransition();

  const handleLogin = () => {
    startTransition(async () => {
      try {
        const auth = await authenticate(form.username, form.password, form.role);
        const { token, ...user } = auth;
        // Convert role to uppercase to match navigation keys
        const normalizedUser = { ...user, role: user.role.toUpperCase() };
        setAuth({ user: normalizedUser, token });
        toast.success("Berhasil masuk");
        const roleToPath = {
          ADMIN: "/admin/dashboard",
          DOKTER: "/dokter/dashboard",
          APOTEKER: "/apotek/dashboard",
          KEPALA: "/kepala/laporan"
        };
        navigate(roleToPath[normalizedUser.role]);
      } catch (error) {
        toast.error(error.message ?? "Login gagal");
      }
    });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-[#C8D9E6] via-white to-[#C8D9E6]/30">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated circles */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#567C8D]/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#2F4156]/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#567C8D]/5 rounded-full blur-3xl"></div>
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{
            backgroundImage: 'linear-gradient(#2F4156 1px, transparent 1px), linear-gradient(90deg, #2F4156 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* Logo/Icon area */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#567C8D] to-[#2F4156] shadow-lg mb-4">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
        </div>

        {/* Login card with enhanced styling */}
        <div className="relative">
          {/* Glow effect */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#567C8D] to-[#2F4156] rounded-3xl blur opacity-20 animate-pulse"></div>
          
          <div className="relative rounded-3xl border border-[#C8D9E6] bg-white/95 backdrop-blur-sm p-8 shadow-2xl">
            {/* Header section */}
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold text-[#2F4156] mb-2">
                Sistem Klinik Sentosa
              </h1>
              <div className="w-20 h-1 bg-gradient-to-r from-[#567C8D] to-[#2F4156] mx-auto rounded-full mb-3"></div>
              <p className="text-base text-[#567C8D] font-semibold">
                Kesehatan Anda adalah prioritas kami
              </p>
              <p className="text-xs text-slate-500 mt-2">Masuk menggunakan akun internal</p>
            </div>
            
            {/* Form section */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-600 font-semibold tracking-wide">
                  Role
                </label>
                <Select
                  value={form.role}
                  onValueChange={(value) => {
                    const credentials = roleCredentials[value] || { username: "", password: "" };
                    setForm({
                      username: credentials.username,
                      password: credentials.password,
                      role: value
                    });
                  }}
                  className="border-slate-300 focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 h-12 transition-all"
                >
                  <SelectItem value="" disabled>Pilih role Anda</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="dokter">Dokter</SelectItem>
                  <SelectItem value="apoteker">Apoteker</SelectItem>
                  <SelectItem value="kepala">Kepala</SelectItem>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-600 font-semibold tracking-wide">
                  Username
                </label>
                <Input
                  value={form.username}
                  onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                  className="border-slate-300 focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 h-12 transition-all"
                  placeholder="masukkan username Anda"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-600 font-semibold tracking-wide">
                  Password
                </label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="border-slate-300 focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 h-12 transition-all"
                  placeholder="masukkan password Anda"
                />
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-[#567C8D] to-[#567C8D]/90 hover:from-[#567C8D]/90 hover:to-[#567C8D] text-white shadow-lg hover:shadow-xl transition-all font-semibold h-12 text-base rounded-xl" 
                disabled={isPending} 
                onClick={handleLogin}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk"
                )}
              </Button>
            </div>
            
            {/* Clean space for better layout */}
            <div className="mt-8"></div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400">
            © 2024 Klinik Sentosa. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}
