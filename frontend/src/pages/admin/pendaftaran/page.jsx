import { useEffect, useState } from "react";
import { PatientForm } from "/src/components/forms/patient-form";
import { listPatients, updatePatient } from "/src/api/api";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";
import { Pencil, X } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminRegistrationPage() {
  const [patients, setPatients] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    gender: "L",
    phone: "",
    address: ""
  });

  const fetchPatients = async () => {
    try {
      const data = await listPatients();
      setPatients(data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Gagal memuat data pasien");
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  const handleEdit = (patient) => {
    setEditingPatient(patient);
    setFormData({
      name: patient.name,
      dob: patient.dob,
      gender: patient.gender,
      phone: patient.phone,
      address: patient.address
    });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingPatient(null);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await updatePatient(editingPatient.id, formData);
      toast.success("Data pasien berhasil diperbarui");
      fetchPatients();
      handleCloseDialog();
    } catch (error) {
      toast.error(error.message || "Gagal memperbarui data pasien");
    }
  };

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
          <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Rekam Medis</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Nama</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Telepon</TableHead>
                  <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-right pr-6">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/5">
                    <TableCell className="font-medium text-navy pl-6 py-4">{patient.medicalRecordNo}</TableCell>
                    <TableCell className="text-navy py-4">{patient.name}</TableCell>
                    <TableCell className="text-navy py-4">{patient.phone}</TableCell>
                    <TableCell className="text-right pr-6 py-4">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleEdit(patient)}
                        className="h-8 w-8 text-navy hover:text-teal hover:bg-teal/10"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Patient Modal */}
      {isDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95 duration-200">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-navy">Edit Data Pasien</h2>
              <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dob">Tanggal Lahir</Label>
                  <Input
                    id="dob"
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <select
                    id="gender"
                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Nomor Telepon</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Alamat</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={handleCloseDialog}>Batal</Button>
                <Button type="submit" className="bg-teal hover:bg-teal/90 text-white">Simpan Perubahan</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
