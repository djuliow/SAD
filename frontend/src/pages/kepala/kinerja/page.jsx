import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { getDoctorPerformance } from "/src/api/api.js";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "/src/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function KepalaKinerjaPage() {
    const [performanceData, setPerformanceData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getDoctorPerformance();
                setPerformanceData(data);
            } catch (error) {
                console.error(error);
                toast.error("Gagal memuat data kinerja dokter");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, []);

    // Custom colors for the chart
    const COLORS = ['#0F766E', '#0EA5E9', '#F59E0B', '#EF4444', '#8B5CF6'];

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-navy">Kinerja Dokter</h1>
                    <p className="text-slate-500 text-sm">Monitoring jumlah pasien yang ditangani oleh setiap dokter</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chart Section */}
                <Card className="bg-white border border-navy/10 shadow-md lg:col-span-1">
                    <CardHeader>
                        <CardTitle className="text-lg font-bold text-navy">Grafik Total Pasien</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[300px] w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={performanceData} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="doctor_name"
                                        type="category"
                                        width={100}
                                        tick={{ fontSize: 12, fill: '#64748b' }}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        cursor={{ fill: 'transparent' }}
                                        contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                    />
                                    <Bar dataKey="total_patients" name="Total Pasien" radius={[0, 4, 4, 0]} barSize={30}>
                                        {performanceData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Table Section */}
                <Card className="bg-white border border-navy/10 shadow-md lg:col-span-2">
                    <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
                        <CardTitle className="text-lg font-bold text-navy">Detail Kinerja</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                        <Table>
                            <TableHeader>
                                <TableRow className="bg-beige hover:bg-beige border-b border-navy/10">
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider pl-6 py-4">Nama Dokter</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-center">Pasien Hari Ini</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-center">Total Pasien</TableHead>
                                    <TableHead className="text-navy font-bold uppercase text-xs tracking-wider py-4 text-right pr-6">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {isLoading ? (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-navy/70">Memuat data...</TableCell>
                                    </TableRow>
                                ) : performanceData.length > 0 ? (
                                    performanceData.map((doctor, index) => (
                                        <TableRow key={doctor.doctor_id} className="hover:bg-sky-blue/5 transition-colors border-b border-navy/5">
                                            <TableCell className="font-medium text-navy pl-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-navy/10 flex items-center justify-center text-navy font-bold text-xs">
                                                        {index + 1}
                                                    </div>
                                                    {doctor.doctor_name}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-navy py-4 text-center">
                                                <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-sky-blue/20 text-navy">
                                                    {doctor.daily_patients}
                                                </span>
                                            </TableCell>
                                            <TableCell className="text-navy py-4 text-center font-bold">{doctor.total_patients}</TableCell>
                                            <TableCell className="text-right pr-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-teal/10 text-teal">
                                                    Aktif
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center py-8 text-navy/70">Tidak ada data dokter.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
