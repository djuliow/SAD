import { formatCurrency } from "/src/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";

export function ReportViewer({ report }) {
  return (
    <Card className="bg-white border border-navy/10 shadow-sm overflow-hidden">
      <CardHeader className="bg-beige border-b border-navy/10">
        <CardTitle className="text-lg font-bold text-navy">Laporan {report.type === "DAILY" ? "Harian" : "Bulanan"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-navy p-6">
        <p>Periode: {report.period}</p>
        <p>Total Pasien: {report.totalPatients}</p>
        <p>Total Resep: {report.prescriptions}</p>
        <p>Pendapatan: {formatCurrency(report.totalIncome)}</p>
      </CardContent>
    </Card>
  );
}
