"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSchedule } from "@/lib/mockApi";
import { users } from "@/lib/mockData";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Role } from "@/types";

const schema = z.object({
  userId: z.string(),
  role: z.enum(["ADMIN", "DOKTER", "APOTEKER", "KEPALA"]),
  day: z.string(),
  shift: z.string()
});

type FormValues = z.infer<typeof schema>;

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const shifts = ["Pagi", "Siang", "Sore"];

export function ScheduleForm() {
  const {
    handleSubmit,
    setValue,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { userId: users[0].id, role: users[0].role as Role, day: days[0], shift: shifts[0] }
  });
  const [pending, startTransition] = useTransition();

  const onSubmit = (values: FormValues) => {
    startTransition(async () => {
      try {
        await upsertSchedule(values);
        toast.success("Jadwal tersimpan");
      } catch (error: any) {
        toast.error(error.message ?? "Gagal menyimpan jadwal");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 md:grid-cols-2">
      <div className="md:col-span-2">
        <p className="text-xs uppercase text-slate-400">Pilih Pegawai</p>
        <Select defaultValue={watch("userId")} onValueChange={(value) => setValue("userId", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name} - {user.role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Hari</p>
        <Select defaultValue={watch("day")} onValueChange={(value) => setValue("day", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {days.map((day) => (
              <SelectItem key={day} value={day}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <p className="text-xs uppercase text-slate-400">Shift</p>
        <Select defaultValue={watch("shift")} onValueChange={(value) => setValue("shift", value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {shifts.map((shift) => (
              <SelectItem key={shift} value={shift}>
                {shift}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <Button className="md:col-span-2" disabled={pending} type="submit">
        Simpan Jadwal
      </Button>
    </form>
  );
}
