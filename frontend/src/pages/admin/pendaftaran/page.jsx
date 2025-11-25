import { useEffect, useState } from "react";
import { PatientForm } from "/src/components/forms/patient-form";
import { listPatients } from "/src/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";

export default function AdminRegistrationPage() {
  const [patients, setPatients] = useState([]);

  const fetchPatients = async () => {
    try {
      const data = await listPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      // Optionally, show an error message to the user
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <div className="grid gap-6 lg:grid-cols-[400px,1fr]">
      <Card className="bg-white border border-navy/10 shadow-md h-fit">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-navy">Pendaftaran Pasien</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <PatientForm onSuccess={fetchPatients} />
        </CardContent>
      </Card>
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-navy">Data Pasien</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-beige hover:bg-beige">
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Rekam Medis</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama</TableHead>
                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Telepon</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.map((patient) => (
                <TableRow key={patient.id} className="hover:bg-sky-blue/30 transition-colors">
                  <TableCell className="font-medium text-navy pl-6 py-4">{patient.medicalRecordNo}</TableCell>
                  <TableCell className="text-navy py-4">{patient.name}</TableCell>
                  <TableCell className="text-navy py-4">{patient.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
