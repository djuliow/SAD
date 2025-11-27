import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { formatCurrency } from "/src/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";

export function ReportViewer({ report }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Card className="bg-white border border-navy/10 shadow-sm overflow-hidden">
      <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-navy">Laporan {report.type === "DAILY" ? "Harian" : "Bulanan"}</CardTitle>
        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-navy hover:bg-navy/5 flex items-center gap-1"
        >
          {isExpanded ? "Tutup" : "Rincian"}
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 transition-transform duration-300 ease-in-out" />
          ) : (
            <ChevronDown className="h-4 w-4 transition-transform duration-300 ease-in-out" />
          )}
        </Button>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-navy p-6">
        <p>Periode: {report.period}</p>
        <p>Total Pasien: {report.totalPatients}</p>
        <p>Total Resep: {report.prescriptions}</p>
        <p>Pendapatan: {formatCurrency(report.totalIncome)}</p>

        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-navy/10">
            <h4 className="font-semibold text-navy mb-2">Rincian Pembayaran</h4>
            {report.payments && report.payments.length > 0 ? (
              <div className="space-y-2">
                {report.payments.map((payment, index) => (
                  <div key={index} className="text-xs text-slate-600 space-y-1">
                    <div className="flex justify-between">
                      <span>ID Pembayaran: #{payment.id}</span>
                      <span>{formatCurrency(payment.total_amount)}</span>
                    </div>
                    <p className="text-slate-500 ml-4">Pasien: {payment.patient_name}</p>
                    <div className="flex justify-between ml-4">
                      <span className="capitalize">Metode: {payment.method}</span>
                      <span className="capitalize">Status: {payment.status}</span>
                    </div>
                    {payment.details && payment.details.length > 0 && (
                      <div className="ml-4 space-y-1">
                        <p className="text-slate-700 font-medium text-xs">Rincian Barang:</p>
                        {payment.details.map((item, itemIndex) => (
                          <div key={itemIndex} className="flex justify-between pl-4 text-slate-600">
                            <span>
                              {item.drug_name} ({item.quantity} pcs)
                            </span>
                            <span>{formatCurrency(item.total_cost)}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-slate-500 text-xs italic">Tidak ada rincian pembayaran tersedia</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
