"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStock } from "@/lib/mockApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { medicines } from "@/lib/mockData";
import { toast } from "sonner";

const schema = z.object({
  medicineId: z.string(),
  amount: z.number().min(-100).max(500)
});

type FormValues = z.infer<typeof schema>;

export function MedicineForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { medicineId: medicines[0]?.id ?? "", amount: 10 }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await updateStock(values.medicineId, values.amount);
        toast.success("Stok diperbarui");
      } catch (error: any) {
        toast.error(error.message ?? "Gagal memperbarui stok");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Obat</Label>
        <Select defaultValue={medicines[0]?.id ?? ""} onValueChange={(value) => setValue("medicineId", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Pilih obat" />
          </SelectTrigger>
          <SelectContent>
            {medicines.map((med) => (
              <SelectItem key={med.id} value={med.id}>
                {med.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Penyesuaian</Label>
        <Input
          type="number"
          {...register("amount", { valueAsNumber: true })}
          placeholder="10"
        />
        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Update Stok"}
      </Button>
    </form>
  );
}
