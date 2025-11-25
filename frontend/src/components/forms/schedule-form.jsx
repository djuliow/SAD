import { useTransition, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { upsertSchedule, listEmployees } from "/src/api/api.js";
import { Button } from "/src/components/ui/button";
import { Label } from "/src/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "/src/components/ui/select";
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
    watch,
    formState: { errors }
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { userId: "", role: "DOKTER", day: days[0], shift: shifts[0] }
  });
  const [pending, startTransition] = useTransition();

  // Watch values to update UI state if needed
  const selectedUserId = watch("userId");
  const selectedDay = watch("day");
  const selectedShift = watch("shift");

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

  // Helper to get doctor name for display
  const getSelectedDoctorName = () => {
    const doctor = doctors.find(d => d.id.toString() === selectedUserId);
    return doctor ? doctor.name : "Pilih Dokter";
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="doctor" className="text-navy font-medium">Pilih Dokter</Label>
          <Select 
            value={selectedUserId} 
            onValueChange={(val) => setValue("userId", val)}
          >
            <SelectTrigger id="doctor" className="w-full bg-white border-navy/20">
              <SelectValue placeholder="Pilih Dokter">
                {getSelectedDoctorName()}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {doctors.map((doctor) => (
                <SelectItem key={doctor.id} value={doctor.id.toString()}>
                  {doctor.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="day" className="text-navy font-medium">Hari</Label>
          <Select 
            value={selectedDay} 
            onValueChange={(val) => setValue("day", val)}
          >
            <SelectTrigger id="day" className="w-full bg-white border-navy/20">
              <SelectValue placeholder="Pilih Hari" />
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

        <div className="space-y-2">
          <Label htmlFor="shift" className="text-navy font-medium">Shift</Label>
          <Select 
            value={selectedShift} 
            onValueChange={(val) => setValue("shift", val)}
          >
            <SelectTrigger id="shift" className="w-full bg-white border-navy/20">
              <SelectValue placeholder="Pilih Shift" />
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
      </div>

      <Button 
        className="w-full bg-teal hover:bg-teal/90 text-white font-medium py-2.5" 
        disabled={pending} 
        type="submit"
      >
        {pending ? "Menyimpan..." : "Simpan Jadwal"}
      </Button>
    </form>
  );
}
