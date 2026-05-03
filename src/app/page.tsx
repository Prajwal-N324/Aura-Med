"use client";

import { useState } from 'react';
import HomeLanding from '@/components/home/landing';
import DoctorDashboard from '@/components/dashboard/main-dashboard';
import PatientList from '@/components/dashboard/patient-list';
import AlertCommandCenter from '@/components/dashboard/alert-center';
import BioTwinSimulation from '@/components/simulation/bio-twin';

export default function App() {
  // Navigation State
  const [currentView, setCurrentView] = useState('landing'); // landing, dashboard, patients, alerts, simulation

  const navigateTo = (view: string) => setCurrentView(view);

  return (
    <div className="h-screen w-screen overflow-hidden">
      {currentView === 'landing' && <HomeLanding onLogin={() => navigateTo('dashboard')} />}
      
      {currentView !== 'landing' && (
        <div className="flex h-screen w-screen bg-black overflow-hidden">
          {currentView === 'dashboard' && <DoctorDashboard onNavigate={navigateTo} />}
          {currentView === 'patients' && <PatientList onBack={() => navigateTo('dashboard')} />}
          {currentView === 'alerts' && <AlertCommandCenter onBack={() => navigateTo('dashboard')} />}
          {currentView === 'simulation' && <BioTwinSimulation onBack={() => navigateTo('dashboard')} />}
        </div>
      )}
    </div>
  );
}
