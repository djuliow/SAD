
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { NAVIGATION } from "/src/constants/navigation";
import { useAuthStore } from "/src/store/useAuthStore";
import { listQueues, listEmployees } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { cn } from "/src/lib/utils";
import { LucideIconMap } from "./icons";

function ActiveQueueInfo() { // role prop removed
  const [lastPatient, setLastPatient] = useState(null);

  useEffect(() => {
    const fetchLastPatient = async () => {
      try {
        const queues = await listQueues();
        // Find the last queue entry that is not 'selesai'
        const activeQueues = queues.filter(q => q.status !== 'selesai');
        if (activeQueues.length > 0) {
          // Assuming the last one in the array is the most recent
          setLastPatient(activeQueues[activeQueues.length - 1]);
        } else {
          setLastPatient(null);
        }
      } catch (error) {
        console.error("Failed to fetch active queue:", error);
      }
    };
    fetchLastPatient();
  }, []); // Dependency array changed to empty, runs once on mount

  return (
    <div className="mt-10 rounded-xl bg-navy-dark p-4 text-sm shadow-inner border border-white/5">
      <p className="font-bold text-white">Antrean Aktif</p>
      <p className="text-xs text-white/80 mt-1">Pasien terakhir:</p>
      <p className="text-sm font-semibold text-white mt-1 bg-white/20 px-2 py-1 rounded">
        {lastPatient ? lastPatient.patient_name : "Tidak ada"}
      </p>
    </div>
  );
}

export function AppShell({ children }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuthStore();
  const [employeeName, setEmployeeName] = useState("");

  useEffect(() => {
    if (user) {
      const fetchEmployeeName = async () => {
        try {
          const employees = await listEmployees();
          const currentEmployee = employees.find(e => e.role === user.role);
          if (currentEmployee) {
            setEmployeeName(currentEmployee.name);
          } else {
            setEmployeeName(user.username); // Fallback to username
          }
        } catch (error) {
          console.error("Failed to fetch employees", error);
          setEmployeeName(user.username); // Fallback on error
        }
      };
      fetchEmployeeName();
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const menu = NAVIGATION[user.role] || [];

  return (
    <div className="flex min-h-screen bg-sky-blue">
      <aside className="hidden w-64 flex-shrink-0 border-r border-navy/10 bg-navy px-4 py-6 shadow-xl lg:block">
        <div className="mb-8 space-y-1 rounded-xl bg-navy-light p-5 text-white shadow-md">
          <p className="text-xs uppercase text-white/90 font-semibold tracking-wide">SISTEM INFORMASI</p>
          <h1 className="text-xl font-bold text-white">Klinik Sentosa</h1>
          <p className="text-sm text-white/90 uppercase">{user.role}</p>
        </div>
        <nav className="space-y-1">
          {menu.length > 0 ? (
            menu.map((item) => {
              const Icon = LucideIconMap[item.icon] ?? LucideIconMap.activity;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all",
                    active
                      ? "bg-teal text-white shadow-sm"
                      : "text-white/80 hover:bg-white/10 hover:text-white"
                  )}
                  to={item.href}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })
          ) : (
            <div className="px-3 py-2.5 text-sm text-white/60">No menu items available</div>
          )}
        </nav>
        <ActiveQueueInfo /> 
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-navy/10 bg-navy px-6 py-4 shadow-md">
          <div>
            <p className="text-sm text-white/90 font-medium">Selamat datang,</p>
            <p className="text-lg font-bold text-white">{employeeName}</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" className="text-white/80 hover:bg-white/10 hover:text-white" onClick={() => {
              if (typeof window !== 'undefined') {
                window.location.reload();
              }
            }}>
              Refresh
            </Button>
            <Button
              variant="outline"
              className="border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white hover:border-white/40 shadow-sm backdrop-blur-sm"
              onClick={() => {
                signOut();
                navigate("/login");
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
