
import { useState, useEffect, useCallback } from "react";
import { listPrescriptions, listMedicines, fulfillPrescription } from "/src/api/api.js";
import { PrescriptionTable } from "/src/components/tables/prescription-table";
import { toast } from "sonner";

export default function ApotekPrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [prescriptionsData, medicinesData] = await Promise.all([
        listPrescriptions(), // Fetch all prescriptions
        listMedicines(),
      ]);
      setPrescriptions(prescriptionsData);
      setMedicines(medicinesData);
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

  return (
    <PrescriptionTable
      prescriptions={prescriptions}
      medicines={medicines}
      onFulfill={handleFulfill}
      disabled={loading}
    />
  );
}
