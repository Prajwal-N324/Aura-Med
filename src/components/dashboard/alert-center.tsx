"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { AlertCircle, Zap, Activity, ArrowUpRight } from 'lucide-react';

export default function AlertCommandCenter({ onBack }: { onBack: () => void }) {
  const [criticalPatients, setCriticalPatients] = useState<any[]>([]);

  useEffect(() => {
    async function fetchAlerts() {
      const { data } = await supabase
        .from('patients')
        .select(`
          *,
          vitals (
            heart_rate,
            sp_o2,
            blood_pressure_sys,
            blood_pressure_dia,
            temperature,
            recorded_at
          )
        `)
        .eq('status', 'CRITICAL')
        .order('severity_score', { ascending: false });

      if (data) setCriticalPatients(data);
    }

    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000); // Polling for live updates
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-8 space-y-8">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-[0.2em] text-red-500 flex items-center gap-3">
            <AlertCircle className="animate-pulse" /> ICU COMMAND CENTER
          </h1>
          <p className="text-[10px] text-white/40 uppercase tracking-[0.5em] mt-1">Live Bio-Security Monitoring</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <button onClick={onBack} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-white/10 transition-all mr-4 text-white/40 uppercase tracking-widest">Dashboard</button>
          <StatBox label="Critical" value={criticalPatients.length} color="text-red-500" />
          <StatBox label="Watch" value={3} color="text-yellow-500" />
          <StatBox label="Stable" value={45} color="text-cyan-500" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {criticalPatients.map((patient) => (
            <motion.div 
              key={patient.id}
              layout
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="glass-card border-red-500/30 bg-red-500/5 p-6 space-y-6 group"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-lg">{patient.first_name} {patient.last_name}</h3>
                  <p className="text-xs text-white/40">{patient.gender} • Bed {patient.bed_no}</p>
                </div>
                <div className="px-3 py-1 bg-red-500/20 rounded-full border border-red-500/50 text-[10px] font-bold text-red-400">
                  CRITICAL
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <VitalCard label="HR" value={patient.vitals?.[0]?.heart_rate} unit="BPM" status="rising" />
                <VitalCard label="SpO2" value={patient.vitals?.[0]?.sp_o2} unit="%" status="critical" />
                <VitalCard label="BP" value={`${patient.vitals?.[0]?.blood_pressure_sys}/${patient.vitals?.[0]?.blood_pressure_dia}`} unit="mmHg" status="low" />
                <VitalCard label="TEMP" value={patient.vitals?.[0]?.temperature} unit="°C" status="fever" />
              </div>

              <button className="w-full py-3 bg-red-500 text-black font-bold text-[10px] rounded-lg tracking-widest hover:bg-red-400 transition-colors">
                INITIATE EMERGENCY PROTOCOL
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatBox({ label, value, color }: any) {
  return (
    <div className="glass-card px-6 py-2 flex flex-col items-center min-w-[100px]">
      <span className="text-[10px] uppercase text-white/40">{label}</span>
      <span className={`text-xl font-black ${color}`}>{value}</span>
    </div>
  );
}

function VitalCard({ label, value, unit, status }: any) {
  return (
    <div className="bg-black/40 p-3 rounded-xl border border-white/5">
      <div className="text-[8px] text-white/40 uppercase mb-1">{label}</div>
      <div className="text-lg font-bold">{value} <span className="text-[10px] font-normal opacity-40">{unit}</span></div>
      <div className={`text-[8px] uppercase mt-1 flex items-center gap-1 ${
        status === 'rising' || status === 'fever' || status === 'critical' ? 'text-red-400' : 'text-cyan-400'
      }`}>
        <Zap size={8} /> {status}
      </div>
    </div>
  );
}
