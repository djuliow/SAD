import { useState, useEffect, useCallback, useTransition } from "react";
import { listReports, generateReport } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ReportViewer } from "/src/components/cards/report-viewer";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { toast } from "sonner";
import { RefreshCw, FilePlus } from "lucide-react";
import { format } from "date-fns";

export default function KepalaReportPage() {
  const [reports, setReports] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [isGenerating, startGenerating] = useTransition();

  // Form state
  const [reportType, setReportType] = useState("DAILY");
  const [period, setPeriod] = useState(format(new Date(), "yyyy-MM-dd"));

  const fetchReports = useCallback(async () => {
    setIsFetching(true);
    try {
      const data = await listReports();
      setReports(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat laporan");
    } finally {
      setIsFetching(false);
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerateReport = (e) => {
    e.preventDefault();
    startGenerating(async () => {
      try {
        await generateReport(reportType, period);
        toast.success(`Laporan ${reportType.toLowerCase()} untuk periode ${period} berhasil dibuat.`);
        fetchReports(); // Refresh the list
      } catch (error) {
        toast.error(error.message ?? "Gagal membuat laporan");
      }
    });
  };
  
  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setReportType(newType);
    if (newType === 'DAILY') {
      setPeriod(format(new Date(), "yyyy-MM-dd"));
    } else {
      setPeriod(format(new Date(), "yyyy-MM"));
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><FilePlus className="h-5 w-5"/> Buat Laporan Baru</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerateReport} className="space-y-4">
            <div>
              <Label>Tipe Laporan</Label>
              <select value={reportType} onChange={handleTypeChange} className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm">
                <option value="DAILY">Harian</option>
                <option value="MONTHLY">Bulanan</option>
              </select>
            </div>
            <div>
              <Label>Periode</Label>
              <Input 
                type={reportType === 'DAILY' ? 'date' : 'month'} 
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                max={reportType === 'DAILY' ? format(new Date(), "yyyy-MM-dd") : format(new Date(), "yyyy-MM")}
              />
            </div>
            <Button className="w-full bg-teal hover:bg-teal/90 text-white" disabled={isGenerating}>
              {isGenerating ? "Membuat..." : "Buat Laporan"}
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Ringkasan Laporan</CardTitle>
          <Button size="icon" variant="ghost" onClick={fetchReports} aria-label="Refresh" disabled={isFetching}>
            <RefreshCw className={`h-5 w-5 text-navy ${isFetching ? 'animate-spin' : ''}`} />
          </Button>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          {isFetching ? (
            <p className="text-sm text-center text-navy/70 py-10 md:col-span-2">Memuat laporan...</p>
          ) : reports.length > 0 ? (
            reports.map((report) => <ReportViewer key={report.id} report={report} />)
          ) : (
            <p className="text-sm text-center text-navy/70 py-10 md:col-span-2">Belum ada laporan yang dibuat.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
