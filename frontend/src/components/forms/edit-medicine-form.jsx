import { useTransition, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateMedicine } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { toast } from "sonner";

const schema = z.object({
  nama: z.string().min(1, "Nama obat wajib diisi"),
  stok: z.number().min(0, "Stok tidak boleh negatif"),
  harga: z.number().min(0, "Harga tidak boleh negatif")
});

export function EditMedicineForm({ medicine, onSuccess, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      nama: "",
      stok: 0,
      harga: 0
    }
  });

  useEffect(() => {
    if (medicine) {
      reset({
        nama: medicine.nama,
        stok: medicine.stok,
        harga: medicine.harga
      });
    }
  }, [medicine, reset]);

  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await updateMedicine(medicine.id, values);
        toast.success("Data obat diperbarui");
        onSuccess?.();
      } catch (error) {
        toast.error(error.message ?? "Gagal memperbarui data obat");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="nama">Nama Obat</Label>
        <Input
          id="nama"
          {...register("nama")}
          placeholder="Nama Obat"
        />
        {errors.nama && <p className="text-xs text-red-500">{errors.nama.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stok">Stok</Label>
          <Input
            id="stok"
            type="number"
            {...register("stok", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.stok && <p className="text-xs text-red-500">{errors.stok.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="harga">Harga (Rp)</Label>
          <Input
            id="harga"
            type="number"
            {...register("harga", { valueAsNumber: true })}
            placeholder="0"
          />
          {errors.harga && <p className="text-xs text-red-500">{errors.harga.message}</p>}
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button disabled={pending} type="submit" className="bg-teal hover:bg-teal/90 text-white">
          {pending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </form>
  );
}
