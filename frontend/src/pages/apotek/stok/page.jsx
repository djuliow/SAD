import { useState, useEffect, useCallback } from "react";
import { MedicineForm } from "/src/components/forms/medicine-form";
import { NewMedicineForm } from "/src/components/forms/new-medicine-form";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listMedicines } from "/src/api/api.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { toast } from "sonner";

export default function ApotekStockPage() {
  const [medicines, setMedicines] = useState([]);

  const fetchMedicines = useCallback(async () => {
    try {
      const data = await listMedicines();
      setMedicines(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data obat");
    }
  }, []);

  useEffect(() => {
    fetchMedicines();
  }, [fetchMedicines]);

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <div className="grid gap-6">
        <Card className="bg-white border border-navy/10 shadow-md h-fit">
          <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-navy">Tambah Obat Baru</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <NewMedicineForm onSuccess={fetchMedicines} />
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md h-fit">
          <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
            <CardTitle className="text-lg font-bold text-navy">Perbarui Stok</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <MedicineForm medicines={medicines} onSuccess={fetchMedicines} />
          </CardContent>
        </Card>
      </div>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-navy">Inventori Obat</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Stok</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy pl-6 py-4">{medicine.nama}</TableCell>
                  <TableCell className="py-4">
                    <span className={medicine.stok < 50 ? "text-red-600 font-semibold" : "text-navy"}>
                      {medicine.stok}
                    </span>
                  </TableCell>
                  <TableCell className="text-navy py-4">{medicine.harga}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
