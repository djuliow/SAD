import { ScheduleForm } from "@/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedules, users } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminSchedulePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Atur Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">List Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-beige">
                <TableHead className="text-navy font-bold">Nama</TableHead>
                <TableHead className="text-navy font-bold">Hari</TableHead>
                <TableHead className="text-navy font-bold">Shift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((sch) => (
                <TableRow key={sch.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy">{users.find((user) => user.id === sch.userId)?.name}</TableCell>
                  <TableCell className="text-navy">{sch.day}</TableCell>
                  <TableCell className="text-navy">{sch.shift}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
