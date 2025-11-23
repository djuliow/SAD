import { ScheduleForm } from "/src/components/forms/schedule-form";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { schedules, users } from "/src/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";

export default function AdminSchedulePage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[360px,1fr]">
      <Card className="bg-white border border-navy/10 shadow-md h-fit">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">Atur Jadwal</CardTitle>
        </CardHeader>
        <CardContent>
          <ScheduleForm />
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10">
          <CardTitle className="text-lg font-bold text-navy">List Jadwal</CardTitle>
        </CardHeader>
        <CardContent className="p-6 pt-8">
        <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Hari</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Shift</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {schedules.map((sch) => (
                <TableRow key={sch.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                  <TableCell className="font-medium text-navy pl-6 py-4">{users.find((user) => user.id === sch.userId)?.name}</TableCell>
                  <TableCell className="text-navy py-4">{sch.day}</TableCell>
                  <TableCell className="text-navy py-4">{sch.shift}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        </CardContent>
      </Card>
    </div>
  );
}
