import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { examinations, patients } from "@/lib/mockData";

export default function DokterHistoryPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Riwayat Pasien</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {examinations.map((exam) => {
          const patient = patients.find((p) => p.id === exam.patientId);
          return (
            <div key={exam.id} className="rounded-2xl border border-navy/10 bg-sky-blue/50 p-4 hover:bg-sky-blue/70 hover:shadow-md transition-all">
              <p className="text-sm font-bold text-navy">{patient?.name}</p>
              <p className="text-xs text-navy/70 font-medium">{new Date(exam.createdAt).toLocaleString()}</p>
              <p className="mt-2 text-sm text-navy font-medium">Keluhan: {exam.complaint}</p>
              <p className="text-sm text-navy font-medium">Diagnosis: {exam.diagnosis}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
