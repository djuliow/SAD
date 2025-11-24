import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listQueues, listExaminations, listPatients } from "/src/api/api.js";
import { Badge } from "/src/components/ui/badge";
import { toast } from "sonner";

export default function DokterDashboardPage() {
  const [myQueue, setMyQueue] = useState([]);
  const [latestExam, setLatestExam] = useState(null);
  const [patients, setPatients] = useState([]);

  const fetchData = async () => {
    try {
      const [queueData, examData, patientData] = await Promise.all([
        listQueues(),
        listExaminations(),
        listPatients(),
      ]);

      setPatients(patientData);
      setMyQueue(queueData.filter((q) => q.status === "diperiksa"));

      if (examData && examData.length > 0) {
        setLatestExam(examData[examData.length - 1]);
      }
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getPatientName = (patientId) => {
    const patient = patients.find((p) => p.id === patientId);
    return patient ? patient.name : "N/A";
  };

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Antrean Dokter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myQueue.length > 0 ? (
            myQueue.map((queue) => (
              <div key={queue.id} className="flex items-center justify-between rounded-xl bg-sky-blue/50 border border-navy/10 px-4 py-3 hover:bg-sky-blue/70 hover:shadow-md transition-all">
                <div>
                  <p className="text-sm font-bold text-navy">{queue.patient_name}</p>
                </div>
                <Badge variant="default" className="capitalize">{queue.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-navy/70">Tidak ada pasien dalam antrean.</p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pemeriksaan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          {latestExam ? (
            <>
              <p className="text-sm text-navy/70 font-medium">Pasien</p>
              <p className="text-base text-navy mt-1">{getPatientName(latestExam.patient_id)}</p>
              <p className="mt-4 text-sm text-navy/70 font-medium">Diagnosis</p>
              <p className="text-base text-navy mt-1">{latestExam.diagnosis}</p>
            </>
          ) : (
            <p className="text-sm text-navy/70">Belum ada data pemeriksaan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
