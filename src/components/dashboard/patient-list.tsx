"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Activity, Search, Database, ShieldCheck } from 'lucide-react';
import Image from 'next/image';

export default function PatientList({ onBack }: { onBack: () => void }) {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
    
    async function fetchPatients() {
      const { data } = await supabase
        .from('patients')
        .select(`
          *,
          vitals (
            heart_rate,
            blood_pressure_sys,
            blood_pressure_dia,
            temperature
          )
        `)
        .order('created_at', { ascending: false })
        .limit(15);

      if (data) setPatients(data);
      setLoading(false);
    }

    fetchPatients();
  }, []);

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      {/* Header with Navigation */}
      <header className="flex justify-between items-end border-b border-white/5 pb-6">
        <div className="space-y-4">
          <button onClick={onBack} className="px-6 py-2 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all uppercase tracking-[0.2em] text-white/40">
            ← Neural Dashboard
          </button>
          <div className="flex items-center gap-4">
             <div className="p-3 bg-cyan-400/10 rounded-xl border border-cyan-400/20">
               <Activity className="text-cyan-400" size={24} />
             </div>
             <div>
               <h1 className="text-2xl font-black tracking-[0.1em] uppercase">Clinical Registry</h1>
               <p className="text-[10px] text-white/40 uppercase tracking-[0.4em]">Biometric Database // Live Sync</p>
             </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="px-4 py-2 bg-green-500/10 border border-green-500/20 rounded-lg flex items-center gap-2">
            <ShieldCheck size={12} className="text-green-500" />
            <span className="text-[10px] font-bold text-green-500 uppercase tracking-widest">Encrypted</span>
          </div>
        </div>
      </header>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div 
            key="loader"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-[400px] flex flex-col items-center justify-center gap-4 border border-dashed border-white/10 rounded-3xl bg-white/[0.02]"
          >
            <div className="relative w-12 h-12">
               <div className="absolute inset-0 border-2 border-cyan-400/20 rounded-full" />
               <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin" />
            </div>
            <div className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.5em] animate-pulse">Scanning Bio-Grid...</div>
          </motion.div>
        ) : (
          <motion.div 
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {patients.map((patient, i) => (
              <motion.div 
                key={patient.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }} // Fast sequence animation
                className="glass-card p-5 group hover:bg-cyan-400/[0.03] hover:border-cyan-400/30 transition-all border-white/5 flex items-center gap-5 cursor-pointer"
              >
                {/* Profile Avatar */}
                <div className="w-14 h-14 rounded-2xl bg-black/60 border border-white/10 overflow-hidden relative group-hover:border-cyan-400/50 transition-colors">
                  <Image 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.mrn}`} 
                    alt={patient.first_name}
                    fill
                    className="grayscale group-hover:grayscale-0 transition-all duration-500 p-1"
                  />
                </div>

                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-sm tracking-tight text-white group-hover:text-cyan-400 transition-colors">{patient.first_name} {patient.last_name}</h3>
                      <p className="text-[9px] text-white/30 uppercase tracking-[0.2em] mt-0.5">ID: {patient.mrn} • Age {currentYear - new Date(patient.date_of_birth).getFullYear()}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex items-center gap-4">
                    <MiniMetric label="HR" value={patient.vitals?.[0]?.heart_rate || '--'} color="text-cyan-400" />
                    <div className="w-[1px] h-4 bg-white/5" />
                    <MiniMetric label="BP" value={patient.vitals?.[0]?.blood_pressure_sys || '--'} color="text-red-400" />
                    <div className="w-[1px] h-4 bg-white/5" />
                    <MiniMetric label="TEMP" value={patient.vitals?.[0]?.temperature || '--'} color="text-yellow-400" />
                  </div>
                </div>

                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronRightIcon className="text-cyan-400" size={16} />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MiniMetric({ label, value, color }: any) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-[8px] font-bold text-white/20 uppercase tracking-tighter">{label}</span>
      <span className={`text-[10px] font-mono font-bold ${color}`}>{value}</span>
    </div>
  );
}

function ChevronRightIcon({ className, size }: any) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
