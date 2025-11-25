import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { listPatients, getPatientStats } from "/src/api/api.js";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { format } from "date-fns";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export default function KepalaPasienPage() {
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ daily_visits: [], monthly_visits: [] });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [patientsData, statsData] = await Promise.all([
                    listPatients(),
                    getPatientStats()
                ]);
                setPatients(patientsData);
                setStats(statsData);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Daily Visits Chart */}
                <Card className="bg-white border border-navy/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-navy">Kunjungan Harian (7 Hari Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={stats.daily_visits}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(value) => format(new Date(value), 'dd MMM')}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        labelFormatter={(value) => format(new Date(value), 'dd MMMM yyyy')}
                                    />
                                    <Bar dataKey="count" name="Jumlah Pasien" fill="#0F766E" radius={[4, 4, 0, 0]} barSize={40} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Monthly Visits Chart */}
                <Card className="bg-white border border-navy/10 shadow-md">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-navy">Kunjungan Bulanan (6 Bulan Terakhir)</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.monthly_visits}>
                                    <defs>
                                        <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2} />
                                            <stop offset="95%" stopColor="#0F766E" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        tickFormatter={(value) => format(new Date(value + '-01'), 'MMM yyyy')}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <YAxis
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                        allowDecimals={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                        labelFormatter={(value) => format(new Date(value + '-01'), 'MMMM yyyy')}
                                    />
                                    <Area type="monotone" dataKey="count" name="Jumlah Pasien" stroke="#0F766E" strokeWidth={2} fillOpacity={1} fill="url(#colorVisits)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </div>

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
        </div>
    );
}
