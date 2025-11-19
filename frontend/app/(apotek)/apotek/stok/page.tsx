import { MedicineForm } from "@/components/forms/medicine-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicines } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ApotekStockPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Perbarui Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicineForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Inventori Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Stok</TableHead>
                <TableHead>Kategori</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id}>
                  <TableCell>{medicine.name}</TableCell>
                  <TableCell>{medicine.stock} {medicine.unit}</TableCell>
                  <TableCell>{medicine.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
