"use client";

import { useState } from 'react';
import HomeLanding from '@/components/home/landing';
import DoctorDashboard from '@/components/dashboard/main-dashboard';
import PatientList from '@/components/dashboard/patient-list';
import PatientDetail from '@/components/dashboard/patient-detail';
import AlertCommandCenter from '@/components/dashboard/alert-center';
import CriticalDashboard from '@/components/simulation/critical-dashboard';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('landing'); // landing, dashboard, patients, patient_detail, alerts, simulation
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const navigateTo = (view: string) => setCurrentView(view);

  const handlePatientSelect = (patient: any) => {
    setSelectedPatient(patient);
    setCurrentView('patient_detail');
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      {currentView === 'landing' && <HomeLanding onLogin={() => navigateTo('dashboard')} />}
      
      {currentView !== 'landing' && (
        <div className="flex h-screen w-screen bg-black overflow-hidden">
          {currentView === 'dashboard' && <DoctorDashboard onNavigate={navigateTo} />}
          {currentView === 'patients' && <PatientList onBack={() => navigateTo('dashboard')} onSelect={handlePatientSelect} />}
          {currentView === 'patient_detail' && <PatientDetail patient={selectedPatient} onBack={() => navigateTo('patients')} />}
          {currentView === 'alerts' && <AlertCommandCenter onBack={() => navigateTo('dashboard')} />}
          {currentView === 'simulation' && <CriticalDashboard onBack={() => navigateTo('dashboard')} />}
        </div>
      )}
    </div>
  );
}
