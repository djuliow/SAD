import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { getPrescriptionReport } from "/src/api/api.js";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "/src/lib/utils";

export default function ApotekLaporanPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("selesai"); // default to "selesai" for fulfilled prescriptions
  const [isLoading, setIsLoading] = useState(true);

  const fetchLaporanData = async () => {
    try {
      // Get prescriptions with patient and drug information based on status filter
      const prescriptionReport = await getPrescriptionReport(statusFilter);

      setPrescriptions(prescriptionReport);
      setFilteredPrescriptions(prescriptionReport);
    } catch (error) {
      toast.error(error.message || "Gagal memuat data laporan obat");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLaporanData();
  }, [statusFilter]);

  // Filter prescriptions based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPrescriptions(prescriptions);
    } else {
      const term = searchTerm.toLowerCase();
      const filtered = prescriptions.filter(pres =>
        pres.drug_name.toLowerCase().includes(term) ||
        pres.patient_name?.toLowerCase().includes(term) ||
        pres.examination_id.toString().includes(term)
      );
      setFilteredPrescriptions(filtered);
    }
  }, [searchTerm, prescriptions]);

  // Calculate summary data
  const totalObatDiberikan = filteredPrescriptions.length;
  const totalPendapatan = filteredPrescriptions.reduce((sum, pres) => {
    const quantity = typeof pres.quantity === 'number' ? pres.quantity :
                    typeof pres.qty === 'number' ? pres.qty : 0;
    const price = typeof pres.drug_price === 'number' ? pres.drug_price :
                   typeof pres.drugPrice === 'number' ? pres.drugPrice :
                   typeof pres.harga === 'number' ? pres.harga : 0;
    return sum + (quantity * price);
  }, 0);
  const uniqueMedicineCount = new Set(
    filteredPrescriptions
      .filter(pres => (pres.drug_id || pres.drugId))
      .map(pres => pres.drug_id || pres.drugId)
  ).size;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Total Obat Diberikan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-teal">{totalObatDiberikan}</div>
            <p className="text-xs text-navy/70">jumlah resep yang telah dipenuhi</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Pendapatan dari Obat</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{formatCurrency(typeof totalPendapatan === 'number' && !isNaN(totalPendapatan) ? totalPendapatan : 0)}</div>
            <p className="text-xs text-navy/70">total nilai obat yang diberikan</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Jenis Obat Unik</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{typeof uniqueMedicineCount === 'number' ? uniqueMedicineCount : 0}</div>
            <p className="text-xs text-navy/70">jumlah jenis obat berbeda</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Section */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-lg font-bold text-navy">
                {statusFilter === "selesai" ? "Laporan Obat Diberikan" :
                 statusFilter === "menunggu" ? "Laporan Obat Menunggu" :
                 "Laporan Semua Obat"}
              </CardTitle>
              <p className="text-xs text-navy/70">
                {statusFilter === "selesai" ? "Daftar obat yang telah diberikan kepada pasien" :
                 statusFilter === "menunggu" ? "Daftar obat yang menunggu untuk diberikan" :
                 "Daftar semua obat berdasarkan status resep"}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-10 rounded-md border border-navy/20 bg-white px-3 text-sm w-full sm:w-auto"
              >
                <option value="">Semua Status</option>
                <option value="menunggu">Menunggu</option>
                <option value="selesai">Selesai</option>
              </select>
              <Input
                placeholder="Cari obat, pasien, atau ID pemeriksaan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-64 bg-white border-navy/20"
              />
              <Button
                variant="outline"
                onClick={fetchLaporanData}
                className="border-navy/20 bg-navy text-white hover:bg-navy/90"
              >
                Segarkan
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <p className="text-navy/70">Memuat data laporan...</p>
            </div>
          ) : filteredPrescriptions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-navy/70">Tidak ada data laporan obat yang diberikan.</p>
            </div>
          ) : (
            <div className="rounded-md border border-navy/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-beige hover:bg-beige">
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">ID Resep</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama Pasien</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama Obat</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Jumlah</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Harga Satuan</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Total</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Status</TableHead>
                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Tanggal</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredPrescriptions.map((pres, index) => (
                    <TableRow key={pres.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                      <TableCell className="font-medium text-navy pl-6 py-4">#{pres.id}</TableCell>
                      <TableCell className="text-navy py-4">{pres.patient_name || pres.patientName || 'N/A'}</TableCell>
                      <TableCell className="text-navy py-4">{pres.drug_name || pres.drugName || pres.nama || 'Obat tidak dikenal'}</TableCell>
                      <TableCell className="text-navy py-4">{typeof pres.quantity === 'number' ? `${pres.quantity} pcs` : (typeof pres.qty === 'number' ? `${pres.qty} pcs` : 'Jumlah tidak valid')}</TableCell>
                      <TableCell className="text-navy py-4">
                        {typeof (pres.drug_price || pres.drugPrice || pres.harga) === 'number'
                          ? formatCurrency(pres.drug_price || pres.drugPrice || pres.harga)
                          : 'Rp0'}
                      </TableCell>
                      <TableCell className="text-navy font-semibold py-4">
                        {(typeof pres.quantity === 'number' || typeof pres.qty === 'number') &&
                         (typeof (pres.drug_price || pres.drugPrice || pres.harga) === 'number')
                          ? formatCurrency((pres.quantity || pres.qty || 0) * (pres.drug_price || pres.drugPrice || pres.harga || 0))
                          : 'Rp0'}
                      </TableCell>
                      <TableCell className="text-navy py-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          pres.status === 'selesai' 
                            ? 'bg-green-100 text-green-700 border border-green-200' 
                            : 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                        }`}>
                          {pres.status === 'selesai' ? 'Selesai' : 'Menunggu'}
                        </span>
                      </TableCell>
                      <TableCell className="text-navy py-4">
                        {(pres.prescription_date || pres.prescriptionDate || pres.date)
                          ? format(new Date(pres.prescription_date || pres.prescriptionDate || pres.date), "dd MMM yyyy", { locale: id })
                          : 'Tanggal tidak valid'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}