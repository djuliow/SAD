import { useEffect, useState, useTransition, useCallback } from "react";
import { listPendingBills, listAllPayments } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";
import { PendingBillCard } from "/src/components/cards/PendingBillCard";
import { PaymentCard } from "/src/components/cards/payment-card"; // Assuming this component exists
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function AdminPaymentPage() {
  const [pendingBills, setPendingBills] = useState([]);
  const [paidBills, setPaidBills] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, startRefresh] = useTransition();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    try {
      const [pendingData, paidData] = await Promise.all([
        listPendingBills(),
        listAllPayments(),
      ]);
      setPendingBills(pendingData);
      // Sort paid bills, newest first
      setPaidBills(paidData.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date)));
    } catch (error) {
      toast.error(error.message ?? "Gagal mengambil data pembayaran");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    startRefresh(async () => {
      await fetchData();
    });
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Pending Bills Section */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
          <CardTitle className="text-lg font-bold text-navy">Tagihan Tertunda</CardTitle>
          <Button
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing || isLoading}
            className="bg-teal hover:bg-teal/90 text-white flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing || isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </Button>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-slate-500 py-10">Memuat tagihan...</p>
          ) : pendingBills.length > 0 ? (
            pendingBills.map((bill) => (
              <PendingBillCard
                key={bill.examination_id}
                bill={bill}
                onPaymentSuccess={handleRefresh}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold text-slate-800">Tidak ada tagihan tertunda</h3>
              <p className="text-slate-500 mt-2">Semua pembayaran sudah lunas.</p>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Payment History Section */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {isLoading ? (
            <p className="text-center text-slate-500 py-10">Memuat riwayat...</p>
          ) : paidBills.length > 0 ? (
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {paidBills.map((payment) => (
                <PaymentCard key={payment.id} payment={payment} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10">
              <h3 className="text-lg font-semibold text-slate-800">Belum ada riwayat pembayaran</h3>
              <p className="text-slate-500 mt-2">Belum ada transaksi yang selesai.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
