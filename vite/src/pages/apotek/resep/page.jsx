
import { useState, useEffect } from "react";
import { listPrescriptions } from "/src/api/api.js";
import { PrescriptionTable } from "/src/components/tables/prescription-table";

export default function ApotekPrescriptionPage() {
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    const fetchPrescriptions = async () => {
      const data = await listPrescriptions();
      setPrescriptions(data);
    };
    fetchPrescriptions();
  }, []);

  return <PrescriptionTable initialData={prescriptions} />;
}
