
import { useState, useTransition, useEffect, useCallback } from "react";
import { listReports, generateReport } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ReportViewer } from "/src/components/cards/report-viewer";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "/src/components/ui/tabs";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function AdminReportPage() {
  const [activeType, setActiveType] = useState("DAILY");
  const [reports, setReports] = useState([]);
  const [pending, startTransition] = useTransition();

  const fetchReports = useCallback(async () => {
    try {
      const data = await listReports();
      setReports(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat laporan");
    }
  }, []);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const handleGenerate = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const period = formData.get("period");
    if (!period) {
      toast.error("Silakan masukkan periode laporan");
      return;
    }

    startTransition(async () => {
      try {
        const newReport = await generateReport(activeType, period);
        toast.success("Laporan berhasil dibuat");
        // Optimistically add to the list, or just refetch
        fetchReports();
      } catch (error) {
        toast.error(error.message ?? "Gagal membuat laporan");
      }
    });
  };

  const filtered = reports.filter((report) => report.type === activeType);

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between bg-beige border-b border-navy/10">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-4">
            <CardTitle className="text-lg font-bold text-navy">Generator Laporan</CardTitle>
            <Button size="icon" variant="ghost" onClick={fetchReports} aria-label="Refresh">
              <RefreshCw className="h-5 w-5 text-navy" />
            </Button>
          </div>
          <p className="text-xs text-navy/70">Pilih periode dan klik Generate untuk membuat laporan baru.</p>
        </div>
        <form className="flex items-center gap-2" onSubmit={handleGenerate}>
          <Input
            name="period"
            placeholder={activeType === "DAILY" ? "YYYY-MM-DD" : "YYYY-MM"}
            className="w-40"
          />
          <Button className="bg-teal hover:bg-teal/90 text-white shadow-sm" disabled={pending} type="submit">
            Generate
          </Button>
        </form>
      </CardHeader>
      <CardContent className="p-6">
        <Tabs defaultValue="DAILY" onValueChange={(value) => setActiveType(value)}>
          <TabsList className="bg-beige rounded-full p-1 inline-flex mb-6">
            <TabsTrigger
              value="DAILY"
              className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal data-[state=active]:text-white data-[state=active]:shadow-sm text-navy hover:bg-teal/10"
            >
              Harian
            </TabsTrigger>
            <TabsTrigger
              value="MONTHLY"
              className="rounded-full px-6 py-2 text-sm font-medium transition-all data-[state=active]:bg-teal data-[state=active]:text-white data-[state=active]:shadow-sm text-navy hover:bg-teal/10"
            >
              Bulanan
            </TabsTrigger>
          </TabsList>
          <TabsContent value="DAILY">
            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((report) => (
                  <ReportViewer key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-navy/70 py-10">Belum ada laporan harian yang dibuat.</p>
            )}
          </TabsContent>
          <TabsContent value="MONTHLY">
            {filtered.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2">
                {filtered.map((report) => (
                  <ReportViewer key={report.id} report={report} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-center text-navy/70 py-10">Belum ada laporan bulanan yang dibuat.</p>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
