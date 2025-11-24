import { useState, useEffect, useCallback } from "react";
import { listReports } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ReportViewer } from "/src/components/cards/report-viewer";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function KepalaReportPage() {
  const [reports, setReports] = useState([]);

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Ringkasan Laporan</CardTitle>
        <Button size="icon" variant="ghost" onClick={fetchReports} aria-label="Refresh">
          <RefreshCw className="h-5 w-5 text-navy" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {reports.length > 0 ? (
          reports.map((report) => (
            <ReportViewer key={report.id} report={report} />
          ))
        ) : (
          <p className="text-sm text-center text-navy/70 py-10 md:col-span-2">Belum ada laporan yang dibuat.</p>
        )}
      </CardContent>
    </Card>
  );
}
