import { useEffect, useState, useMemo } from "react";
import { listPatients } from "/src/api/api.js";
import { PatientHistoryViewer } from "/src/components/features/PatientHistoryViewer";
import { Card, CardContent, CardHeader, CardTitle } from "/src/components/ui/card";
import { Input } from "/src/components/ui/input";
import { toast } from "sonner";

export default function DokterHistoryPage() {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const data = await listPatients();
        setPatients(data);
        // Don't select any patient by default, let user choose
      } catch (error) {
        toast.error(error.message ?? "Gagal memuat daftar pasien");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPatients();
  }, []);

  const filteredPatients = useMemo(() => {
    return patients.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.medicalRecordNo.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [patients, searchTerm]);

  return (
    <div className="space-y-6">
      {/* Patient List Card */}
      <Card className="bg-white border border-navy/10 shadow-md">
        <CardHeader className="bg-beige border-b border-navy/10 rounded-t-xl">
          <CardTitle className="text-lg font-bold text-navy">Daftar Pasien</CardTitle>
          <Input
            placeholder="Cari nama atau no. RM..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="mt-2 bg-white border-navy/20"
          />
        </CardHeader>
        <CardContent className="p-6 pt-4">
          {isLoading ? (
            <p className="text-sm text-center text-navy/70">Memuat...</p>
          ) : (
            <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredPatients.map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => setSelectedPatientId(p.id)}
                    className={`w-full text-left p-3 rounded-md transition-colors ${selectedPatientId === p.id ? 'bg-teal text-white' : 'hover:bg-sky-blue/50 text-navy'}`}
                  >
                    <p className="font-semibold">{p.name}</p>
                    <p className="text-xs opacity-80">{p.medicalRecordNo}</p>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Modal for Patient History */}
      {selectedPatientId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-4xl rounded-lg bg-white shadow-xl overflow-hidden">
            <div className="flex justify-between items-center bg-beige border-b border-navy/10 p-4">
              <h2 className="text-lg font-bold text-navy">Rekam Medis Pasien</h2>
              <button
                onClick={() => setSelectedPatientId(null)}
                className="text-navy hover:text-white hover:bg-navy rounded-full p-1"
              >
                ✕
              </button>
            </div>
            <div className="overflow-y-auto max-h-[70vh]">
              <PatientHistoryViewer patientId={selectedPatientId} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
