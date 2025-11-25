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
        // Select the first patient by default if list is not empty
        if (data.length > 0) {
          setSelectedPatientId(data[0].id);
        }
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
    <div className="grid gap-6 lg:grid-cols-[320px,1fr]">
      {/* Patient List */}
      <Card className="bg-white border border-navy/10 shadow-md h-fit">
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

      {/* Patient History Viewer */}
      <div className="h-full">
        {selectedPatientId ? (
          <PatientHistoryViewer patientId={selectedPatientId} />
        ) : (
          <div className="flex items-center justify-center h-full rounded-xl bg-white border border-navy/10 shadow-md border-dashed border-navy/20">
            <p className="text-navy/70">Pilih pasien untuk melihat riwayatnya.</p>
          </div>
        )}
      </div>
    </div>
  );
}
