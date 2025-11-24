import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { getAdminDashboardSummary } from "/src/api/api.js";
import { formatCurrency } from "/src/lib/utils";
import { toast } from "sonner";
import { Users, List, CircleDollarSign, UserPlus } from "lucide-react";

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await getAdminDashboardSummary();
      setSummary(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <div className="text-center p-8">Memuat data dashboard...</div>
  }
  
  if (!summary) {
    return <div className="text-center p-8">Gagal memuat data. Coba lagi nanti.</div>
  }

  const { total_patients_all_time, patients_today_count, active_queue_count, income_today, recent_queues } = summary;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'menunggu': return <Badge variant="warning">Menunggu</Badge>;
      case 'diperiksa': return <Badge variant="info">Diperiksa</Badge>;
      case 'apotek': return <Badge variant="default">Apotek</Badge>;
      case 'membayar': return <Badge variant="secondary">Membayar</Badge>;
      case 'selesai': return <Badge variant="success">Selesai</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Pasien</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total_patients_all_time}</div>
            <p className="text-xs text-muted-foreground">pasien terdaftar</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pasien Hari Ini</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{patients_today_count}</div>
            <p className="text-xs text-muted-foreground">pasien baru hari ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Antrean Aktif</CardTitle>
            <List className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{active_queue_count}</div>
            <p className="text-xs text-muted-foreground">pasien sedang menunggu/diperiksa</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pemasukan Hari Ini</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(income_today)}</div>
            <p className="text-xs text-muted-foreground">dari semua pembayaran</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Antrean Terkini</CardTitle>
        </CardHeader>
        <CardContent>
        <div className="space-y-3">
          {recent_queues.length > 0 ? (
            recent_queues.map((queue, index) => (
              <div key={queue.id} className="flex items-center justify-between rounded-lg bg-sky-blue/50 px-4 py-3">
                <p className="text-sm font-bold text-navy">
                  <span className="text-xs text-slate-500 font-normal mr-1">{index + 1}.</span>
                  {queue.patient_name}
                  <span className="text-xs text-slate-500 font-normal ml-1">({queue.medicalRecordNo})</span>
                </p>
                {getStatusBadge(queue.status)}
              </div>
            ))
          ) : (
            <p className="text-sm text-center text-navy/70 py-4">Tidak ada antrean saat ini.</p>
          )}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
