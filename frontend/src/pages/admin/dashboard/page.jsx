import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { listPatients, listQueues, listPayments } from "/src/api/api.js";
import { formatCurrency } from "/src/lib/utils";
import { toast } from "sonner";

function getTodayDateString() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    activeQueue: 0,
    incomeToday: 0,
  });
  const [recentQueues, setRecentQueues] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const today = getTodayDateString();
        const [patientsData, queuesData, paymentsTodayData] = await Promise.all([
          listPatients(),
          listQueues(),
          listPayments(today),
        ]);

        const activeQueueCount = queuesData.filter(q => q.status !== "selesai").length;
        const totalIncome = paymentsTodayData.reduce((sum, pay) => sum + pay.total_amount, 0);

        setStats({
          totalPatients: patientsData.length,
          activeQueue: activeQueueCount,
          incomeToday: totalIncome,
        });

        setRecentQueues(queuesData.slice(0, 5));

      } catch (error) {
        toast.error(error.message ?? "Gagal memuat data dashboard");
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Pasien Terdaftar</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{stats.totalPatients}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Antrean Aktif</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{stats.activeQueue}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="bg-beige border border-teal shadow-md border-l-4">
          <CardHeader>
            <CardDescription className="text-navy/70 font-medium">Pemasukan Hari Ini</CardDescription>
            <CardTitle className="text-3xl font-bold text-navy mt-2">{formatCurrency(stats.incomeToday)}</CardTitle>
          </CardHeader>
        </Card>
      </div>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Antrean Terkini</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
        <div className="rounded-md border border-navy/10 p-4 space-y-3">
          {recentQueues.length > 0 ? (
            recentQueues.map((queue) => (
              <div key={queue.id} className="flex items-center justify-between rounded-lg bg-sky-blue/50 border border-navy/10 px-4 py-3 hover:bg-sky-blue/30 transition-all">
                <div>
                  <p className="text-sm font-bold text-navy">Antrean #{queue.id}</p>
                  <p className="text-xs text-navy/70">Pasien: {queue.patient_name}</p>
                </div>
                <Badge variant={queue.status === "menunggu" ? "warning" : "success"} className="capitalize">{queue.status}</Badge>
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-navy/70">Tidak ada antrean saat ini.</p>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
