import { useState, useEffect, useCallback } from "react";
import { MedicineForm } from "/src/components/forms/medicine-form";
import { NewMedicineForm } from "/src/components/forms/new-medicine-form";
import { EditMedicineForm } from "/src/components/forms/edit-medicine-form";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listMedicines } from "/src/api/api.js";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "/src/components/ui/dialog";
import { Button } from "/src/components/ui/button";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

export default function ApotekStockPage() {
  const [medicines, setMedicines] = useState([]);
  const [selectedMedicineId, setSelectedMedicineId] = useState(null);
  const [editingMedicine, setEditingMedicine] = useState(null);

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

  const handleEditClick = (e, medicine) => {
    e.stopPropagation(); // Prevent row click
    setEditingMedicine(medicine);
  };

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
            <MedicineForm 
              medicines={medicines} 
              selectedMedicineId={selectedMedicineId}
              onSuccess={fetchMedicines} 
            />
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
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {medicines.map((medicine) => (
                <TableRow 
                  key={medicine.id} 
                  className={`cursor-pointer transition-colors ${
                    selectedMedicineId === String(medicine.id) 
                      ? "bg-teal/20 hover:bg-teal/30" 
                      : "hover:bg-sky-blue/30"
                  }`}
                  onClick={() => setSelectedMedicineId(String(medicine.id))}
                >
                  <TableCell className="font-medium text-navy pl-6 py-4">{medicine.nama}</TableCell>
                  <TableCell className="py-4">
                    <span className={medicine.stok < 50 ? "text-red-600 font-semibold" : "text-navy"}>
                      {medicine.stok}
                    </span>
                  </TableCell>
                  <TableCell className="text-navy py-4">Rp {medicine.harga.toLocaleString()}</TableCell>
                  <TableCell className="py-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-navy/60 hover:text-navy hover:bg-navy/10"
                      onClick={(e) => handleEditClick(e, medicine)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={!!editingMedicine} onOpenChange={(open) => !open && setEditingMedicine(null)}>
        <DialogContent className="sm:max-w-[425px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-navy">Edit Data Obat</DialogTitle>
          </DialogHeader>
          {editingMedicine && (
            <EditMedicineForm 
              medicine={editingMedicine} 
              onSuccess={() => {
                fetchMedicines();
                setEditingMedicine(null);
              }}
              onCancel={() => setEditingMedicine(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
