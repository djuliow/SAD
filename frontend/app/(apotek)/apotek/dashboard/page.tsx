import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { medicines } from "@/lib/mockData";

export default function ApotekDashboardPage() {
  const lowStock = medicines.filter((med) => med.stock < 50);
  const pendingPrescriptions = 4;

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Resep Menunggu</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-semibold text-slate-900">{pendingPrescriptions}</p>
          <p className="text-sm text-slate-500">Resep siap diracik</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Stok Rendah</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-slate-600">
          {lowStock.map((med) => (
            <p key={med.id}>
              {med.name} - <span className="text-red-500">{med.stock} {med.unit}</span>
            </p>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
