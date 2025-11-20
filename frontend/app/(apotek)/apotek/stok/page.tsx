import { MedicineForm } from "@/components/forms/medicine-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicines } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function ApotekStockPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Perbarui Stok</CardTitle>
        </CardHeader>
        <CardContent>
          <MedicineForm />
        </CardContent>
      </Card>
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
                <TableHead className="text-navy font-bold">Kategori</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow key={medicine.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy">{medicine.name}</TableCell>
                  <TableCell>
                    <span className={medicine.stock < 50 ? "text-red-600 font-semibold" : "text-navy"}>
                      {medicine.stock} {medicine.unit}
                    </span>
                  </TableCell>
                  <TableCell className="text-navy">{medicine.category}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
