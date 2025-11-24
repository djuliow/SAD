import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { listSchedules, listEmployees } from "/src/api/api.js";
import { toast } from "sonner";
import { ScheduleForm } from "/src/components/forms/schedule-form";

export default function KepalaJadwalPage() {
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

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card className="bg-white border border-navy/10 shadow-md h-fit">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Input Jadwal Dokter</CardTitle>
          <p className="text-xs text-navy/70">Masukkan jadwal praktek dokter di sini.</p>
        </CardHeader>
        <CardContent>
          <ScheduleForm onSuccess={fetchData} />
        </CardContent>
      </Card>

      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Jadwal Dokter</CardTitle>
          <p className="text-xs text-navy/70">Daftar jadwal praktek dokter yang terdaftar.</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama Dokter</TableHead>
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
                    <TableRow key={sch.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                      <TableCell className="font-medium text-navy pl-6 py-4">{getDoctorName(sch.user_id)}</TableCell>
                      <TableCell className="text-navy py-4 capitalize">{sch.day}</TableCell>
                      <TableCell className="text-navy py-4">{sch.start_time} - {sch.end_time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-8 text-navy/70">Belum ada jadwal.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
