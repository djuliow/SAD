
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "/src/components/ui/button";
import { Textarea } from "/src/components/ui/textarea";
import { createExamination } from "/src/api/api.js";
import { toast } from "sonner";

const schema = z.object({
  complaint: z.string().min(3),
  diagnosis: z.string().min(3),
  notes: z.string().optional()
});

export function ExaminationForm({ queueId, doctorId }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ resolver: zodResolver(schema) });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await createExamination(queueId, doctorId, values);
        toast.success("Pemeriksaan disimpan");
        reset();
      } catch (error) {
        toast.error(error.message ?? "Gagal menyimpan pemeriksaan");
      }
    });
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Textarea placeholder="Keluhan utama" {...register("complaint")} />
        {errors.complaint && <p className="text-xs text-red-500">{errors.complaint.message}</p>}
      </div>
      <div>
        <Textarea placeholder="Diagnosis" {...register("diagnosis")} />
        {errors.diagnosis && <p className="text-xs text-red-500">{errors.diagnosis.message}</p>}
      </div>
      <Textarea placeholder="Catatan tambahan" {...register("notes")} />
      <Button disabled={pending} type="submit" className="w-full bg-teal hover:bg-teal/90 text-white shadow-sm">
        {pending ? "Menyimpan..." : "Simpan Pemeriksaan"}
      </Button>
    </form>
  );
}
