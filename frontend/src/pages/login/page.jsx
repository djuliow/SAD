import { useState, useTransition } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate } from "/src/api/api.js";
import { useAuthStore } from "/src/store/useAuthStore";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { User, Stethoscope, Pill, Users } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState('role'); // 'role' or 'credentials'
  const [selectedRole, setSelectedRole] = useState('');
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isPending, startTransition] = useTransition();

  // Define credentials mapping
  const roleCredentials = {
    admin: {
      username: "admin",
      password: "admin123",
      icon: User,
      color: "from-red-500 to-red-700",
      bg: "bg-red-100",
      hover: "hover:bg-red-200",
      text: "text-red-700"
    },
    dokter: {
      username: "dokter",
      password: "dokter123",
      icon: Stethoscope,
      color: "from-blue-500 to-blue-700",
      bg: "bg-blue-100",
      hover: "hover:bg-blue-200",
      text: "text-blue-700"
    },
    apoteker: {
      username: "apoteker",
      password: "apotek123",
      icon: Pill,
      color: "from-green-500 to-green-700",
      bg: "bg-green-100",
      hover: "hover:bg-green-200",
      text: "text-green-700"
    },
    kepala: {
      username: "kepala",
      password: "kepala123",
      icon: Users,
      color: "from-purple-500 to-purple-700",
      bg: "bg-purple-100",
      hover: "hover:bg-purple-200",
      text: "text-purple-700"
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
    // Pre-fill credentials for demo purposes
    const roleCred = roleCredentials[role];
    setCredentials({
      username: roleCred.username,
      password: roleCred.password
    });
    setStep('credentials');
  };

  const handleLogin = () => {
    startTransition(async () => {
      try {
        const auth = await authenticate(credentials.username, credentials.password, selectedRole);
        const { user, token } = auth;
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

  const handleBack = () => {
    setStep('role');
    setCredentials({
      username: '',
      password: ''
    });
  };

  const RoleCard = ({ role, title, description, icon: Icon, color, bg, hover, text }) => (
    <div
      onClick={() => handleRoleSelect(role)}
      className={`${bg} ${hover} ${text} border border-gray-200 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.03] flex flex-col items-center text-center shadow-sm`}
    >
      <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-xs opacity-75">{description}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#f0f9ff] via-white to-[#e6f0ff]">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23567C8D\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2F4156] to-[#567C8D] shadow-lg mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-[#2F4156] mb-2">Sistem Klinik Sentosa</h1>
          <p className="text-sm text-[#567C8D]">Silakan pilih peran Anda untuk masuk</p>
        </div>

        {/* Content based on step */}
        {step === 'role' ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <RoleCard
                role="admin"
                title="Admin"
                description="Manajemen administrasi klinik"
                {...roleCredentials.admin}
              />
              <RoleCard
                role="dokter"
                title="Dokter"
                description="Pemeriksaan dan diagnosa pasien"
                {...roleCredentials.dokter}
              />
              <RoleCard
                role="apoteker"
                title="Apoteker"
                description="Pengelolaan obat dan resep"
                {...roleCredentials.apoteker}
              />
              <RoleCard
                role="kepala"
                title="Kepala"
                description="Pemimpin unit klinik"
                {...roleCredentials.kepala}
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-gray-500">Pilih peran yang sesuai dengan posisi Anda</p>
            </div>
          </div>
        ) : (
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl border border-gray-200 p-8 shadow-xl">
            {/* Back button */}
            <div className="flex items-center mb-6">
              <button
                onClick={handleBack}
                className="flex items-center text-sm text-[#567C8D] hover:text-[#2F4156] transition-colors"
              >
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Kembali
              </button>
              <div className="ml-4 flex items-center">
                <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${roleCredentials[selectedRole].color} flex items-center justify-center`}>
                  {selectedRole === 'admin' && <User className="w-5 h-5 text-white" />}
                  {selectedRole === 'dokter' && <Stethoscope className="w-5 h-5 text-white" />}
                  {selectedRole === 'apoteker' && <Pill className="w-5 h-5 text-white" />}
                  {selectedRole === 'kepala' && <Users className="w-5 h-5 text-white" />}
                </div>
                <div className="ml-3">
                  <h3 className="font-semibold text-[#2F4156]">{selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}</h3>
                  <p className="text-xs text-gray-500">Masuk ke akun Anda</p>
                </div>
              </div>
            </div>

            {/* Form */}
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-600 font-semibold tracking-wide">
                  Username
                </label>
                <Input
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="border-slate-300 focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 h-12 transition-all"
                  placeholder={`Masukkan username ${selectedRole}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-600 font-semibold tracking-wide">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="border-slate-300 focus:border-[#567C8D] focus:ring-2 focus:ring-[#567C8D]/20 h-12 transition-all"
                  placeholder={`Masukkan password ${selectedRole}`}
                />
              </div>

              <Button
                className={`w-full bg-gradient-to-r ${roleCredentials[selectedRole].color} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all font-semibold h-12 text-base rounded-xl`}
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
                  `Masuk sebagai ${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}`
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-gray-500">
            © 2024 Klinik Sentosa. Semua hak dilindungi.
          </p>
        </div>
      </div>
    </div>
  );
}
