import { PatientForm } from "@/components/forms/patient-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { patients } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function AdminRegistrationPage() {
  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Pendaftaran Pasien</CardTitle>
        </CardHeader>
        <CardContent>
          <PatientForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Data Pasien</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-beige">
                <TableHead className="text-navy font-bold">Rekam Medis</TableHead>
                <TableHead className="text-navy font-bold">Nama</TableHead>
                <TableHead className="text-navy font-bold">Telepon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy">{patient.medicalRecordNo}</TableCell>
                  <TableCell className="text-navy">{patient.name}</TableCell>
                  <TableCell className="text-navy">{patient.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
