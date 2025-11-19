import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExaminationForm } from "@/components/forms/examination-form";
import { PrescriptionForm } from "@/components/forms/prescription-form";
import { queues, patients, examinations } from "@/lib/mockData";

export default function PemeriksaanDetailPage({ params }: { params: { id: string } }) {
  const queue = queues.find((q) => q.id === params.id);
  if (!queue) return notFound();
  const patient = patients.find((p) => p.id === queue.patientId);
  const latestExam = examinations.find((exam) => exam.queueId === queue.id);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Data Pasien</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          <p className="font-semibold text-slate-900">{patient?.name}</p>
          <p>MRN: {patient?.medicalRecordNo}</p>
          <p>Telepon: {patient?.phone}</p>
          <p>Alamat: {patient?.address}</p>
          <p>Status Antrean: {queue.status}</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Catat Hasil Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent>
          <ExaminationForm doctorId="u-dokter" queueId={queue.id} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Buat Resep Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <PrescriptionForm examId={latestExam?.id ?? "ex-001"} />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm">
          {examinations
            .filter((exam) => exam.patientId === patient?.id)
            .map((exam) => (
              <div key={exam.id} className="rounded-lg bg-slate-50 p-3">
                <p className="font-semibold text-slate-800">{exam.diagnosis}</p>
                <p className="text-xs text-slate-500">{exam.complaint}</p>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  );
}
