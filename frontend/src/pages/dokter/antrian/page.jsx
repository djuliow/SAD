import { useState, useEffect, useTransition, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { listQueues, advanceQueue } from "/src/api/api.js";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";

export default function DokterQueuePage() {
  const [queues, setQueues] = useState([]);
  const [isPending, startTransition] = useTransition();
  const navigate = useNavigate();

  const fetchQueues = useCallback(async () => {
    try {
      const data = await listQueues();
      // Show patients who are waiting OR are currently being examined
      const doctorQueues = data.filter(
        (queue) => queue.status === "menunggu" || queue.status === "diperiksa"
      );
      setQueues(doctorQueues);
    } catch (error) {
      toast.error(error.message ?? "Gagal memuat data antrean");
    }
  }, []);


  const handleQueueClick = (queue) => {
    startTransition(async () => {
      try {
        // If patient is waiting, update their status to "in progress"
        if (queue.status === "menunggu") {
          await advanceQueue(queue.id, "diperiksa");
          toast.success("Memulai sesi pemeriksaan...");
        }
        // Navigate to the examination page
        navigate(`/dokter/pemeriksaan/${queue.id}`);
      } catch (error) {
        toast.error(error.message ?? "Gagal memproses antrean");
      }
    });
  };

  useEffect(() => {
    fetchQueues();
  }, []);

  return (
    <Card className="bg-white border border-navy/10 shadow-md">
      <CardHeader className="bg-beige border-b border-navy/10 flex flex-row items-center justify-between">
        <CardTitle className="text-lg font-bold text-navy">Antrean Pemeriksaan</CardTitle>
        <Button size="icon" variant="ghost" onClick={fetchQueues} aria-label="Refresh" disabled={isPending}>
          <RefreshCw className={`h-5 w-5 text-navy ${isPending ? 'animate-spin' : ''}`} />
        </Button>
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
              {queues.length > 0 ? (
                queues.map((queue) => (
                  <TableRow key={queue.id} className="bg-white hover:bg-sky-blue/30 transition-colors border-b border-navy/5">
                    <TableCell className="font-medium text-navy pl-6 py-4">{queue.patient_name}</TableCell>
                    <TableCell className="text-navy py-4 capitalize">{queue.status}</TableCell>
                    <TableCell className="text-right py-4 pr-6">
                      <Button
                        size="sm"
                        variant={queue.status === 'diperiksa' ? 'outline' : 'default'}
                        className="shadow-sm transition-colors"
                        onClick={() => handleQueueClick(queue)}
                        disabled={isPending}
                      >
                        {isPending ? "Memuat..." : (queue.status === 'diperiksa' ? "Lanjutkan" : "Periksa")}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan="3" className="text-center text-slate-500 py-10">
                    Tidak ada pasien dalam antrean.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
