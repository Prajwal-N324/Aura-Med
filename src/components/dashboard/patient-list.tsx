"use client";

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import { Activity, Heart, Thermometer, Droplets } from 'lucide-react';
import Image from 'next/image';

export default function PatientList() {
  const [patients, setPatients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPatients() {
      const { data, error } = await supabase
        .from('patients')
        .select(`
          *,
          vitals (
            heart_rate,
            blood_pressure_sys,
            blood_pressure_dia,
            temperature,
            recorded_at
          )
        `)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) setPatients(data);
      setLoading(false);
    }

    fetchPatients();
  }, []);

  if (loading) return <div className="p-10 text-cyan-400 animate-pulse">Scanning Bio-Grid...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-6">
      <h1 className="text-xl font-bold tracking-[0.3em] uppercase text-white/60 mb-8 flex items-center gap-3">
        <Activity className="text-cyan-400" /> Patient List & Details
      </h1>

      <div className="space-y-4">
        {patients.map((patient, i) => (
          <motion.div 
            key={patient.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card p-4 hover:bg-white/5 cursor-pointer transition-colors border-white/5 flex items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-16 h-16 rounded-xl bg-black/40 border border-white/10 overflow-hidden relative grayscale hover:grayscale-0 transition-all">
               <Image 
                src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.mrn}`} 
                alt={patient.first_name}
                fill
               />
            </div>

            {/* Basic Info */}
            <div className="flex-1">
              <h3 className="font-bold text-sm tracking-wide">{patient.first_name} {patient.last_name}</h3>
              <div className="text-[10px] text-white/40 uppercase tracking-widest mt-1">
                ID: {patient.mrn} | AGE: {new Date().getFullYear() - new Date(patient.date_of_birth).getFullYear()}
              </div>
            </div>

            {/* Sparklines Placeholder / Vitals */}
            <div className="flex gap-8 items-center pr-4">
              <VitalMini label="Heart" value={patient.vitals?.[0]?.heart_rate || '--'} unit="BPM" color="text-cyan-400" />
              <VitalMini label="BP" value={patient.vitals?.[0]?.blood_pressure_sys || '--'} unit="SYS" color="text-red-400" />
              <VitalMini label="Temp" value={patient.vitals?.[0]?.temperature || '--'} unit="°C" color="text-yellow-400" />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function VitalMini({ label, value, unit, color }: any) {
  return (
    <div className="flex flex-col items-center min-w-[60px]">
      <span className="text-[8px] uppercase tracking-tighter text-white/40 mb-1">{label}</span>
      <div className={`text-sm font-bold ${color}`}>{value}</div>
      <div className="w-12 h-4 mt-1 relative">
         <svg className="w-full h-full" viewBox="0 0 100 40">
           <path 
             d="M0 20 L10 20 L15 5 L25 35 L30 20 L100 20" 
             fill="none" 
             stroke="currentColor" 
             strokeWidth="2"
             className={color}
           />
         </svg>
      </div>
    </div>
  );
}
