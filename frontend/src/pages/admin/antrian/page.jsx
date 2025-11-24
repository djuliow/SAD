
import { useTransition, useState, useEffect } from "react";
import { listQueues } from "/src/api/api.js";
import { advanceQueue } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

const statusFlow = ["menunggu", "diperiksa", "selesai"];

export default function AdminQueuePage() {
  const [pending, startTransition] = useTransition();
  const [queues, setQueues] = useState([]);

  const fetchQueues = async () => {
    try {
      const data = await listQueues();
      setQueues(data);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data antrean");
    }
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  const handleAdvance = (queueId, status) => {
    const currentIndex = statusFlow.indexOf(status);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIndex + 1];
    startTransition(async () => {
      try {
        await advanceQueue(queueId, nextStatus);
        toast.success(`Antrean diperbarui ke ${nextStatus}`);
        fetchQueues(); // Refetch data
      } catch (error) {
        toast.error(error.message ?? "Gagal memperbarui antrean");
      }
    });
  };

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-navy">Manajemen Antrean</CardTitle>
        <Button size="icon" variant="ghost" onClick={fetchQueues} aria-label="Refresh">
          <RefreshCw className="h-5 w-5 text-navy" />
        </Button>
      </CardHeader>
      <CardContent className="p-6">
        <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">No Antrean</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Pasien</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Status</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {queues.map((queue) => (
                <TableRow key={queue.id} className="bg-white hover:bg-sky-blue/30 transition-colors border-b border-navy/5">
                  <TableCell className="font-medium text-navy pl-6 py-4">{queue.id}</TableCell>
                  <TableCell className="text-navy py-4">{queue.patient_name}</TableCell>
                  <TableCell className="text-navy py-4 capitalize">{queue.status}</TableCell>
                  <TableCell className="py-4">
                    <Button
                      size="sm"
                      className="bg-white text-teal border border-teal shadow-sm hover:bg-navy hover:text-white hover:border-navy transition-colors"
                      disabled={pending || queue.status === "selesai"}
                      onClick={() => handleAdvance(queue.id, queue.status)}
                    >
                      Lanjutkan
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
