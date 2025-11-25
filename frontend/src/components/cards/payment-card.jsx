import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "/src/lib/utils";
import { Badge } from "/src/components/ui/badge";

export function PaymentCard({ payment }) {
  return (
    <div className="rounded-xl border border-navy/10 bg-sky-blue/50 p-4 shadow-sm hover:bg-sky-blue/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-base font-semibold text-navy">{payment.patient_name}</p>
          <p className="text-sm text-slate-500">{format(new Date(payment.payment_date), "dd MMM yyyy HH:mm", { locale: id })}</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(payment.total_amount)}</p>
        </div>
        <Badge variant="success" className="capitalize">{payment.status}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-500">Metode: {payment.method}</p>

      {payment.details && payment.details.length > 0 && (
        <div className="mt-4 pt-4 border-t border-navy/10">
          <div className="space-y-2">
            <h4 className="font-semibold text-navy text-sm">Rincian Pembayaran</h4>
            <div className="text-xs text-slate-600 space-y-1">
              <div className="flex justify-between">
                <span>Biaya Pemeriksaan</span>
                <span>{formatCurrency(payment.examination_fee)}</span>
              </div>
              {payment.details.map((item, index) => (
                <div key={index} className="flex justify-between pl-4">
                  <span>
                    {item.drug_name} ({item.quantity} pcs)
                  </span>
                  <span>{formatCurrency(item.total_cost)}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between font-semibold text-navy border-t border-navy/10 pt-2 mt-2">
              <span>Total</span>
              <span>{formatCurrency(payment.total_amount)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
