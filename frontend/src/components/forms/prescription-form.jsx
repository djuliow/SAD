
import { useTransition } from "react";
import { medicines } from "/src/lib/mockData";
import { createPrescription } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Textarea } from "/src/components/ui/textarea";
import { toast } from "sonner";

export function PrescriptionForm({ examId }) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    startTransition(async () => {
      try {
        await createPrescription(examId, {
          medicineId: formData.get("medicineId"),
          dosage: formData.get("dosage"),
          frequency: formData.get("frequency"),
          duration: formData.get("duration")
        });
        toast.success("Resep terkirim ke apotek");
      } catch (error) {
        toast.error(error.message ?? "Gagal membuat resep");
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={onSubmit}>
      <div>
        <p className="text-xs uppercase text-navy/70 font-medium mb-2">Obat</p>
        <select name="medicineId" className="h-10 w-full rounded-md border border-navy/20 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-colors shadow-sm text-navy">
          {medicines.map((medicine) => (
            <option key={medicine.id} value={medicine.id}>
              {medicine.name}
            </option>
          ))}
        </select>
      </div>
      <Input name="dosage" placeholder="Dosis" required />
      <Input name="frequency" placeholder="Frekuensi" required />
      <Textarea name="duration" placeholder="Durasi" required />
      <Button className="w-full bg-teal hover:bg-teal/90 text-white shadow-sm" disabled={pending} type="submit">
        Kirim Resep
      </Button>
    </form>
  );
}
