import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { schedules, users } from "/src/lib/mockData";

export default function KepalaSchedulePage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Monitoring Jadwal</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3">
        {schedules.map((schedule) => {
          const user = users.find((u) => u.id === schedule.userId);
          return (
            <div key={schedule.id} className="rounded-xl border border-navy/10 bg-sky-blue/50 p-4 hover:bg-sky-blue/70 hover:shadow-md transition-all">
              <p className="text-sm font-bold text-navy">{user?.name}</p>
              <p className="text-xs text-navy/70 font-medium">{schedule.role}</p>
              <p className="text-sm text-navy font-medium">{schedule.day} - {schedule.shift}</p>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
