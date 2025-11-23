import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ExaminationForm } from "/src/components/forms/examination-form";
import { PrescriptionForm } from "/src/components/forms/prescription-form";
import { queues, patients, examinations } from "/src/lib/mockData";

export default function PemeriksaanDetailPage() {
  const { id } = useParams();
  const queue = queues.find((q) => q.id === id);
  if (!queue) return null;
  const patient = patients.find((p) => p.id === queue.patientId);
  const latestExam = examinations.find((exam) => exam.queueId === queue.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Data Pasien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-navy p-6 pt-8">
          <p className="font-semibold text-navy">{patient?.name}</p>
          <p>MRN: {patient?.medicalRecordNo}</p>
          <p>Telepon: {patient?.phone}</p>
          <p>Alamat: {patient?.address}</p>
          <p>Status Antrean: {queue.status}</p>
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Catat Hasil Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <ExaminationForm doctorId="u-dokter" queueId={queue.id} />
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Buat Resep Obat</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <PrescriptionForm examId={latestExam?.id ?? "ex-001"} />
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Riwayat Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8 space-y-3">
          {examinations
            .filter((exam) => exam.patientId === patient?.id)
            .map((exam) => (
              <div key={exam.id} className="rounded-lg bg-sky-blue/50 border border-navy/10 p-3 hover:bg-sky-blue/30 transition-all">
                <p className="font-bold text-navy">{exam.diagnosis}</p>
                <p className="text-xs text-navy/70 font-medium">{exam.complaint}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
