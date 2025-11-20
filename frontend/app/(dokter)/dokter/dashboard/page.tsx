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
          <CardTitle className="text-lg">Antrean Dokter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {myQueue.map((queue) => (
            <div key={queue.id} className="flex items-center justify-between rounded-xl bg-sky-blue/50 border border-navy/10 px-4 py-3 hover:bg-sky-blue/70 hover:shadow-md transition-all">
              <div>
                <p className="text-sm font-bold text-navy">{patients.find((p) => p.id === queue.patientId)?.name}</p>
                <p className="text-xs text-navy/70">{new Date(queue.scheduledAt).toLocaleString()}</p>
              </div>
              <Badge variant="default">{queue.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pemeriksaan Terakhir</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-navy/70 font-medium">Keluhan</p>
          <p className="text-base text-navy mt-1">{latestExam.complaint}</p>
          <p className="mt-4 text-sm text-navy/70 font-medium">Diagnosis</p>
          <p className="text-base text-navy mt-1">{latestExam.diagnosis}</p>
        </CardContent>
      </Card>
    </div>
  );
}
