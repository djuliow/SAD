"use client";

import { useTransition } from "react";
import { medicines } from "@/lib/mockData";
import { createPrescription } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function PrescriptionForm({ examId }: { examId: string }) {
  const [pending, startTransition] = useTransition();

  const onSubmit = (formData: FormData) => {
    startTransition(async () => {
      try {
        await createPrescription(examId, {
          medicineId: formData.get("medicineId") as string,
          dosage: formData.get("dosage") as string,
          frequency: formData.get("frequency") as string,
          duration: formData.get("duration") as string
        });
        toast.success("Resep terkirim ke apotek");
      } catch (error: any) {
        toast.error(error.message ?? "Gagal membuat resep");
      }
    });
  };

  return (
    <form className="space-y-3" action={onSubmit}>
      <div>
        <p className="text-xs uppercase text-slate-400">Obat</p>
        <select name="medicineId" className="h-10 w-full rounded-md border border-slate-200 px-3 text-sm">
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
      <Button className="w-full" disabled={pending} type="submit">
        Kirim Resep
      </Button>
    </form>
  );
}
