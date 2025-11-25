import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { getAdminDashboardSummary, listPaymentsByDate, listAllPayments } from "/src/api/api.js";
import { formatCurrency } from "/src/lib/utils";
import { toast } from "sonner";
import { Calendar, Download, Filter } from "lucide-react";

export default function KepalaFinancialReportPage() {
  const [summary, setSummary] = useState(null);
  const [dailyPayments, setDailyPayments] = useState([]);
  const [monthlyPayments, setMonthlyPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().substring(0, 7));
  const [currentView, setCurrentView] = useState('daily'); // 'daily' or 'monthly'

  // Fetch dashboard summary for today's income
  const fetchDashboardSummary = async () => {
    try {
      const data = await getAdminDashboardSummary();
      setSummary(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat ringkasan dashboard");
    }
  };

  // Fetch daily payments
  const fetchDailyPayments = async (date) => {
    try {
      const payments = await listPaymentsByDate(date);
      setDailyPayments(payments);
    } catch (error) {
      toast.error("Gagal memuat data pembayaran harian");
    }
  };

  // Fetch monthly payments
  const fetchMonthlyPayments = async (month) => {
    try {
      const allPayments = await listAllPayments();
      // Filter payments for the selected month
      const monthStart = new Date(`${month}-01`);
      const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
      
      const monthlyData = allPayments.filter(payment => {
        const paymentDate = new Date(payment.payment_date);
        return paymentDate >= monthStart && paymentDate <= monthEnd;
      });
      
      setMonthlyPayments(monthlyData);
    } catch (error) {
      toast.error("Gagal memuat data pembayaran bulanan");
    }
  };

  // Load data when component mounts
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchDashboardSummary();
      await fetchDailyPayments(selectedDate);
      await fetchMonthlyPayments(selectedMonth);
      setLoading(false);
    };
    
    loadData();
  }, []);

  // Fetch data when date/month changes
  useEffect(() => {
    if (!loading) {
      fetchDailyPayments(selectedDate);
    }
  }, [selectedDate]);

  useEffect(() => {
    if (!loading) {
      fetchMonthlyPayments(selectedMonth);
    }
  }, [selectedMonth]);

  // Calculate totals
  const dailyTotal = dailyPayments.reduce((sum, payment) => sum + payment.total_amount, 0);
  const monthlyTotal = monthlyPayments.reduce((sum, payment) => sum + payment.total_amount, 0);
  
  // Calculate daily patient count
  const dailyPatientCount = [...new Set(dailyPayments.map(p => p.patient_id))].length;
  const monthlyPatientCount = [...new Set(monthlyPayments.map(p => p.patient_id))].length;

  const handleRefresh = () => {
    if (currentView === 'daily') {
      fetchDailyPayments(selectedDate);
    } else {
      fetchMonthlyPayments(selectedMonth);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Pemasukan Hari Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {summary ? formatCurrency(summary.income_today) : "Rp 0,00"}
            </div>
            <p className="text-xs text-navy/70">dari semua pembayaran</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Pemasukan Periode Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {currentView === 'daily' ? formatCurrency(dailyTotal) : formatCurrency(monthlyTotal)}
            </div>
            <p className="text-xs text-navy/70">
              {currentView === 'daily' ? `untuk ${format(new Date(selectedDate), "dd MMM yyyy", { locale: id })}` : `untuk ${format(new Date(`${selectedMonth}-01`), "MMMM yyyy", { locale: id })}`}
            </p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Jumlah Pasien Harian</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">{summary?.patients_today_count || 0}</div>
            <p className="text-xs text-navy/70">pasien hari ini</p>
          </CardContent>
        </Card>
        <Card className="bg-white border border-navy/10 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-navy">Jumlah Pasien Periode Ini</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-navy">
              {currentView === 'daily' ? dailyPatientCount : monthlyPatientCount}
            </div>
            <p className="text-xs text-navy/70">
              {currentView === 'daily' ? 'hari ini' : 'bulan ini'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* View Toggle and Filters */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-navy">Laporan Keuangan {currentView === 'daily' ? 'Harian' : 'Bulanan'}</CardTitle>
            <p className="text-xs text-navy/70">Data pembayaran {currentView === 'daily' ? 'harian' : 'bulanan'} klinik.</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant={currentView === 'daily' ? 'default' : 'outline'}
              onClick={() => setCurrentView('daily')}
              className={currentView === 'daily' ? 'bg-teal hover:bg-teal/90 text-white' : 'text-navy'}
            >
              Harian
            </Button>
            <Button
              variant={currentView === 'monthly' ? 'default' : 'outline'}
              onClick={() => setCurrentView('monthly')}
              className={currentView === 'monthly' ? 'bg-teal hover:bg-teal/90 text-white' : 'text-navy'}
            >
              Bulanan
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap items-end gap-3 mb-6">
            {currentView === 'daily' ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-navy font-medium">Tanggal</Label>
                  <Input
                    type="date"
                    id="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-[200px]"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedDate(new Date().toISOString().split('T')[0])}
                  className="border-navy/20 hover:bg-navy/5"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Hari Ini
                </Button>
              </>
            ) : (
              <>
                <div className="space-y-2">
                  <Label htmlFor="month" className="text-navy font-medium">Bulan</Label>
                  <Input
                    type="month"
                    id="month"
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="w-[180px]"
                  />
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setSelectedMonth(new Date().toISOString().substring(0, 7))}
                  className="border-navy/20 hover:bg-navy/5"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Bulan Ini
                </Button>
              </>
            )}
            <Button 
              onClick={handleRefresh} 
              className="flex items-center gap-2 bg-teal hover:bg-teal/90 text-white"
            >
              <Filter className="h-4 w-4" />
              Refresh
            </Button>
          </div>

          <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">ID Pembayaran</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama Pasien</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Tanggal</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Jumlah</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Metode</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Status</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                  </TableRow>
                ) : (currentView === 'daily' ? dailyPayments : monthlyPayments).length > 0 ? (
                  (currentView === 'daily' ? dailyPayments : monthlyPayments).map((payment) => (
                    <>
                      <TableRow key={`payment-${payment.id}`} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                        <TableCell className="font-medium text-navy pl-6 py-4">#{payment.id}</TableCell>
                        <TableCell className="text-navy py-4">{payment.patient_name}</TableCell>
                        <TableCell className="text-navy py-4">
                          {format(new Date(payment.payment_date), "dd MMM yyyy, HH:mm", { locale: id })}
                        </TableCell>
                        <TableCell className="text-navy py-4 font-semibold text-green-600">{formatCurrency(payment.total_amount)}</TableCell>
                        <TableCell className="text-navy py-4 capitalize">{payment.method}</TableCell>
                        <TableCell className="text-navy py-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            payment.status === 'completed' ? 'bg-green-100 text-green-800' :
                            payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {payment.status === 'completed' ? 'Lunas' :
                             payment.status === 'pending' ? 'Pending' :
                             payment.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-navy py-4 text-right">
                          {payment.details && payment.details.length > 0 ? (
                            <button
                              onClick={() => {
                                const detail = document.getElementById(`payment-detail-${payment.id}`);
                                if (detail) {
                                  detail.classList.toggle('hidden');
                                }
                              }}
                              className="text-xs text-teal hover:text-teal/80"
                            >
                              ▼
                            </button>
                          ) : (
                            <span className="text-xs text-slate-400">-</span>
                          )}
                        </TableCell>
                      </TableRow>
                      {payment.details && payment.details.length > 0 && (
                        <TableRow id={`payment-detail-${payment.id}`} className="hidden bg-sky-blue/10 border-navy/10">
                          <TableCell colSpan="7" className="p-4 text-sm">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-navy">Rincian Pembayaran</h4>
                              <div className="text-slate-600 space-y-1">
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
                          </TableCell>
                        </TableRow>
                      )}
                    </>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-navy/70">
                      Tidak ada data pembayaran {currentView === 'daily' ? 'pada tanggal ini' : 'pada bulan ini'}.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Download Section */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-navy">Ekspor Laporan</CardTitle>
          <p className="text-xs text-navy/70">Unduh laporan dalam format yang Anda inginkan.</p>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4">
            <Button className="flex items-center gap-2 bg-teal hover:bg-teal/90 text-white">
              <Download className="h-4 w-4" />
              Ekspor ke Excel
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Ekspor ke PDF
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Ekspor ke CSV
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}