import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { queues, patients } from "@/lib/mockData";

export default function DokterQueuePage() {
  const doctorQueues = queues.filter((queue) => queue.doctorId === "u-dokter");

  return (
    <Card>
      <CardHeader>
        <CardTitle>Antrean Pemeriksaan</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Pasien</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {doctorQueues.map((queue) => (
              <TableRow key={queue.id}>
                <TableCell>{patients.find((p) => p.id === queue.patientId)?.name}</TableCell>
                <TableCell>{queue.status}</TableCell>
                <TableCell className="text-right">
                  <Link className="text-primary" href={`/dokter/pemeriksaan/${queue.id}`}>
                    Periksa
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
