import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedules, users } from "@/lib/mockData";

export default function KepalaSchedulePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monitoring Jadwal</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {schedules.map((schedule) => {
          const user = users.find((u) => u.id === schedule.userId);
          return (
            <div key={schedule.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-sm font-semibold text-slate-900">{user?.name}</p>
              <p className="text-xs text-slate-500">{schedule.role}</p>
              <p className="text-sm text-slate-700">{schedule.day} - {schedule.shift}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
