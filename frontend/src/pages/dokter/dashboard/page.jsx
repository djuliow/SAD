import { useEffect, useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { getDoctorDashboardSummary } from "/src/api/api.js";
import { useAuthStore } from "/src/store/useAuthStore";
import { toast } from "sonner";
import { Users, Watch, FileText } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

export default function DokterDashboardPage() {
  const [summary, setSummary] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchData = useCallback(async () => {
    if (!user?.id) return;
    setIsLoading(true);
    try {
      const data = await getDoctorDashboardSummary(user.id);
      setSummary(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data dashboard");
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (isLoading) {
    return <p>Memuat data dashboard...</p>;
  }

  if (!summary) {
    return <p>Gagal memuat data dashboard.</p>;
  }

  const { waiting_count, in_progress_count, pharmacy_count, payment_pending_count, latest_examination } = summary;

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
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
      {/* Waiting Patients Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pasien Menunggu</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{waiting_count}</div>
          <p className="text-xs text-muted-foreground">pasien di ruang tunggu</p>
        </CardContent>
      </Card>

      {/* In Progress Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pemeriksaan Berlangsung</CardTitle>
          <Watch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{in_progress_count}</div>
          <p className="text-xs text-muted-foreground">pasien sedang diperiksa</p>
        </CardContent>
      </Card>

      {/* Pharmacy Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Di Apotek</CardTitle>
          <Watch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pharmacy_count}</div>
          <p className="text-xs text-muted-foreground">pasien di apotek</p>
        </CardContent>
      </Card>

      {/* Payment Pending Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Menunggu Pembayaran</CardTitle>
          <Watch className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{payment_pending_count}</div>
          <p className="text-xs text-muted-foreground">pasien menunggu pembayaran</p>
        </CardContent>
      </Card>

      {/* Latest Examination Card */}
      <Card className="lg:col-span-5">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5"/>
            Pemeriksaan Terakhir Anda
          </CardTitle>
        </CardHeader>
        <CardContent>
          {latest_examination ? (
            <div className="space-y-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-slate-500">{format(new Date(latest_examination.date), "eeee, dd MMMM yyyy", { locale: id })}</p>
                <div className="ml-2">{getStatusBadge(latest_examination.patient_status || 'diperiksa')}</div>
              </div>
              <h3 className="text-xl font-bold text-navy">{latest_examination.patient_name}</h3>
              <p className="text-md text-slate-700">
                <span className="font-semibold">Diagnosis:</span> {latest_examination.diagnosis}
              </p>
            </div>
          ) : (
            <p className="text-sm text-slate-500 text-center py-8">Belum ada riwayat pemeriksaan.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
