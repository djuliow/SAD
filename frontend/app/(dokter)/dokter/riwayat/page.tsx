import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { examinations, patients } from "@/lib/mockData";

export default function DokterHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Riwayat Pasien</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {examinations.map((exam) => {
          const patient = patients.find((p) => p.id === exam.patientId);
          return (
            <div key={exam.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{patient?.name}</p>
              <p className="text-xs text-slate-500">{new Date(exam.createdAt).toLocaleString()}</p>
              <p className="mt-2 text-sm text-slate-700">Keluhan: {exam.complaint}</p>
              <p className="text-sm text-slate-700">Diagnosis: {exam.diagnosis}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
