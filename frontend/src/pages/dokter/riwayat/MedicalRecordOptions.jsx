import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "/src/components/ui/card";
import { FileText, Users, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function MedicalRecordOptions() {
  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-navy">Rekam Medis</h1>
          <p className="text-slate-500 text-sm">Pilih jenis rekam medis yang ingin Anda lihat</p>
        </div>
      </div>

      {/* Options Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Option 1: My Patients Medical Records */}
        <Link to="/dokter/riwayat/my-patients" className="block">
          <Card className="bg-white border-2 border-slate-200 hover:border-teal/50 hover:shadow-lg transition-all cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-teal/10 rounded-lg group-hover:bg-teal/20 transition-colors">
                    <FileText className="w-6 h-6 text-teal" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-navy">Rekam Medis Pasien Saya</CardTitle>
                    <CardDescription className="pt-1">
                      Lihat rekam medis dari pasien yang telah saya periksa
                    </CardDescription>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-teal transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Tampilkan hanya rekam medis pasien yang telah Anda tangani langsung.
              </p>
            </CardContent>
          </Card>
        </Link>

        {/* Option 2: All Medical Records */}
        <Link to="/dokter/riwayat/all" className="block">
          <Card className="bg-white border-2 border-slate-200 hover:border-teal/50 hover:shadow-lg transition-all cursor-pointer h-full group">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-navy/10 rounded-lg group-hover:bg-navy/20 transition-colors">
                    <Users className="w-6 h-6 text-navy" />
                  </div>
                  <div>
                    <CardTitle className="text-lg text-navy">Semua Rekam Medis</CardTitle>
                    <CardDescription className="pt-1">
                      Lihat semua rekam medis dari seluruh pasien
                    </CardDescription>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-slate-400 group-hover:text-navy transition-colors" />
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-slate-600">
                Tampilkan semua rekam medis dari seluruh pasien di klinik.
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}