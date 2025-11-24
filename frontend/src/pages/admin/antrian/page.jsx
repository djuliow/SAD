import { useTransition, useState, useEffect, useCallback } from "react";
import { listQueues, cancelQueue } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { Badge } from "/src/components/ui/badge";
import { toast } from "sonner";
import { RefreshCw, Trash2 } from "lucide-react";

// Define a sort order for statuses
const statusOrder = {
  "diperiksa": 1,
  "apotek": 2,
  "membayar": 3,
  "menunggu": 4,
  "selesai": 5,
};

export default function AdminQueuePage() {
  const [pending, startTransition] = useTransition();
  const [queues, setQueues] = useState([]);

  const fetchQueues = useCallback(async () => {
    try {
      const data = await listQueues();
      setQueues(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data antrean");
    }
  }, []);

  useEffect(() => {
    fetchQueues();
  }, [fetchQueues]);

  const handleCancel = (queueId, patientName) => {
    if (window.confirm(`Apakah Anda yakin ingin membatalkan antrean untuk ${patientName}?`)) {
      startTransition(async () => {
        try {
          await cancelQueue(queueId);
          toast.success(`Antrean untuk ${patientName} telah dibatalkan.`);
          fetchQueues(); // Refetch data
        } catch (error) {
          toast.error(error.message ?? "Gagal membatalkan antrean");
        }
      });
    }
  };

  const getStatusBadge = (status) => {
  switch (status) {
    case 'menunggu': return <Badge variant="warning">Menunggu</Badge>;
    case 'diperiksa': return <Badge variant="info">Diperiksa</Badge>;
    case 'apotek': return <Badge variant="default">Apotek</Badge>;
    case 'membayar': return <Badge variant="secondary">Membayar</Badge>;
    case 'selesai': return <Badge variant="success">Selesai</Badge>;
    default: return <Badge>{status}</Badge>;
  }
}

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-navy">Manajemen Antrean</CardTitle>
        <Button size="icon" variant="ghost" onClick={fetchQueues} aria-label="Refresh" disabled={pending}>
          <RefreshCw className={`h-5 w-5 text-navy ${pending ? 'animate-spin' : ''}`} />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">No. Antrean</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Pasien</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Status</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider text-right py-4 pr-6">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues.map((queue) => (
                <TableRow key={queue.id} className="bg-white hover:bg-sky-blue/30 transition-colors border-b border-navy/5">
                  <TableCell className="font-medium text-navy pl-6 py-4">{queue.id}</TableCell>
                  <TableCell className="text-navy py-4">{queue.patient_name}</TableCell>
                  <TableCell className="py-4">{getStatusBadge(queue.status)}</TableCell>
                  <TableCell className="text-right pr-6">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={pending || queue.status === "selesai"}
                      onClick={() => handleCancel(queue.id, queue.patient_name)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Batalkan
                    </Button>
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
