import { listPrescriptions } from "@/lib/mockApi";
import { PrescriptionTable } from "@/components/tables/prescription-table";

export default async function ApotekPrescriptionPage() {
  const prescriptions = await listPrescriptions();
  return <PrescriptionTable initialData={prescriptions} />;
}
