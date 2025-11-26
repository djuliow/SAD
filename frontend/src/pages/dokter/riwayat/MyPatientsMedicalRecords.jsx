import { useEffect, useState, useMemo } from "react";
import { getMyPatientsMedicalRecords } from "/src/api/api.js";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Input } from "/src/components/ui/input";
import { Button } from "/src/components/ui/button";
import { toast } from "sonner";
import { Search, FileText, X, ArrowLeft } from "lucide-react";
import { PatientHistoryViewer } from "/src/components/features/PatientHistoryViewer";
import { useNavigate } from "react-router-dom";

export default function MyPatientsMedicalRecords({ doctorId }) {
  const [records, setRecords] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const data = await getMyPatientsMedicalRecords(doctorId);
        setRecords(data.records || []);
      } catch (error) {
        toast.error(error.message ?? "Gagal memuat rekam medis pasien");
      } finally {
        setIsLoading(false);
      }
    };
    fetchRecords();
  }, [doctorId]);

  const filteredRecords = useMemo(() => {
    if (!searchTerm) return records;
    return records.filter(record =>
      record.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.patient.medicalRecordNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [records, searchTerm]);

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Rekam Medis Pasien Saya</h1>
          <p className="text-slate-500 text-sm">Rekam medis dari pasien yang telah Anda periksa</p>
        </div>
        <div className="flex gap-3">
          <div className="relative w-full md:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-slate-400" />
            </div>
            <Input
              placeholder="Cari nama atau No. RM..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="pl-10 bg-white border-slate-200 focus:border-teal focus:ring-teal/20 transition-all rounded-xl"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/dokter/riwayat')}
            className="flex items-center gap-2 border-slate-200 hover:bg-navy hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Button>
        </div>
      </div>

      {/* Records List Card */}
      <Card className="bg-white border-none shadow-xl rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-navy/5 border-b border-navy/10">
                <th className="p-4 pl-6 font-semibold text-navy text-sm w-16">No.</th>
                <th className="p-4 font-semibold text-navy text-sm">Nama Pasien</th>
                <th className="p-4 font-semibold text-navy text-sm">No. RM</th>
                <th className="p-4 font-semibold text-navy text-sm">Diagnosis</th>
                <th className="p-4 font-semibold text-navy text-sm text-right pr-6">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-teal"></div>
                      Memuat data rekam medis...
                    </div>
                  </td>
                </tr>
              ) : filteredRecords.length > 0 ? (
                filteredRecords.map((record, index) => (
                  <tr
                    key={record.id}
                    className="border-b border-slate-50 hover:bg-sky-blue/5 transition-colors group"
                  >
                    <td className="p-4 pl-6 text-slate-500 font-medium">{index + 1}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-teal/10 flex items-center justify-center text-teal font-bold text-xs">
                          {record.patient.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-navy group-hover:text-teal transition-colors">{record.patient.name}</span>
                      </div>
                    </td>
                    <td className="p-4 text-slate-500 font-mono text-sm">{record.patient.medicalRecordNo}</td>
                    <td className="p-4 text-slate-600">{record.diagnosis}</td>
                    <td className="p-4 text-right pr-6">
                      <button
                        onClick={() => setSelectedRecordId(record.patient.id)}
                        className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-white border border-slate-200 text-slate-600 text-sm font-medium hover:bg-teal hover:text-white hover:border-teal transition-all shadow-sm hover:shadow-md active:scale-95"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Lihat Detail
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-500">
                    Tidak ada data rekam medis yang ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Modal for Record Detail */}
      {selectedRecordId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-navy/20 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-5xl h-[85vh] rounded-2xl bg-white shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 border border-white/20">
            {/* Modal Header */}
            <div className="flex justify-between items-center bg-navy p-5 text-white shadow-md z-10">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-200" />
                </div>
                <div>
                  <h2 className="text-lg font-bold">Rekam Medis Pasien</h2>
                  <p className="text-xs text-white/70">Detail riwayat pemeriksaan dan pengobatan</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedRecordId(null)}
                className="text-white/70 hover:text-white hover:bg-white/10 rounded-full p-2 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto bg-slate-50 p-6 custom-scrollbar">
              <PatientHistoryViewer patientId={selectedRecordId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}