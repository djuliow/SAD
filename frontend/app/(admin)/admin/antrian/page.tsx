"use client";

import { useTransition } from "react";
import { queues, patients } from "@/lib/mockData";
import { advanceQueue } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const statusFlow = ["PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export default function AdminQueuePage() {
  const [pending, startTransition] = useTransition();

  const handleAdvance = (queueId: string, status: string) => {
    if (!statusFlow.includes(status as any)) return;
    const currentIndex = statusFlow.indexOf(status as (typeof statusFlow)[number]);
    if (currentIndex === -1 || currentIndex === statusFlow.length - 1) return;
    const nextStatus = statusFlow[currentIndex + 1];
    startTransition(async () => {
      try {
        await advanceQueue(queueId, nextStatus);
        toast.success(`Antrean diperbarui ke ${nextStatus}`);
      } catch (error: any) {
        toast.error(error.message ?? "Gagal memperbarui antrean");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Manajemen Antrean</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow className="bg-beige">
              <TableHead className="text-navy font-bold">No</TableHead>
              <TableHead className="text-navy font-bold">Pasien</TableHead>
              <TableHead className="text-navy font-bold">Status</TableHead>
              <TableHead className="text-navy font-bold">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.map((queue, index) => (
              <TableRow key={queue.id} className="hover:bg-sky-blue/30 transition-colors">
                <TableCell className="font-medium text-navy">{index + 1}</TableCell>
                <TableCell className="text-navy">{patients.find((p) => p.id === queue.patientId)?.name}</TableCell>
                <TableCell className="text-navy">{queue.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal/50 hover:bg-teal hover:text-white hover:border-teal"
                    disabled={pending || queue.status === "COMPLETED"}
                    onClick={() => handleAdvance(queue.id, queue.status)}
                  >
                    Lanjutkan
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
