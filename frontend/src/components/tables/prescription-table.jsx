
import { useTransition } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";

export function PrescriptionTable({ prescriptions, medicines, onFulfill, onFulfillAll, disabled, patients = [] }) {
  const [pending, startTransition] = useTransition();

  const getMedicineName = (drugId) => {
    const medicine = medicines.find((m) => m.id === drugId);
    return medicine ? medicine.nama : "Obat tidak ditemukan";
  };

  // Create a map of examination_id to patient data for quick lookup
  const patientMap = {};
  patients.forEach(patientData => {
    patientMap[patientData.examination.id] = patientData;
  });

  // Group prescriptions by examination_id to identify which patients have multiple prescriptions
  const prescriptionsByExam = {};
  prescriptions.forEach(p => {
    if (!prescriptionsByExam[p.examination_id]) {
      prescriptionsByExam[p.examination_id] = [];
    }
    prescriptionsByExam[p.examination_id].push(p);
  });

  const handleFulfill = (id) => {
    startTransition(() => {
      onFulfill(id);
    });
  };

  const handleFulfillAll = (examinationId) => {
    startTransition(() => {
      onFulfillAll(examinationId);
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
              <TableHead>Nama Pasien</TableHead>
              <TableHead>Obat</TableHead>
              <TableHead>Kuantitas</TableHead>
              <TableHead>Catatan</TableHead>
              <TableHead>Status</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {prescriptions.map((p, index) => {
              // Find patient data for this prescription's examination
              const patientData = patientMap[p.examination_id];
              const patientName = patientData ? patientData.patient.name : "Pasien tidak ditemukan";

              // Check if this is the first prescription for this examination (to show group action)
              const isFirstChild = prescriptions.findIndex(p2 => p2.examination_id === p.examination_id) === index;

              return (
                <TableRow key={`${p.id}-${index}`}>
                  {index === prescriptions.findIndex(p2 => p2.examination_id === p.examination_id) ? (
                    <TableCell rowSpan={prescriptionsByExam[p.examination_id].length}>
                      <div>
                        <div>{patientName}</div>
                        {prescriptionsByExam[p.examination_id].length > 1 && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs"
                            disabled={disabled || pending || prescriptionsByExam[p.examination_id].every(p => p.status === "selesai")}
                            onClick={() => handleFulfillAll(p.examination_id)}
                          >
                            Serahkan Semua ({prescriptionsByExam[p.examination_id].length})
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  ) : null}
                  <TableCell>{getMedicineName(p.drug_id)}</TableCell>
                  <TableCell>{p.quantity}</TableCell>
                  <TableCell>{p.notes}</TableCell>
                  <TableCell className="capitalize">{p.status}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      size="sm"
                      disabled={disabled || pending || p.status === "selesai"}
                      onClick={() => handleFulfill(p.id)}
                    >
                      Serahkan
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
