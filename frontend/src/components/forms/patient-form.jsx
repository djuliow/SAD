
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerPatient, listEmployees } from "/src/api/api.js";
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
  address: z.string().min(5, "Alamat wajib diisi"),
  doctor_id: z.string().optional()
});

export function PatientForm({ onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      gender: "L",
      name: "",
      dob: "",
      phone: "",
      address: "",
      doctor_id: ""
    }
  });
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await listEmployees();
        const doctorList = data.filter(emp => emp.role.toLowerCase() === 'dokter');
        setDoctors(doctorList);
      } catch (error) {
        console.error("Failed to fetch doctors", error);
      }
    };
    fetchDoctors();
  }, []);

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await registerPatient({
          ...values,
          doctor_id: values.doctor_id ? parseInt(values.doctor_id) : null
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
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={watch("gender")}
            onChange={(e) => setValue("gender", e.target.value)}
          >
            <option value="L">Laki-laki</option>
            <option value="P">Perempuan</option>
          </select>
        </div>
        <div className="md:col-span-2">
          <Label>Pilih Dokter (Opsional)</Label>
          <select
            className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            value={watch("doctor_id")}
            onChange={(e) => setValue("doctor_id", e.target.value)}
          >
            <option value="">-- Pilih Dokter --</option>
            {doctors.map((doc) => (
              <option key={doc.id} value={doc.id.toString()}>
                {doc.name}
              </option>
            ))}
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
      <Button className="w-full bg-teal hover:bg-teal/90 text-white" disabled={pending} type="submit">
        {pending ? "Menyimpan..." : "Daftarkan Pasien"}
      </Button>
    </form>
  );
}
