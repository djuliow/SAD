import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listSchedules, listEmployees } from "/src/api/api.js";
import { toast } from "sonner";

export default function KepalaSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [schedulesData, employeesData] = await Promise.all([
          listSchedules(),
          listEmployees()
        ]);
        setSchedules(schedulesData);
        setEmployees(employeesData);
      } catch (error) {
        toast.error("Gagal memuat data jadwal");
      }
    };
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monitoring Jadwal</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {schedules.length > 0 ? (
          schedules.map((schedule) => {
            // Find employee name based on user_id in schedule
            // Note: ScheduleEntry has user_id and user_name, but user_name might be outdated or we might want to lookup from employees list
            // For now, let's use the user_name from schedule if available, or lookup
            const employeeName = schedule.user_name || employees.find(e => e.id === schedule.user_id)?.name || "Unknown";

            return (
              <div key={schedule.id} className="rounded-xl border border-navy/10 bg-sky-blue/50 p-4 hover:bg-sky-blue/70 hover:shadow-md transition-all">
                <p className="text-sm font-bold text-navy">{employeeName}</p>
                <p className="text-xs text-navy/70 font-medium">Shift: {schedule.time}</p>
                <p className="text-sm text-navy font-medium">{schedule.day} - {schedule.activity}</p>
              </div>
            );
          })
        ) : (
          <p className="text-sm text-center text-navy/70 py-10">Belum ada jadwal yang diatur.</p>
        )}
      </CardContent>
    </Card>
  );
}
