import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createDrug } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  nama: z.string().min(2, "Nama obat minimal 2 karakter"),
  stok: z.number().min(0, "Stok tidak boleh negatif"),
  harga: z.number().min(0, "Harga tidak boleh negatif"),
});

export function NewMedicineForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { nama: "", stok: 0, harga: 0 }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await createDrug(values);
        toast.success("Obat baru berhasil ditambahkan");
        reset();
        onSuccess?.();
      } catch (error) {
        toast.error(error.message ?? "Gagal menambahkan obat baru");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="nama">Nama Obat</Label>
        <Input
          id="nama"
          {...register("nama")}
          placeholder="Paracetamol"
        />
        {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
      </div>
      <div>
        <Label htmlFor="stok">Stok Awal</Label>
        <Input
          id="stok"
          type="number"
          {...register("stok", { valueAsNumber: true })}
          placeholder="100"
        />
        {errors.stok && <p className="text-xs text-red-500">{errors.stok.message}</p>}
      </div>
      <div>
        <Label htmlFor="harga">Harga</Label>
        <Input
          id="harga"
          type="number"
          {...register("harga", { valueAsNumber: true })}
          placeholder="5000"
        />
        {errors.harga && <p className="text-xs text-red-500">{errors.harga.message}</p>}
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Tambah Obat Baru"}
      </Button>
    </form>
  );
}
