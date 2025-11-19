"use client";

import { useTransition } from "react";
import { payments, patients } from "@/lib/mockData";
import { createPayment } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PaymentCard } from "@/components/cards/payment-card";
import { toast } from "sonner";

export default function AdminPaymentPage() {
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createPayment({
          patientId: formData.get("patientId") as string,
          amount: Number(formData.get("amount")),
          method: (formData.get("method") as any) ?? "cash"
        });
        toast.success("Pembayaran berhasil");
      } catch (error: any) {
        toast.error(error.message ?? "Gagal memproses pembayaran");
      }
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Pencatatan Pembayaran</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" action={onSubmit}>
            <div>
              <p className="text-xs uppercase text-slate-400">Pasien</p>
              <select name="patientId" className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm">
                {patients.map((patient) => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Nominal</p>
              <Input name="amount" type="number" placeholder="150000" required />
            </div>
            <div>
              <p className="text-xs uppercase text-slate-400">Metode</p>
              <select name="method" className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm">
                <option value="cash">Tunai</option>
                <option value="transfer">Transfer</option>
                <option value="card">Kartu</option>
              </select>
            </div>
            <Button className="w-full" disabled={pending} type="submit">
              Catat Pembayaran
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {payments.map((payment) => (
            <PaymentCard key={payment.id} payment={payment} />
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
