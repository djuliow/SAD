import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listPatients } from "/src/api/api.js";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { format } from "date-fns";

export default function KepalaPasienPage() {
    const [patients, setPatients] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const data = await listPatients();
                setPatients(data);
            } catch (error) {
                toast.error("Gagal memuat data pasien");
            } finally {
                setIsLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <Card className="bg-white border border-navy/10 shadow-md">
            <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
                <CardTitle className="text-lg font-bold text-navy">Data Pasien</CardTitle>
                <p className="text-xs text-navy/70">Daftar semua pasien terdaftar.</p>
            </CardHeader>
            <CardContent className="p-6">
                <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">No. RM</TableHead>
                                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama</TableHead>
                                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Tanggal Lahir</TableHead>
                                <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Alamat</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                                </TableRow>
                            ) : patients.length > 0 ? (
                                patients.map((patient) => (
                                    <TableRow key={patient.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                                        <TableCell className="font-medium text-navy pl-6 py-4">{patient.medicalRecordNo}</TableCell>
                                        <TableCell className="text-navy py-4">{patient.name}</TableCell>
                                        <TableCell className="text-navy py-4">{format(new Date(patient.dob), "dd MMM yyyy")}</TableCell>
                                        <TableCell className="text-navy py-4">{patient.address}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-navy/70">Tidak ada data pasien.</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </CardContent>
        </Card>
    );
}
