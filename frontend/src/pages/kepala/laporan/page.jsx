import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";
import { listReports, generateReport } from "/src/api/api.js";
import { toast } from "sonner";
import { format } from "date-fns";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Select, SelectItem } from "/src/components/ui/select";
import { X, Plus, FileText } from "lucide-react";

export default function KepalaReportPage() {
  const [reports, setReports] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportType, setReportType] = useState("DAILY");
  const [period, setPeriod] = useState("");
  const [manualData, setManualData] = useState({
    total_income: 0,
    total_expenses: 0,
    total_patients: 0,
    notes: ""
  });

  const fetchReports = async () => {
    try {
      const data = await listReports();
      setReports(data);
    } catch (error) {
      toast.error("Gagal memuat laporan");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleGenerateReport = async () => {
    if (!period) {
      toast.error("Pilih periode laporan");
      return;
    }

    try {
      // Construct payload for manual report
      const payload = {
        type: reportType,
        period: period,
        manual_summary: {
          total_income: parseInt(manualData.total_income),
          total_expenses: parseInt(manualData.total_expenses),
          total_patients: parseInt(manualData.total_patients),
          notes: manualData.notes
        }
      };

      await generateReport(payload.type, payload.period, payload.manual_summary);
      toast.success("Laporan berhasil dibuat");
      setIsDialogOpen(false);
      fetchReports();
      // Reset form
      setManualData({ total_income: 0, total_expenses: 0, total_patients: 0, notes: "" });
      setPeriod("");
    } catch (error) {
      toast.error("Gagal membuat laporan");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-navy">Laporan Keuangan</CardTitle>
            <p className="text-xs text-navy/70">Kelola dan lihat laporan keuangan klinik.</p>
          </div>
          <Button onClick={() => setIsDialogOpen(true)} className="bg-teal hover:bg-teal/90 text-white gap-2">
            <Plus className="h-4 w-4" /> Buat Laporan Manual
          </Button>
        </CardHeader>
        <CardContent className="p-6">
          <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Tanggal Dibuat</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Tipe</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Periode</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Total Pasien</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Pemasukan</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Pengeluaran</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Catatan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                  </TableRow>
                ) : reports.length > 0 ? (
                  reports.map((report) => {
                    const summary = JSON.parse(report.summary);
                    return (
                      <TableRow key={report.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                        <TableCell className="font-medium text-navy pl-6 py-4">{format(new Date(report.generated_at), "dd MMM yyyy HH:mm")}</TableCell>
                        <TableCell className="text-navy py-4">{report.type}</TableCell>
                        <TableCell className="text-navy py-4">{report.period}</TableCell>
                        <TableCell className="text-navy py-4">{summary.total_patients}</TableCell>
                        <TableCell className="text-navy py-4 font-semibold text-green-600">Rp {summary.total_income?.toLocaleString()}</TableCell>
                        <TableCell className="text-navy py-4 font-semibold text-red-500">Rp {summary.total_expenses?.toLocaleString() || 0}</TableCell>
                        <TableCell className="text-navy py-4 italic text-xs">{summary.notes || "-"}</TableCell>
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-navy/70">Belum ada laporan.</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Manual Report Dialog */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">Input Laporan Keuangan</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsDialogOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Tipe Laporan</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectItem value="DAILY">Harian</SelectItem>
                    <SelectItem value="MONTHLY">Bulanan</SelectItem>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Periode</Label>
                  <Input
                    type={reportType === "DAILY" ? "date" : "month"}
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Total Pemasukan (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  value={manualData.total_income}
                  onChange={(e) => setManualData({ ...manualData, total_income: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Pengeluaran (Rp)</Label>
                <Input
                  type="number"
                  min="0"
                  value={manualData.total_expenses}
                  onChange={(e) => setManualData({ ...manualData, total_expenses: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Total Pasien</Label>
                <Input
                  type="number"
                  min="0"
                  value={manualData.total_patients}
                  onChange={(e) => setManualData({ ...manualData, total_patients: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>Catatan</Label>
                <Input
                  value={manualData.notes}
                  onChange={(e) => setManualData({ ...manualData, notes: e.target.value })}
                  placeholder="Keterangan tambahan..."
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Batal</Button>
                <Button onClick={handleGenerateReport} className="bg-teal hover:bg-teal/90 text-white">Simpan Laporan</Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
