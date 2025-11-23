import { reports } from "/src/lib/mockData";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { ReportViewer } from "/src/components/cards/report-viewer";

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
