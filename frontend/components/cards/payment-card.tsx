import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Payment } from "@/types";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export function PaymentCard({ payment }: { payment: Payment }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
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
