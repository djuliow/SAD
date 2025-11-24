import { useEffect, useState, useTransition } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "/src/store/useAuthStore";
import { getQueueDetails, listMedicines, createExamination, createPrescription, advanceQueue } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Textarea } from "/src/components/ui/textarea";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { toast } from "sonner";
import { X } from "lucide-react";

export default function PemeriksaanDetailPage() {
  const { id: queueId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, startSubmitting] = useTransition();

  // Data state
  const [patient, setPatient] = useState(null);
  const [history, setHistory] = useState([]);
  const [allMedicines, setAllMedicines] = useState([]);

  // Form state
  const [complaint, setComplaint] = useState("");
  const [diagnosis, setDiagnosis] = useState("");
  const [examinationNotes, setExaminationNotes] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);

  // Prescription sub-form state
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState(""); // Empty default for instructions

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [queueData, medicinesData] = await Promise.all([getQueueDetails(queueId), listMedicines()]);
        setPatient(queueData.patient);
        setHistory(queueData.history);
        setAllMedicines(medicinesData);
      } catch (error) {
        toast.error(error.message ?? "Gagal memuat data pemeriksaan.");
        navigate("/dokter/antrian");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [queueId, navigate]);

  const handleAddMedicine = (e) => {
    e.preventDefault();
    if (!selectedMedicine || quantity <= 0) {
      toast.warning("Pilih obat dan tentukan jumlahnya dengan benar.");
      return;
    }

    const medicineDetails = allMedicines.find((m) => m.id === parseInt(selectedMedicine));
    if (!medicineDetails) {
      toast.error("Obat tidak ditemukan.");
      return;
    }

    if (prescribedMedicines.some(m => m.drug_id === medicineDetails.id)) {
      toast.warning(`${medicineDetails.nama} sudah ada di daftar resep.`);
      return;
    }

    // Check if there's sufficient stock
    if (medicineDetails.stok < quantity) {
      toast.error(`Stok tidak mencukupi. Tersedia: ${medicineDetails.stok}, permintaan: ${quantity}`);
      return;
    }

    setPrescribedMedicines([
      ...prescribedMedicines,
      {
        drug_id: medicineDetails.id,
        drug_name: medicineDetails.nama,
        quantity: parseInt(quantity),
        notes: instructions || "Sesuai anjuran dokter" // Use default if no instructions provided
      },
    ]);
    setSelectedMedicine("");
    setQuantity(1);
    setInstructions("");
    toast.success(`${medicineDetails.nama} ditambahkan ke resep.`);
  };

  const handleRemoveMedicine = (drugId) => {
    const medicine = allMedicines.find(m => m.id === drugId);
    setPrescribedMedicines(prescribedMedicines.filter((m) => m.drug_id !== drugId));
    toast.info(`${medicine?.nama || 'Obat'} dihapus dari resep.`);
  };

  const handleFinishExamination = () => {
    if (!diagnosis) {
      toast.warning("Diagnosis tidak boleh kosong.");
      return;
    }

    startSubmitting(async () => {
      try {
        // Step 1: Create Examination
        const examPayload = { complaint, diagnosis, notes: examinationNotes };
        const newExamination = await createExamination(queueId, user.id, examPayload);
        toast.success("Hasil pemeriksaan tersimpan.");

        // Step 2: Create Prescriptions if any
        if (prescribedMedicines.length > 0) {
          const prescriptionPromises = prescribedMedicines.map((med) =>
            createPrescription(newExamination.id, {
              drug_id: med.drug_id,
              quantity: med.quantity,
              notes: med.notes, // Using the specific instructions for this medicine
            })
          );

          await Promise.all(prescriptionPromises);
          toast.success(`Resep berhasil dibuat untuk ${prescribedMedicines.length} obat.`);
        } else {
          toast.info("Tidak ada obat yang diresepkan.");
        }

        // Step 3: Update queue status to 'apotek' (goes to pharmacy)
        await advanceQueue(queueId, "apotek");
        toast.success("Pemeriksaan selesai, pasien menuju apotek.");

        // Step 4: Navigate back to queue
        navigate("/dokter/antrian");
      } catch (error) {
        toast.error(error.message ?? "Gagal menyelesaikan pemeriksaan.");
      }
    });
  };

  if (isLoading) {
    return <div className="text-center p-12">Memuat data pasien...</div>;
  }

  return (
    <div className="space-y-6">
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Data Pasien</CardTitle>
        </CardHeader>
        <CardContent className="p-6 grid grid-cols-2 gap-4 text-sm text-navy">
          <div><span className="font-semibold">Nama:</span> {patient?.name}</div>
          <div><span className="font-semibold">MRN:</span> {patient?.medicalRecordNo}</div>
          <div><span className="font-semibold">Telepon:</span> {patient?.phone}</div>
          <div><span className="font-semibold">Alamat:</span> {patient?.address}</div>
        </CardContent>
      </Card>
      
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Hasil Pemeriksaan</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
            <div>
              <Label htmlFor="complaint">Keluhan</Label>
              <Textarea id="complaint" value={complaint} onChange={(e) => setComplaint(e.target.value)} placeholder="cth: Demam, pusing, mual..." />
            </div>
            <div>
              <Label htmlFor="diagnosis">Diagnosis</Label>
              <Textarea id="diagnosis" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} placeholder="cth: Demam berdarah" required />
            </div>
            <div>
              <Label htmlFor="examinationNotes">Catatan Pemeriksaan</Label>
              <Textarea id="examinationNotes" value={examinationNotes} onChange={(e) => setExaminationNotes(e.target.value)} placeholder="cth: Perbanyak istirahat dan minum air putih" />
            </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Resep Obat</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Add Medicine Form */}
          <form onSubmit={handleAddMedicine} className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <div className="md:col-span-5">
              <Label>Obat</Label>
              <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)} className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm">
                <option value="" disabled>Pilih obat...</option>
                {allMedicines
                  .filter(m => m.stok > 0) // Only show medicines with available stock
                  .map(m => (
                    <option key={m.id} value={m.id}>
                      {m.nama} (Stok: {m.stok})
                    </option>
                  ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <Label>Jumlah</Label>
              <Input
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
                className="w-full"
                min="1"
              />
            </div>
            <div className="md:col-span-4">
              <Label>Cara Pakai / Instruksi</Label>
              <Input
                type="text"
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Contoh: 3x1 sebelum makan, sesudah makan, dll"
                className="w-full"
              />
            </div>
            <div className="md:col-span-1 flex items-end">
              <Button type="submit" className="w-full">Tambah</Button>
            </div>
          </form>

          {/* Prescribed Medicines List */}
          {prescribedMedicines.length > 0 ? (
            <div>
              <h3 className="font-medium text-navy mb-2">Daftar Obat Diresepkan ({prescribedMedicines.length})</h3>
              <div className="rounded-md border border-navy/10 overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Obat</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Cara Pakai</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {prescribedMedicines.map(med => (
                      <TableRow key={med.drug_id}>
                        <TableCell className="font-medium">{med.drug_name}</TableCell>
                        <TableCell>{med.quantity}</TableCell>
                        <TableCell>{med.notes}</TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMedicine(med.drug_id)}
                            title="Hapus dari resep"
                          >
                            <X className="h-4 w-4 text-red-500" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-slate-500 border-2 border-dashed border-slate-300 rounded-lg">
              Belum ada obat yang diresepkan
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="flex justify-end gap-4">
        <Button variant="outline" onClick={() => navigate("/dokter/antrian")} disabled={isSubmitting}>Batal</Button>
        <Button onClick={handleFinishExamination} disabled={isSubmitting} className="bg-teal hover:bg-teal/90 text-white">
          {isSubmitting ? "Menyimpan..." : "Selesaikan Pemeriksaan"}
        </Button>
      </div>
    </div>
  );
}
