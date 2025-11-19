import { PatientForm } from "@/components/forms/patient-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patients } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminRegistrationPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle>Pendaftaran Pasien</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Data Pasien</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rekam Medis</TableHead>
                <TableHead>Nama</TableHead>
                <TableHead>Telepon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id}>
                  <TableCell>{patient.medicalRecordNo}</TableCell>
                  <TableCell>{patient.name}</TableCell>
                  <TableCell>{patient.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
