
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerPatient } from "/src/api/api.js";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Button } from "/src/components/ui/button";
import { Textarea } from "/src/components/ui/textarea";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().min(3, "Nama wajib diisi"),
  dob: z.string().min(1, "Tanggal lahir wajib diisi"),
  gender: z.enum(["L", "P"]),
  phone: z.string().min(8, "No. telepon minimal 8 digit"),
  address: z.string().min(5, "Alamat wajib diisi")
});

export function PatientForm({ onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "L",
      name: "",
      dob: "",
      phone: "",
      address: "",
    }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await registerPatient({
          ...values
        });
        toast.success("Pasien berhasil didaftarkan");
        reset();
        onSuccess?.();
      } catch (error) {
        toast.error(error.message ?? "Gagal mendaftarkan pasien");
      }
    });
  };

  return (
    <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="md:col-span-2">
          <Label>Nama Lengkap</Label>
          <Input placeholder="Nama pasien" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Tanggal Lahir</Label>
          <Input type="date" {...register("dob")} />
          {errors.dob && <p className="text-xs text-red-500">{errors.dob.message}</p>}
        </div>
        <div>
          <Label>Jenis Kelamin</Label>
          <select
            className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm"
            {...register("gender")}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>No. Telepon</Label>
          <Input placeholder="08xxxxxxxx" {...register("phone")} />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
        </div>
        <div className="md:col-span-2">
          <Label>Alamat</Label>
          <Textarea rows={3} {...register("address")} />
          {errors.address && <p className="text-xs text-red-500">{errors.address.message}</p>}
        </div>
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Daftarkan Pasien"}
      </Button>
    </form>
  );
}
