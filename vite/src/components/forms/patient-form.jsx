
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
  medicalRecordNo: z.string().min(3),
  name: z.string().min(3),
  dob: z.string(),
  gender: z.enum(["L", "P"]),
  phone: z.string().min(8),
  address: z.string().min(5)
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
      gender: "L"
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
        <div>
          <Label>No. Rekam Medis</Label>
          <Input placeholder="RM001" {...register("medicalRecordNo")} />
          {errors.medicalRecordNo && (
            <p className="text-xs text-red-500">{errors.medicalRecordNo.message}</p>
          )}
        </div>
        <div>
          <Label>Nama Lengkap</Label>
          <Input placeholder="Nama pasien" {...register("name")} />
          {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
        </div>
        <div>
          <Label>Tanggal Lahir</Label>
          <Input type="date" {...register("dob")} />
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
        <div>
          <Label>No. Telepon</Label>
          <Input placeholder="08xxxxxxxx" {...register("phone")} />
        </div>
        <div>
          <Label>Alamat</Label>
          <Textarea rows={3} {...register("address")} />
        </div>
      </div>
      <Button className="w-full" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Daftarkan Pasien"}
      </Button>
    </form>
  );
}
