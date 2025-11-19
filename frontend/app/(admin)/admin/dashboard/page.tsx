import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { patients, queues, payments } from "@/lib/mockData";
import { formatCurrency } from "@/lib/utils";

export default function AdminDashboardPage() {
  const totalPatients = patients.length;
  const activeQueue = queues.filter((queue) => queue.status !== "COMPLETED").length;
  const incomeToday = payments.reduce((sum, pay) => sum + pay.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Pasien Terdaftar</CardDescription>
            <CardTitle>{totalPatients}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Antrean Aktif</CardDescription>
            <CardTitle>{activeQueue}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Pemasukan Hari Ini</CardDescription>
            <CardTitle>{formatCurrency(incomeToday)}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Antrean Terkini</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {queues.slice(0, 5).map((queue) => (
            <div key={queue.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">{queue.id}</p>
                <p className="text-xs text-slate-500">Pasien: {queue.patientId}</p>
              </div>
              <Badge variant={queue.status === "PENDING" ? "warning" : "success"}>{queue.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
