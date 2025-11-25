import { useEffect, useState } from "react";
import { getPatientHistory, updatePrescription } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Badge } from "/src/components/ui/badge";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { toast } from "sonner";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatCurrency } from "/src/lib/utils";

function ExaminationCard({ exam }) {
  const [editingPrescriptionId, setEditingPrescriptionId] = useState(null);
  const [editQuantity, setEditQuantity] = useState(1);
  const [editNotes, setEditNotes] = useState("");

  const handleEditClick = (prescription) => {
    setEditingPrescriptionId(prescription.id);
    setEditQuantity(prescription.quantity);
    setEditNotes(prescription.notes);
  };

  const handleSaveEdit = async (prescription) => {
    if (!editNotes.trim()) {
      toast.warning("Catatan resep tidak boleh kosong");
      return;
    }

    if (editQuantity <= 0) {
      toast.warning("Jumlah harus lebih dari 0");
      return;
    }

    try {
      await updatePrescription(prescription.id, {
        drug_id: prescription.drug_id,
        quantity: parseInt(editQuantity),
        notes: editNotes,
        status: prescription.status
      });
      toast.success("Resep berhasil diperbarui");
      setEditingPrescriptionId(null);
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui resep");
    }
  };

  const handleCancelEdit = () => {
    setEditingPrescriptionId(null);
  };

  return (
    <div className="border border-navy/10 rounded-lg p-4 bg-white">
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-navy">{exam.diagnosis}</p>
          <p className="text-sm text-navy/80">{exam.complaint}</p>
        </div>
        <p className="text-xs text-navy/60 font-medium whitespace-nowrap">
          {format(new Date(exam.date), "dd MMM yyyy", { locale: id })}
        </p>
      </div>
      <p className="text-sm text-navy/60 mt-2">
        <span className="font-semibold">Catatan:</span> {exam.notes || "-"}
      </p>
      {exam.prescriptions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-navy/10">
          <p className="font-semibold text-sm text-navy mb-2">Resep:</p>
          <ul className="list-disc list-inside space-y-2 text-sm text-navy/70">
            {exam.prescriptions.map((p, i) => (
              editingPrescriptionId === p.id ? (
                // Edit mode for prescription
                <li key={i} className="bg-sky-blue/10 p-3 rounded-md border border-navy/20">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{p.drug_name}</span>
                      <Badge variant="outline" className="text-xs">
                        Status: {p.status === 'menunggu' ? 'Menunggu' : p.status === 'selesai' ? 'Selesai' : p.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="text-xs font-medium text-navy/70">Jumlah</label>
                        <Input
                          type="number"
                          value={editQuantity}
                          onChange={(e) => setEditQuantity(parseInt(e.target.value) || 1)}
                          min="1"
                          className="text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-medium text-navy/70">Catatan</label>
                        <Input
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex gap-2 justify-end mt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCancelEdit}
                      >
                        Batal
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleSaveEdit(p)}
                      >
                        Simpan
                      </Button>
                    </div>
                  </div>
                </li>
              ) : (
                // View mode for prescription
                <li key={i} className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="font-medium">{p.drug_name}</span> ({p.quantity} pcs) -
                    <span className="text-xs ml-1">"{p.notes}"</span>
                    <Badge variant="outline" className="ml-2 text-xs h-5">
                      Status: {p.status === 'menunggu' ? 'Menunggu' : p.status === 'selesai' ? 'Selesai' : p.status}
                    </Badge>
                  </div>
                  {p.status !== 'selesai' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditClick(p)}
                      className="h-6 w-6 p-0 ml-2"
                    >
                      ✏️
                    </Button>
                  )}
                </li>
              )
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
    <div className="p-4 space-y-6">
      {/* Patient Info */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-3">Data Diri Pasien</h3>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-navy">
          <p><span className="font-semibold">Nama:</span> {patient_info.name}</p>
          <p><span className="font-semibold">No. RM:</span> {patient_info.medicalRecordNo}</p>
          <p><span className="font-semibold">Tgl. Lahir:</span> {format(new Date(patient_info.dob), "dd MMMM yyyy", { locale: id })}</p>
          <p><span className="font-semibold">Gender:</span> {patient_info.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</p>
          <p><span className="font-semibold">Telepon:</span> {patient_info.phone}</p>
          <p><span className="font-semibold">Alamat:</span> {patient_info.address}</p>
        </div>
      </div>

      {/* Examination History */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-3">Riwayat Pemeriksaan</h3>
        <div className="space-y-3">
          {examinations.length > 0 ? (
            examinations.map((exam) => <ExaminationCard key={exam.id} exam={exam} />)
          ) : (
            <p className="text-sm text-navy/70 text-center py-4">Belum ada riwayat pemeriksaan.</p>
          )}
        </div>
      </div>

      {/* Payment History */}
      <div>
        <h3 className="text-lg font-bold text-navy mb-3">Riwayat Pembayaran</h3>
        <div className="space-y-3">
          {payments.length > 0 ? (
            payments.map((p) => (
              <div key={p.id} className="border border-navy/10 rounded-lg p-3 flex justify-between items-center bg-white">
                <div>
                  <p className="font-semibold text-navy">{formatCurrency(p.total_amount)}</p>
                  <p className="text-xs text-navy/60">Metode: {p.method}</p>
                </div>
                <p className="text-xs text-navy/60">{format(new Date(p.payment_date), "dd MMM yyyy, HH:mm", { locale: id })}</p>
              </div>
            ))
          ) : (
            <p className="text-sm text-navy/70 text-center py-4">Belum ada riwayat pembayaran.</p>
          )}
        </div>
      </div>
    </div>
  );
}