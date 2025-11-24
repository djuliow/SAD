import { useEffect, useState } from "react";
import { getPatientHistory } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "/src/lib/utils";

function ExaminationCard({ exam }) {
  return (
    <div className="border border-navy/10 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-navy">{exam.diagnosis}</p>
          <p className="text-sm text-slate-600">{exam.complaint}</p>
        </div>
        <p className="text-xs text-slate-500 font-medium whitespace-nowrap">
          {format(new Date(exam.date), "dd MMM yyyy", { locale: id })}
        </p>
      </div>
      <p className="text-sm text-slate-500 mt-2">
        <span className="font-semibold">Catatan:</span> {exam.notes || "-"}
      </p>
      {exam.prescriptions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-navy/10">
          <p className="font-semibold text-sm text-navy mb-2">Resep:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
            {exam.prescriptions.map((p, i) => (
              <li key={i}>
                {p.drug_name} ({p.quantity} pcs) - <span className="text-xs">"{p.notes}"</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export function PatientHistoryViewer({ patientId }) {
  const [history, setHistory] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!patientId) return;
    const fetchHistory = async () => {
      setIsLoading(true);
      try {
        const data = await getPatientHistory(patientId);
        setHistory(data);
      } catch (error) {
        toast.error(error.message ?? `Gagal memuat riwayat pasien ${patientId}`);
        setHistory(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchHistory();
  }, [patientId]);

  if (isLoading) {
    return <div className="text-center p-8">Memuat riwayat pasien...</div>;
  }

  if (!history) {
    return <div className="text-center p-8">Gagal memuat riwayat atau pasien tidak ditemukan.</div>;
  }

  const { patient_info, examinations, payments } = history;

  return (
    <div className="space-y-6">
      {/* Patient Info */}
      <Card>
        <CardHeader>
          <CardTitle>Data Diri Pasien</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
          <p><span className="font-semibold">Nama:</span> {patient_info.name}</p>
          <p><span className="font-semibold">No. RM:</span> {patient_info.medicalRecordNo}</p>
          <p><span className="font-semibold">Tgl. Lahir:</span> {format(new Date(patient_info.dob), "dd MMMM yyyy", { locale: id })}</p>
          <p><span className="font-semibold">Gender:</span> {patient_info.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
          <p><span className="font-semibold">Telepon:</span> {patient_info.phone}</p>
          <p><span className="font-semibold">Alamat:</span> {patient_info.address}</p>
        </CardContent>
      </Card>

      {/* Examination History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {examinations.length > 0 ? (
            examinations.map((exam) => <ExaminationCard key={exam.id} exam={exam} />)
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Belum ada riwayat pemeriksaan.</p>
          )}
        </CardContent>
      </Card>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pembayaran</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div key={p.id} className="border border-navy/10 rounded-lg p-3 flex justify-between items-center bg-white">
                <div>
                  <p className="font-semibold">{formatCurrency(p.total_amount)}</p>
                  <p className="text-xs text-slate-500">Metode: {p.method}</p>
                </div>
                <p className="text-xs text-slate-500">{format(new Date(p.payment_date), "dd MMM yyyy, HH:mm", { locale: id })}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-slate-500 text-center py-4">Belum ada riwayat pembayaran.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}