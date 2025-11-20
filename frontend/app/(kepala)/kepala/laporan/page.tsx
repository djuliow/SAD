import { reports } from "@/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReportViewer } from "@/components/cards/report-viewer";

export default function KepalaReportPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Ringkasan Laporan</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        {reports.map((report) => (
          <ReportViewer key={report.id} report={report} />
        ))}
      </CardContent>
    </Card>
  );
}
