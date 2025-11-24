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
  const [notes, setNotes] = useState("");
  const [prescribedMedicines, setPrescribedMedicines] = useState([]);

  // Prescription sub-form state
  const [selectedMedicine, setSelectedMedicine] = useState("");
  const [quantity, setQuantity] = useState(1);

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
      toast.warning("Pilih obat dan tentukan jumlahnya.");
      return;
    }
    const medicineDetails = allMedicines.find((m) => m.id === parseInt(selectedMedicine));
    if (prescribedMedicines.some(m => m.drug_id === medicineDetails.id)) {
      toast.warning(`${medicineDetails.nama} sudah ada di resep.`);
      return;
    }
    setPrescribedMedicines([
      ...prescribedMedicines,
      { drug_id: medicineDetails.id, drug_name: medicineDetails.nama, quantity: parseInt(quantity) },
    ]);
    setSelectedMedicine("");
    setQuantity(1);
  };
  
  const handleRemoveMedicine = (drugId) => {
    setPrescribedMedicines(prescribedMedicines.filter((m) => m.drug_id !== drugId));
  };

  const handleFinishExamination = () => {
    if (!diagnosis) {
      toast.warning("Diagnosis tidak boleh kosong.");
      return;
    }
    
    startSubmitting(async () => {
      try {
        // Step 1: Create Examination
        const examPayload = { complaint, diagnosis, notes };
        const newExamination = await createExamination(queueId, user.id, examPayload);
        toast.success("Hasil pemeriksaan tersimpan.");

        // Step 2: Create Prescriptions if any
        if (prescribedMedicines.length > 0) {
          await Promise.all(
            prescribedMedicines.map((med) =>
              createPrescription(newExamination.id, {
                drug_id: med.drug_id,
                quantity: med.quantity,
                notes: "Sesuai anjuran dokter",
              })
            )
          );
          toast.success("Resep berhasil dibuat.");
        }

        // Step 3: Update queue status
        await advanceQueue(queueId, "selesai");
        toast.success("Pemeriksaan selesai.");

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
              <Label htmlFor="notes">Catatan Tambahan</Label>
              <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="cth: Perbanyak istirahat dan minum air putih" />
            </div>
        </CardContent>
      </Card>

      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Resep Obat</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <form onSubmit={handleAddMedicine} className="flex items-end gap-4">
            <div className="flex-grow">
              <Label>Obat</Label>
              <select value={selectedMedicine} onChange={(e) => setSelectedMedicine(e.target.value)} className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm">
                <option value="" disabled>Pilih obat...</option>
                {allMedicines.map(m => <option key={m.id} value={m.id}>{m.nama}</option>)}
              </select>
            </div>
            <div>
              <Label>Jumlah</Label>
              <Input type="number" value={quantity} onChange={(e) => setQuantity(e.target.value)} className="w-24" min="1" />
            </div>
            <Button type="submit">Tambah</Button>
          </form>
          {prescribedMedicines.length > 0 && (
            <div className="rounded-md border border-navy/10 overflow-hidden">
              <Table>
                <TableHeader><TableRow><TableHead>Obat</TableHead><TableHead>Jumlah</TableHead><TableHead></TableHead></TableRow></TableHeader>
                <TableBody>
                  {prescribedMedicines.map(med => (
                    <TableRow key={med.drug_id}>
                      <TableCell>{med.drug_name}</TableCell>
                      <TableCell>{med.quantity}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => handleRemoveMedicine(med.drug_id)}><X className="h-4 w-4 text-red-500" /></Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
