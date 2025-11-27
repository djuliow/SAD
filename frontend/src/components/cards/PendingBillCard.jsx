import { useState, useTransition } from "react";
import { formatCurrency } from "/src/lib/utils";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { createPayment } from "/src/api/api.js";

export function PendingBillCard({ bill, onPaymentSuccess }) {
  const [isPaying, startTransition] = useTransition();
  const [isExpanded, setIsExpanded] = useState(false);
  const [method, setMethod] = useState("Tunai");

  const handlePayment = () => {
    startTransition(async () => {
      try {
        await createPayment({
          patient_id: bill.patient_id,
          examination_id: bill.examination_id,
          drug_cost: bill.drug_cost,
          examination_fee: bill.examination_fee,
          method: method,
        });
        toast.success(`Pembayaran untuk ${bill.patient_name} berhasil.`);
        if (onPaymentSuccess) {
          onPaymentSuccess();
        }
      } catch (error) {
        toast.error(error.message ?? "Gagal memproses pembayaran");
      }
    });
  };

  return (
    <div className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-navy">{bill.patient_name}</p>
          <p className="text-lg font-bold text-teal">{formatCurrency(bill.total_amount)}</p>
        </div>
        <div className="flex items-center gap-2">
           <Button
            size="sm"
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-navy hover:bg-navy/5 flex items-center gap-1"
          >
            {isExpanded ? "Tutup" : "Rincian"}
            <span className={`transition-transform duration-300 ease-in-out ${isExpanded ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </Button>
          <Button
            size="sm"
            className="bg-teal hover:bg-teal/90 text-white"
            disabled={isPaying}
            onClick={handlePayment}
          >
            {isPaying ? "Memproses..." : "Bayar"}
          </Button>
        </div>
      </div>
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-navy/10 space-y-4">
          <div>
            <h4 className="font-semibold text-navy mb-2">Rincian Biaya</h4>
            <div className="space-y-1 text-sm text-slate-600">
              <div className="flex justify-between">
                <p>Biaya Pemeriksaan</p>
                <p>{formatCurrency(bill.examination_fee)}</p>
              </div>
              {bill.details.map((item, index) => (
                <div key={index} className="flex justify-between">
                  <p>
                    {item.drug_name} ({item.quantity} {item.unit ?? "pcs"})
                  </p>
                  <p>{formatCurrency(item.total_cost)}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-navy mt-2 pt-2 border-t border-navy/10">
              <p>Total</p>
              <p>{formatCurrency(bill.total_amount)}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-navy mb-2">Metode Pembayaran</h4>
            <select value={method} onChange={(e) => setMethod(e.target.value)} className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm">
              <option value="Tunai">Tunai</option>
              <option value="Kartu">Kartu</option>
              <option value="Transfer">Transfer</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
