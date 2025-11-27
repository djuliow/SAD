import { useState, useTransition, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authenticate, listEmployees } from "/src/api/api.js";
import { useAuthStore } from "/src/store/useAuthStore";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { User, Stethoscope, Pill, Users, ChevronRight } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const [step, setStep] = useState('role'); // 'role', 'doctor-select', 'credentials'
  const [selectedRole, setSelectedRole] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const employees = await listEmployees();
        const doctorList = employees.filter(emp => emp.role.toLowerCase() === 'dokter');
        setDoctors(doctorList);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  // Define credentials mapping with Theme Colors
  const roleCredentials = {
    admin: {
      username: "admin",
      password: "admin123",
      icon: User,
      color: "from-navy to-navy-light",
      bg: "bg-white",
      hover: "hover:bg-sky-blue/20",
      text: "text-navy",
      border: "border-navy/20"
    },
    dokter: {
      username: "", // Will be filled from selection
      password: "",
      icon: Stethoscope,
      color: "from-teal to-[#4a6b7c]",
      bg: "bg-white",
      hover: "hover:bg-teal/10",
      text: "text-teal",
      border: "border-teal/20"
    },
    apoteker: {
      username: "apoteker",
      password: "apotek123",
      icon: Pill,
      color: "from-[#5D7B6F] to-[#4A6359]", // Muted green matching theme vibe
      bg: "bg-white",
      hover: "hover:bg-[#5D7B6F]/10",
      text: "text-[#5D7B6F]",
      border: "border-[#5D7B6F]/20"
    },
    kepala: {
      username: "kepala",
      password: "kepala123",
      icon: Users,
      color: "from-navy-light to-navy",
      bg: "bg-white",
      hover: "hover:bg-navy/10",
      text: "text-navy-light",
      border: "border-navy-light/20"
    }
  };

  const handleRoleSelect = (role) => {
    setSelectedRole(role);

    if (role === 'dokter') {
      setStep('doctor-select');
      return;
    }

    // Restore auto-fill for other roles
    const roleCred = roleCredentials[role];
    setCredentials({
      username: roleCred.username,
      password: roleCred.password
    });
    setStep('credentials');
  };

  const handleDoctorSelect = (doctor) => {
    setCredentials({
      username: doctor.username || "",
      password: doctor.password || ""
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
    if (step === 'doctor-select') {
      setStep('role');
    } else if (step === 'credentials') {
      if (selectedRole === 'dokter') {
        setStep('doctor-select');
      } else {
        setStep('role');
      }
    }
    setCredentials({
      username: '',
      password: ''
    });
  };

  const RoleCard = ({ role, title, description, icon: Icon, color, bg, hover, text, border }) => (
    <div
      onClick={() => handleRoleSelect(role)}
      className={`${bg} ${hover} border ${border} rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg flex flex-col items-center text-center shadow-sm group`}
    >
      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-md group-hover:shadow-lg transition-all`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <h3 className={`font-bold text-lg mb-1 ${text}`}>{title}</h3>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  );

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-sky-blue/30">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23567C8D\' fill-opacity=\'0.05\'%3E%3Ccircle cx=\'30\' cy=\'30\' r=\'2\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-50"></div>

      {/* Decorative blobs */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-teal/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-96 h-96 bg-navy/10 rounded-full blur-3xl"></div>

      <div className="relative z-10 w-full max-w-md px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-navy to-navy-light shadow-xl mb-6 transition-all duration-500">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-navy mb-2 tracking-tight">Klinik Sentosa</h1>
          <p className="text-sm text-teal font-medium">Sistem Informasi Manajemen Klinik</p>
        </div>

        {/* Content based on step */}
        {step === 'role' ? (
          <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-2 gap-4">
              <RoleCard
                role="admin"
                title="Admin"
                description="Manajemen sistem"
                {...roleCredentials.admin}
              />
              <RoleCard
                role="dokter"
                title="Dokter"
                description="Pemeriksaan pasien"
                {...roleCredentials.dokter}
              />
              <RoleCard
                role="apoteker"
                title="Apoteker"
                description="Layanan obat"
                {...roleCredentials.apoteker}
              />
              <RoleCard
                role="kepala"
                title="Kepala"
                description="Laporan & pantauan"
                {...roleCredentials.kepala}
              />
            </div>

            <div className="text-center mt-8">
              <p className="text-xs text-slate-400">Pilih peran untuk melanjutkan</p>
            </div>
          </div>
        ) : step === 'doctor-select' ? (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 p-8 shadow-2xl animate-fade-in-up">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal/10 flex items-center justify-center text-teal">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-navy">Pilih Dokter</h3>
                  <p className="text-xs text-slate-500">Silakan pilih akun Anda</p>
                </div>
              </div>
              <button
                onClick={handleBack}
                className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-navy transition-colors"
                title="Kembali"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {doctors.length > 0 ? (
                doctors.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => handleDoctorSelect(doc)}
                    className="flex items-center justify-between p-4 rounded-2xl border border-slate-100 bg-white hover:border-teal/30 hover:bg-teal/5 cursor-pointer transition-all group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-teal group-hover:text-white transition-all">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-navy group-hover:text-teal transition-colors">{doc.name}</p>
                        <p className="text-xs text-slate-400">{doc.username}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal group-hover:translate-x-1 transition-all" />
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-slate-500">
                  Belum ada data dokter.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white/80 backdrop-blur-md rounded-3xl border border-white/50 p-8 shadow-2xl animate-fade-in-up">
            {/* Header with Back Button */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${roleCredentials[selectedRole].color} flex items-center justify-center shadow-lg`}>
                  {selectedRole === 'admin' && <User className="w-6 h-6 text-white" />}
                  {selectedRole === 'dokter' && <Stethoscope className="w-6 h-6 text-white" />}
                  {selectedRole === 'apoteker' && <Pill className="w-6 h-6 text-white" />}
                  {selectedRole === 'kepala' && <Users className="w-6 h-6 text-white" />}
                </div>
                <div>
                  <h3 className="font-bold text-xl text-navy capitalize">{selectedRole}</h3>
                  <p className="text-xs text-slate-500">Masuk ke akun Anda</p>
                </div>
              </div>
              <button
                onClick={handleBack}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-navy transition-colors"
                title="Kembali"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
                  Username
                </label>
                <Input
                  value={credentials.username}
                  onChange={(e) => setCredentials(prev => ({ ...prev, username: e.target.value }))}
                  className="border-slate-200 bg-white/50 focus:bg-white focus:border-teal focus:ring-4 focus:ring-teal/10 h-12 rounded-xl transition-all font-medium text-navy"
                  placeholder={`Username ${selectedRole}`}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs uppercase text-slate-500 font-bold tracking-wider ml-1">
                  Password
                </label>
                <Input
                  type="password"
                  value={credentials.password}
                  onChange={(e) => setCredentials(prev => ({ ...prev, password: e.target.value }))}
                  className="border-slate-200 bg-white/50 focus:bg-white focus:border-teal focus:ring-4 focus:ring-teal/10 h-12 rounded-xl transition-all font-medium text-navy"
                  placeholder="••••••••"
                />
              </div>

              <Button
                className={`w-full bg-gradient-to-r ${roleCredentials[selectedRole].color} hover:opacity-90 text-white shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all font-bold h-12 text-base rounded-xl mt-4`}
                disabled={isPending}
                onClick={handleLogin}
              >
                {isPending ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memproses...
                  </span>
                ) : (
                  "Masuk Sekarang"
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400 font-medium">
            © 2024 Klinik Sentosa.
          </p>
        </div>
      </div>
    </div>
  );
}
