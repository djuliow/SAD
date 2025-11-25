
import { useState, useEffect, useCallback } from "react";
import { listPrescriptions, listMedicines, fulfillPrescription, fulfillAllPrescriptions, getPendingPatientsForApotek, getApotekQueue } from "/src/api/api.js";
import { PrescriptionTable } from "/src/components/tables/prescription-table";
import { toast } from "sonner";

export default function ApotekPrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [apotekQueue, setApotekQueue] = useState([]); // Patients at pharmacy
  const [loading, setLoading] = useState(false);
  const [patientsWithPendingPrescriptions, setPatientsWithPendingPrescriptions] = useState([]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionsData, medicinesData, patientsData, queueData] = await Promise.all([
        listPrescriptions("menunggu"), // Fetch only pending prescriptions
        listMedicines(),
        getPendingPatientsForApotek(), // Fetch patients with pending prescriptions
        getApotekQueue() // Fetch patients currently at pharmacy
      ]);
      setPrescriptions(prescriptionsData);
      setMedicines(medicinesData);
      setPatientsWithPendingPrescriptions(patientsData);
      setApotekQueue(queueData);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleFulfill = async (id) => {
    try {
      await fulfillPrescription(id);
      toast.success("Resep berhasil diserahkan");
      fetchData(); // Refetch data after fulfilling
    } catch (error) {
      toast.error(error.message ?? "Gagal menyerahkan resep");
    }
  };

  const handleFulfillAll = async (examinationId) => {
    try {
      await fulfillAllPrescriptions(examinationId);
      toast.success("Semua resep berhasil diserahkan");
      fetchData(); // Refetch data after fulfilling
    } catch (error) {
      toast.error(error.message ?? "Gagal menyerahkan semua resep");
    }
  };

  return (
    <div className="space-y-6">
      {/* Apotek Queue Card */}
      <div className="bg-white border border-navy/10 shadow-md rounded-xl overflow-hidden">
        <div className="bg-beige border-b border-navy/10 rounded-t-xl p-4">
          <h2 className="text-lg font-bold text-navy">Antrian Apotek</h2>
        </div>
        <div className="p-6 pt-4">
          {apotekQueue.length > 0 ? (
            <div className="space-y-2">
              {apotekQueue.map((queue) => (
                <div key={queue.id} className="flex justify-between items-center p-3 bg-sky-blue/30 rounded border border-navy/10">
                  <div>
                    <p className="font-medium text-navy">{queue.patient_name}</p>
                    <p className="text-sm text-navy/70">MRN: {queue.medicalRecordNo}</p>
                  </div>
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Apotek
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-navy/70 text-center py-4">Tidak ada pasien di apotek saat ini</p>
          )}
        </div>
      </div>

      {/* Prescription Table */}
      <PrescriptionTable
        prescriptions={prescriptions}
        medicines={medicines}
        onFulfill={handleFulfill}
        onFulfillAll={handleFulfillAll}
        disabled={loading}
        patients={patientsWithPendingPrescriptions}
      />
    </div>
  );
}
