import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listPrescriptions, listMedicines } from "/src/api/api.js";
import { toast } from "sonner";

export default function ApotekDashboardPage() {
  const [lowStock, setLowStock] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [pendingPrescriptions, setPendingPrescriptions] = useState(0);

  const fetchData = async () => {
    try {
      // Fetch prescriptions that have not been fulfilled (sent_to_pharmacy = false)
      const prescriptions = await listPrescriptions("menunggu");
      setPendingPrescriptions(prescriptions.length);

      // Fetch all medicines and filter for low stock
      const medicinesData = await listMedicines();
      setMedicines(medicinesData);
      setLowStock(medicinesData.filter((med) => med.stok < 50));
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data dashboard");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-l-4 border-l-teal">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Resep Menunggu</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold text-teal">{pendingPrescriptions}</p>
            <p className="text-sm text-navy/70 mt-1 font-medium">Resep siap diracik</p>
          </CardContent>
        </Card>
        <Card className="border-l-4 border-l-teal">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Stok Rendah</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-navy">
            {lowStock.length > 0 ? (
              lowStock.map((med) => (
                <div key={med.id} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 border border-red-200/50 hover:shadow-md transition-all">
                  <span className="font-medium">{med.nama}</span>
                  <span className="font-bold text-red-600">{med.stok}</span>
                </div>
              ))
            ) : (
              <p className="text-sm text-navy/70">Tidak ada stok obat yang rendah.</p>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-bold">Inventori Obat</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border border-navy/10 overflow-hidden">
            <table className="w-full text-sm text-left">
              <thead className="bg-beige text-navy font-bold uppercase text-xs">
                <tr>
                  <th className="px-4 py-3">Nama Obat</th>
                  <th className="px-4 py-3">Stok</th>
                  <th className="px-4 py-3">Harga</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-navy/5">
                {medicines.length > 0 ? (
                  medicines.map((med) => (
                    <tr key={med.id} className="hover:bg-sky-blue/20 transition-colors">
                      <td className="px-4 py-3 font-medium text-navy">{med.nama}</td>
                      <td className="px-4 py-3 text-navy">{med.stok}</td>
                      <td className="px-4 py-3 text-navy">Rp {med.harga.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-4 py-8 text-center text-slate-500">
                      Tidak ada data obat.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
