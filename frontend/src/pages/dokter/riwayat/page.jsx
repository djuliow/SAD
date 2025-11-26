import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MedicalRecordOptions from "./MedicalRecordOptions";
import MyPatientsMedicalRecords from "./MyPatientsMedicalRecords";
import AllMedicalRecords from "./AllMedicalRecords";
import { useAuthStore } from "/src/store/useAuthStore";

export default function DokterHistoryPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  // Extract the doctorId from the user info
  const doctorId = user?.id;

  // Determine which view to show based on the route
  const view = location.pathname.split('/').pop();

  // If the user is on the root /dokter/riwayat path, show the options
  if (location.pathname === '/dokter/riwayat') {
    return <MedicalRecordOptions />;
  }

  // If on a sub-route, show the appropriate view
  switch (view) {
    case 'my-patients':
      return <MyPatientsMedicalRecords doctorId={doctorId} />;
    case 'all':
      return <AllMedicalRecords doctorId={doctorId} />;
    default:
      return <MedicalRecordOptions />;
  }
}
