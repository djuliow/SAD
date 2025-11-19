import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { queues, patients, examinations } from "@/lib/mockData";
import { Badge } from "@/components/ui/badge";

export default function DokterDashboardPage() {
  const myQueue = queues.filter((queue) => queue.doctorId === "u-dokter");
  const latestExam = examinations[0];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Antrean Dokter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myQueue.map((queue) => (
            <div key={queue.id} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{patients.find((p) => p.id === queue.patientId)?.name}</p>
                <p className="text-xs text-slate-500">{new Date(queue.scheduledAt).toLocaleString()}</p>
              </div>
              <Badge variant="default">{queue.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pemeriksaan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-500">Keluhan</p>
          <p className="text-base text-slate-800">{latestExam.complaint}</p>
          <p className="mt-4 text-sm text-slate-500">Diagnosis</p>
          <p className="text-base text-slate-800">{latestExam.diagnosis}</p>
        </CardContent>
      </Card>
    </div>
  );
}
