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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Tambah Obat Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <NewMedicineForm onSuccess={fetchMedicines} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Perbarui Stok</CardTitle>
          </CardHeader>
          <CardContent>
            <MedicineForm medicines={medicines} onSuccess={fetchMedicines} />
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Inventori Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-beige">
                <TableHead className="text-navy font-bold">Nama</TableHead>
                <TableHead className="text-navy font-bold">Stok</TableHead>
                <TableHead className="text-navy font-bold">Harga</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy">{medicine.nama}</TableCell>
                  <TableCell>
                    <span className={medicine.stok < 50 ? "text-red-600 font-semibold" : "text-navy"}>
                      {medicine.stok}
                    </span>
                  </TableCell>
                  <TableCell className="text-navy">{medicine.harga}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
