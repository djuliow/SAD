
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateStock } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Select, SelectItem } from "/src/components/ui/select";
import { toast } from "sonner";

const schema = z.object({
  medicineId: z.string(),
  amount: z.number().min(-100).max(500)
});

export function MedicineForm({ medicines = [], onSuccess }) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { medicineId: medicines[0]?.id ?? "", amount: 10 }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await updateStock(values.medicineId, values.amount);
        toast.success("Stok diperbarui");
        reset();
        onSuccess?.();
      } catch (error) {
        toast.error(error.message ?? "Gagal memperbarui stok");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label>Obat</Label>
        <Select
          defaultValue={medicines[0]?.id ?? ""}
          onValueChange={(value) => setValue("medicineId", value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {medicines.map((med) => (
            <SelectItem key={med.id} value={String(med.id)}>
              {med.nama}
            </SelectItem>
          ))}
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
