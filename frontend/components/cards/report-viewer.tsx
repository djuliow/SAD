import { Report } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportViewer({ report }: { report: Report }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Laporan {report.type === "DAILY" ? "Harian" : "Bulanan"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-slate-600">
        <p>Periode: {report.period}</p>
        <p>Total Pasien: {report.totalPatients}</p>
        <p>Total Resep: {report.prescriptions}</p>
        <p>Pendapatan: {formatCurrency(report.totalIncome)}</p>
      </CardContent>
    </Card>
  );
}
