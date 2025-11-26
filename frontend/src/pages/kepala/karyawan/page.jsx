import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listEmployees, createEmployee, updateEmployee, deleteEmployee } from "/src/api/api.js";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { Button } from "/src/components/ui/button";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { Input } from "/src/components/ui/input";
import { Label } from "/src/components/ui/label";

export default function KepalaKaryawanPage() {
    const [employees, setEmployees] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [formData, setFormData] = useState({ name: "", role: "admin", username: "", password: "" });

    const fetchEmployees = async () => {
        try {
            const data = await listEmployees();
            setEmployees(data);
        } catch (error) {
            toast.error("Gagal memuat data karyawan");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handleOpenDialog = (employee = null) => {
        if (employee) {
            setEditingEmployee(employee);
            setFormData({ name: employee.name, role: employee.role, username: employee.username, password: "" }); // Password empty on edit
        } else {
            setEditingEmployee(null);
            setFormData({ name: "", role: "admin", username: "", password: "" });
        }
        setIsDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setIsDialogOpen(false);
        setEditingEmployee(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingEmployee) {
                const payload = { ...formData };
                if (!payload.password) delete payload.password; // Don't send empty password on update
                await updateEmployee(editingEmployee.id, payload);
                toast.success("Karyawan berhasil diperbarui");
            } else {
                await createEmployee(formData);
                toast.success("Karyawan berhasil ditambahkan");
            }
            fetchEmployees();
            handleCloseDialog();
        } catch (error) {
            toast.error(error.message || "Gagal menyimpan data karyawan");
        }
    };

    const handleDelete = async (id) => {
        if (confirm("Apakah Anda yakin ingin menghapus karyawan ini?")) {
            try {
                await deleteEmployee(id);
                toast.success("Karyawan berhasil dihapus");
                fetchEmployees();
            } catch (error) {
                toast.error("Gagal menghapus karyawan");
            }
        }
    };

    return (
        <div className="space-y-6">
            <Card className="bg-white border border-navy/10 shadow-md">
                <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl flex flex-row items-center justify-between">
                    <div>
                        <CardTitle className="text-lg font-bold text-navy">Data Karyawan</CardTitle>
                        <p className="text-xs text-navy/70">Daftar semua karyawan klinik.</p>
                    </div>
                    <Button onClick={() => handleOpenDialog()} className="bg-teal hover:bg-teal/90 text-white gap-2">
                        <Plus className="h-4 w-4" /> Tambah Karyawan
                    </Button>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="rounded-md border border-navy/10 shadow-sm overflow-hidden">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Role</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4">Username</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-right pr-6">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                                    </TableRow>
                                ) : employees.length > 0 ? (
                                    employees.map((emp) => (
                                        <TableRow key={emp.id} className="hover:bg-sky-blue/30 transition-colors border-b border-navy/10">
                                            <TableCell className="font-medium text-navy pl-6 py-4">{emp.name}</TableCell>
                                            <TableCell className="text-navy py-4 capitalize">{emp.role}</TableCell>
                                            <TableCell className="text-navy py-4">{emp.username}</TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => handleOpenDialog(emp)} className="h-8 w-8 text-navy hover:text-teal hover:bg-teal/10">
                                                        <Pencil className="h-4 w-4" />
                                                    </Button>
                                                    <Button variant="ghost" size="icon" onClick={() => handleDelete(emp.id)} className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-navy/70">Tidak ada data karyawan.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Simple Modal Implementation */}
            {isDialogOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-bold text-navy">{editingEmployee ? "Edit Karyawan" : "Tambah Karyawan"}</h2>
                            <Button variant="ghost" size="icon" onClick={handleCloseDialog}>
                                <X className="h-5 w-5" />
                            </Button>
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Nama Lengkap</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="role">Role</Label>
                                <select
                                    id="role"
                                    className="flex h-10 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                >
                                    <option value="admin">Admin</option>
                                    <option value="dokter">Dokter</option>
                                    <option value="apoteker">Apoteker</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="username">Username</Label>
                                <Input
                                    id="username"
                                    value={formData.username}
                                    onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password {editingEmployee && "(Biarkan kosong jika tidak diubah)"}</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required={!editingEmployee}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-4">
                                <Button type="button" variant="outline" onClick={handleCloseDialog}>Batal</Button>
                                <Button type="submit" className="bg-teal hover:bg-teal/90 text-white">Simpan</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
