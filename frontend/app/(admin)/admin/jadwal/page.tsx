import { ScheduleForm } from "@/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { schedules, users } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminSchedulePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Atur Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>List Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Hari</TableHead>
                <TableHead>Shift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((sch) => (
                <TableRow key={sch.id}>
                  <TableCell>{users.find((user) => user.id === sch.userId)?.name}</TableCell>
                  <TableCell>{sch.day}</TableCell>
                  <TableCell>{sch.shift}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
