import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { queues, patients } from "/src/lib/mockData";

export default function DokterQueuePage() {
  const doctorQueues = queues.filter((queue) => queue.doctorId === "u-dokter");

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="bg-beige border-b border-navy/10">
        <CardTitle className="text-lg font-bold text-navy">Antrean Pemeriksaan</CardTitle>
      </CardHeader>
      <CardContent className="p-6 pt-8">
        <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Pasien</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Status</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-right pr-6"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {doctorQueues.map((queue) => (
                <TableRow key={queue.id} className="bg-white hover:bg-sky-blue/30 transition-colors border-b border-navy/5">
                  <TableCell className="font-medium text-navy pl-6 py-4">{patients.find((p) => p.id === queue.patientId)?.name}</TableCell>
                  <TableCell className="text-navy py-4">{queue.status}</TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <Link to={`/dokter/pemeriksaan/${queue.id}`}>
                      <Button
                        size="sm"
                        className="bg-white text-teal border border-teal shadow-sm hover:bg-navy hover:text-white hover:border-navy transition-colors"
                      >
                        Periksa
                      </Button>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
