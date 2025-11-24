import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listExaminations, listPatients } from "/src/api/api.js";
import { useAuthStore } from "/src/store/useAuthStore";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { Button } from "/src/components/ui/button";

export default function DokterHistoryPage() {
  const [examinations, setExaminations] = useState([]);
  const [patients, setPatients] = useState([]);
  const { user } = useAuthStore(); // Get logged-in user (doctor)

  const fetchHistory = useCallback(async () => {
    try {
      const [allExaminations, allPatients] = await Promise.all([
        listExaminations(),
        listPatients(),
      ]);

      // Filter examinations for the logged-in doctor
      const doctorsExaminations = allExaminations.filter(
        (exam) => exam.doctor_id === user.id
      );

      setExaminations(doctorsExaminations);
      setPatients(allPatients);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat riwayat pemeriksaan");
    }
  }, [user.id]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "Pasien tidak dikenal";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Riwayat Pasien</CardTitle>
        <Button size="icon" variant="ghost" onClick={fetchHistory} aria-label="Refresh">
          <RefreshCw className="h-5 w-5 text-navy" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {examinations.length > 0 ? (
          examinations.map((exam) => {
            const patientName = getPatientName(exam.patient_id);
            return (
              <div key={exam.id} className="rounded-2xl border border-navy/10 bg-sky-blue/50 p-4 hover:bg-sky-blue/70 hover:shadow-md transition-all">
                <p className="text-sm font-bold text-navy">{patientName}</p>
                <p className="text-xs text-navy/70 font-medium">{new Date(exam.date).toLocaleString()}</p>
                <p className="mt-2 text-sm text-navy font-medium">Diagnosis: {exam.diagnosis}</p>
                {exam.notes && <p className="text-sm text-navy font-medium">Catatan: {exam.notes}</p>}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-center text-navy/70 py-10">Tidak ada riwayat pemeriksaan.</p>
        )}
      </CardContent>
    </Card>
  );
}
