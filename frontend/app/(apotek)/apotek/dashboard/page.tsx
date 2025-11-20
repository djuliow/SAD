import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicines } from "@/lib/mockData";

export default function ApotekDashboardPage() {
  const lowStock = medicines.filter((med) => med.stock < 50);
  const pendingPrescriptions = 4;

  return (
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
          {lowStock.map((med) => (
            <div key={med.id} className="flex items-center justify-between rounded-lg bg-red-50 px-3 py-2 border border-red-200/50 hover:shadow-md transition-all">
              <span className="font-medium">{med.name}</span>
              <span className="font-bold text-red-600">{med.stock} {med.unit}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
