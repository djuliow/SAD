import { useState, useEffect } from "react";
import { ScheduleForm } from "/src/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { AdvancedScheduleTable } from "/src/components/tables/advanced-schedule-table";
import { listSchedules, listEmployees } from "/src/api/api.js";
import { toast } from "sonner";

export default function AdminSchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getDoctorName = (userId) => {
    const doctor = employees.find(e => e.id === userId);
    return doctor ? doctor.name : "Unknown";
  };

  const [activeTab, setActiveTab] = useState('list'); // 'list' or 'calendar'

  return (
    <div className="space-y-6">
      <div className="flex space-x-4">
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'list'
              ? 'bg-teal text-white shadow-sm'
              : 'bg-white text-navy/80 hover:bg-white/10 hover:text-white border border-navy/10'
          }`}
          onClick={() => setActiveTab('list')}
        >
          Daftar Jadwal
        </button>
        <button
          className={`px-4 py-2 rounded-lg font-medium ${
            activeTab === 'calendar'
              ? 'bg-teal text-white shadow-sm'
              : 'bg-white text-navy/80 hover:bg-white/10 hover:text-white border border-navy/10'
          }`}
          onClick={() => setActiveTab('calendar')}
        >
          Kalender Jadwal
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
        <Card className="bg-white border border-navy/10 shadow-md h-fit">
          <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-navy">Input Jadwal Dokter</CardTitle>
            <p className="text-xs text-navy/70">Masukkan jadwal praktek dokter di sini.</p>
          </CardHeader>
          <CardContent className="p-6">
            <ScheduleForm onSuccess={fetchData} />
          </CardContent>
        </Card>

        {activeTab === 'list' ? (
          <Card className="bg-white border border-navy/10 shadow-md">
            <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-navy">Daftar Jadwal Dokter</CardTitle>
            </CardHeader>
            <CardContent className="p-6 pt-6">
              <Table>
                <TableHeader>
                  <TableRow className="bg-beige hover:bg-beige">
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Hari</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Jam Praktek</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                    </TableRow>
                  ) : schedules.length > 0 ? (
                    schedules.map((sch) => (
                      <TableRow key={sch.id} className="hover:bg-sky-blue/30 transition-colors">
                        <TableCell className="font-medium text-navy pl-6 py-4">{getDoctorName(sch.user_id)}</TableCell>
                        <TableCell className="text-navy py-4 capitalize">{sch.day}</TableCell>
                        <TableCell className="text-navy py-4">{sch.time}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-navy/70">Belum ada jadwal.</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-white border border-navy/10 shadow-md">
            <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
              <CardTitle className="text-lg font-bold text-navy">Kalender Jadwal</CardTitle>
              <p className="text-xs text-navy/70">Tampilan jadwal dalam bentuk kalender</p>
            </CardHeader>
            <CardContent className="p-6 pt-6 overflow-x-auto">
              <AdvancedScheduleTable schedules={schedules} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
