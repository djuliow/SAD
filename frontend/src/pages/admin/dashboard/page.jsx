import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { patients, queues, payments } from "/src/lib/mockData";
import { formatCurrency } from "/src/lib/utils";

export default function AdminDashboardPage() {
  const totalPatients = patients.length;
  const activeQueue = queues.filter((queue) => queue.status !== "COMPLETED").length;
  const incomeToday = payments.reduce((sum, pay) => sum + pay.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Pasien Terdaftar</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{totalPatients}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Antrean Aktif</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{activeQueue}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Pemasukan Hari Ini</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{formatCurrency(incomeToday)}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Antrean Terkini</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
        <div className="rounded-md border border-navy/10 p-4 space-y-3">
          {queues.slice(0, 5).map((queue) => (
            <div key={queue.id} className="flex items-center justify-between rounded-lg bg-sky-blue/50 border border-navy/10 px-4 py-3 hover:bg-sky-blue/30 transition-all">
              <div>
                <p className="text-sm font-bold text-navy">{queue.id}</p>
                <p className="text-xs text-navy/70">Pasien: {queue.patientId}</p>
              </div>
              <Badge variant={queue.status === "PENDING" ? "warning" : "success"}>{queue.status}</Badge>
            </div>
          ))}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
