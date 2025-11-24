
import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";

export function PrescriptionTable({ prescriptions, medicines, onFulfill, disabled }) {
  const [pending, startTransition] = useTransition();

  const getMedicineName = (drugId) => {
    const medicine = medicines.find((m) => m.id === drugId);
    return medicine ? medicine.nama : "Obat tidak ditemukan";
  };
  
  const handleFulfill = (id) => {
    startTransition(() => {
      onFulfill(id);
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resep Masuk</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID Resep</TableHead>
              <TableHead>Obat</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>{getMedicineName(p.drug_id)}</TableCell>
                <TableCell>{p.quantity}</TableCell>
                <TableCell className="capitalize">{p.status}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    disabled={disabled || pending || p.status === "selesai"}
                    onClick={() => handleFulfill(p.id)}
                  >
                    Serahkan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
