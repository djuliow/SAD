
import { useTransition } from "react";
import { payments, patients } from "/src/lib/mockData";
import { createPayment } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { PaymentCard } from "/src/components/cards/payment-card";
import { toast } from "sonner";

export default function AdminPaymentPage() {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      try {
        await createPayment({
          patientId: formData.get("patientId"),
          amount: Number(formData.get("amount")),
          method: formData.get("method") ?? "cash"
        });
        toast.success("Pembayaran berhasil");
      } catch (error) {
        toast.error(error.message ?? "Gagal memproses pembayaran");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card className="bg-white border border-navy/10 shadow-md h-fit">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Pencatatan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <p className="text-xs uppercase text-slate-600 font-medium mb-2">Pasien</p>
              <select name="patientId" className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors shadow-sm text-navy">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-600 font-medium mb-2">Nominal</p>
              <Input name="amount" type="number" placeholder="150000" required />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-600 font-medium mb-1">Metode</p>
              <select name="method" className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors shadow-sm text-navy">
                <option value="cash">Tunai</option>
                <option value="transfer">Transfer</option>
                <option value="card">Kartu</option>
              </select>
            </div>
            <Button className="w-full bg-teal hover:bg-teal/90 text-white shadow-sm" disabled={pending} type="submit">
              Catat Pembayaran
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
        <div className="rounded-md border border-navy/10 p-4 space-y-3">
          {payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
