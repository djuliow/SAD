
import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSchedule, listEmployees } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";

const schema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "DOKTER", "APOTEKER", "KEPALA"]),
  day: z.string(),
  shift: z.string()
});

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const shifts = ["Pagi", "Siang", "Sore"];

export function ScheduleForm({ onSuccess }) {
  const [doctors, setDoctors] = useState([]);
  const {
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userId: "", role: "DOKTER", day: days[0], shift: shifts[0] }
  });
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const data = await listEmployees();
        const doctorList = data.filter(emp => emp.role.toLowerCase() === 'dokter');
        setDoctors(doctorList);
        if (doctorList.length > 0) {
          setValue("userId", doctorList[0].id.toString());
        }
      } catch (error) {
        toast.error("Gagal memuat daftar dokter");
      }
    };
    fetchDoctors();
  }, [setValue]);

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        const selectedDoctor = doctors.find(d => d.id.toString() === values.userId);
        const timeMap = {
          "Pagi": "08:00 - 14:00",
          "Siang": "14:00 - 20:00",
          "Sore": "20:00 - 08:00"
        };

        await upsertSchedule({
          user_id: parseInt(values.userId),
          user_name: selectedDoctor ? selectedDoctor.name : "Unknown",
          day: values.day,
          time: timeMap[values.shift] || "08:00 - 14:00",
          activity: "Praktek Rutin"
        });
        toast.success("Jadwal tersimpan");
        if (onSuccess) onSuccess();
      } catch (error) {
        toast.error(error.message ?? "Gagal menyimpan jadwal");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="text-xs uppercase text-slate-400">Pilih Dokter</p>
        <select
          value={watch("userId")}
          onChange={(e) => setValue("userId", e.target.value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {doctors.map((user) => (
            <option key={user.id} value={user.id.toString()}>
              {user.name}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Hari</p>
        <select
          value={watch("day")}
          onChange={(e) => setValue("day", e.target.value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {days.map((day) => (
            <option key={day} value={day}>
              {day}
            </option>
          ))}
        </select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Shift</p>
        <select
          value={watch("shift")}
          onChange={(e) => setValue("shift", e.target.value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {shifts.map((shift) => (
            <option key={shift} value={shift}>
              {shift}
            </option>
          ))}
        </select>
      </div>
      <Button className="md:col-span-2" disabled={pending} type="submit">
        Simpan Jadwal
      </Button>
    </form>
  );
}
