
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSchedule } from "/src/api/api.js";
import { users } from "/src/lib/mockData";
import { Select, SelectItem } from "/src/components/ui/select";
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

export function ScheduleForm() {
  const {
    handleSubmit,
    setValue,
    watch
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userId: users[0].id, role: users[0].role, day: days[0], shift: shifts[0] }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values) => {
    startTransition(async () => {
      try {
        await upsertSchedule(values);
        toast.success("Jadwal tersimpan");
      } catch (error) {
        toast.error(error.message ?? "Gagal menyimpan jadwal");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="text-xs uppercase text-slate-400">Pilih Pegawai</p>
        <Select
          defaultValue={watch("userId")}
          onValueChange={(value) => setValue("userId", value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {users.map((user) => (
            <SelectItem key={user.id} value={user.id}>
              {user.name} - {user.role}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Hari</p>
        <Select
          defaultValue={watch("day")}
          onValueChange={(value) => setValue("day", value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {days.map((day) => (
            <SelectItem key={day} value={day}>
              {day}
            </SelectItem>
          ))}
        </Select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Shift</p>
        <Select
          defaultValue={watch("shift")}
          onValueChange={(value) => setValue("shift", value)}
          className="flex h-9 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-slate-950 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {shifts.map((shift) => (
            <SelectItem key={shift} value={shift}>
              {shift}
            </SelectItem>
          ))}
        </Select>
      </div>
      <Button className="md:col-span-2" disabled={pending} type="submit">
        Simpan Jadwal
      </Button>
    </form>
  );
}
