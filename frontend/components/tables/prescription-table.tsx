"use client";

import { useState, useTransition } from "react";
import { Prescription } from "@/types";
import { fulfillPrescription } from "@/lib/mockApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function PrescriptionTable({ initialData }: { initialData: Prescription[] }) {
  const [data, setData] = useState(initialData);
  const [pending, startTransition] = useTransition();

  const handleFulfill = (id: string) => {
    startTransition(async () => {
      try {
        const updated = await fulfillPrescription(id);
        setData((current) => current.map((item) => (item.id === id ? updated! : item)));
        toast.success("Resep selesai");
      } catch (error: any) {
        toast.error(error.message ?? "Gagal memperbarui status");
      }
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resep Masuk</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Obat</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((prescription) => (
              <TableRow key={prescription.id}>
                <TableCell>{prescription.id}</TableCell>
                <TableCell>{prescription.medicineId}</TableCell>
                <TableCell>{prescription.sentToPharmacy ? "Menunggu" : "Selesai"}</TableCell>
                <TableCell className="text-right">
                  <Button
                    size="sm"
                    disabled={pending || !prescription.sentToPharmacy}
                    onClick={() => handleFulfill(prescription.id)}
                  >
                    Serahkan
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
