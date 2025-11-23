import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "/src/lib/utils";
import { Badge } from "/src/components/ui/badge";

export function PaymentCard({ payment }) {
  return (
    <div className="rounded-xl border border-navy/10 bg-sky-blue/50 p-4 shadow-sm hover:bg-sky-blue/30 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{format(new Date(payment.createdAt), "dd MMM yyyy HH:mm", { locale: id })}</p>
          <p className="text-lg font-semibold text-slate-900">{formatCurrency(payment.amount)}</p>
        </div>
        <Badge variant="success">{payment.status}</Badge>
      </div>
      <p className="mt-2 text-sm text-slate-500">Metode: {payment.method}</p>
    </div>
  );
}
