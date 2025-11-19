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

  const handleAdvance = (queueId: string, status: (typeof statusFlow)[number]) => {
    const currentIndex = statusFlow.indexOf(status);
    if (currentIndex === statusFlow.length - 1) return;
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
        <CardTitle>Manajemen Antrean</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Pasien</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {queues.map((queue, index) => (
              <TableRow key={queue.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{patients.find((p) => p.id === queue.patientId)?.name}</TableCell>
                <TableCell>{queue.status}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
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
