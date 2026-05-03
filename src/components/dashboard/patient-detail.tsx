"use client";

import { motion } from 'framer-motion';
import { Activity, ArrowLeft, Shield, Thermometer, Heart, Droplets, Calendar, FileText, ClipboardList } from 'lucide-react';
import Image from 'next/image';

export default function PatientDetail({ patient, onBack }: { patient: any, onBack: () => void }) {
  const currentYear = new Date().getFullYear();
  const age = currentYear - new Date(patient.date_of_birth).getFullYear();
  const vitals = patient.vitals?.[0] || { heart_rate: 72, blood_pressure_sys: 120, temperature: 98.6 };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="max-w-6xl mx-auto p-8 space-y-8"
    >
      {/* Header */}
      <header className="flex justify-between items-start">
        <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-cyan-400 transition-colors text-xs font-bold uppercase tracking-widest">
          <ArrowLeft size={16} /> Back to Registry
        </button>
        <div className="flex items-center gap-3 px-4 py-2 bg-cyan-400/10 border border-cyan-400/20 rounded-full">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Live Bio-Sync Active</span>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Patient Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <section className="glass-card p-8 bg-black/40 border-white/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <Shield size={20} className="text-cyan-400/20" />
            </div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-32 h-32 rounded-3xl bg-cyan-400/5 border border-cyan-400/20 p-2 relative">
                <div className="w-full h-full rounded-2xl bg-black/60 overflow-hidden relative border border-white/10">
                  <Image 
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${patient.mrn}`} 
                    alt={patient.first_name}
                    fill
                    className="p-2"
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-black text-white tracking-tight">{patient.first_name} {patient.last_name}</h2>
                <p className="text-[10px] text-white/30 uppercase tracking-[0.4em] mt-1">MRN: {patient.mrn}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 w-full pt-6 border-t border-white/5">
                <ProfileStat label="Age" value={`${age} Yrs`} />
                <ProfileStat label="Gender" value="Male" />
                <ProfileStat label="Blood" value="O+ Positive" />
                <ProfileStat label="Weight" value="74 kg" />
              </div>
            </div>
          </section>

          <section className="glass-card p-6 bg-cyan-400/5 border-cyan-400/20">
             <h3 className="text-[10px] font-black text-cyan-400 uppercase tracking-widest mb-4 flex items-center gap-2">
               <Calendar size={12} /> Upcoming Appointments
             </h3>
             <div className="space-y-3">
               <AppointmentCard date="MAY 15" type="Cardiology Review" dr="Dr. Sarah Abraham" />
               <AppointmentCard date="JUN 02" type="Annual Sync" dr="Aura AI Node-7" />
             </div>
          </section>
        </div>

        {/* Middle & Right: Clinical Data */}
        <div className="lg:col-span-2 space-y-8">
          {/* Live Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <VitalCard icon={<Heart className="text-red-400" />} label="Heart Rate" value={vitals.heart_rate} unit="BPM" color="red" />
            <VitalCard icon={<Activity className="text-cyan-400" />} label="Blood Pressure" value={vitals.blood_pressure_sys} unit="SYS" color="cyan" />
            <VitalCard icon={<Thermometer className="text-yellow-400" />} label="Temperature" value={vitals.temperature} unit="°F" color="yellow" />
            <VitalCard icon={<Droplets className="text-blue-400" />} label="SpO2 Level" value="98" unit="%" color="blue" />
          </div>

          {/* Health Records Navigation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RecordSection 
              title="Medical History" 
              icon={<ClipboardList size={14} className="text-cyan-400" />}
              items={[
                { label: "Hypertension", date: "Diagnosed 2021", status: "Managed" },
                { label: "Type 2 Diabetes", date: "Diagnosed 2019", status: "Critical" },
                { label: "Asthma", date: "Chronic", status: "Stable" }
              ]}
            />
            <RecordSection 
              title="Current Medications" 
              icon={<FileText size={14} className="text-yellow-400" />}
              items={[
                { label: "Metformin", date: "500mg • BID", status: "Active" },
                { label: "Lisinopril", date: "10mg • QD", status: "Active" },
                { label: "Salbutamol", date: "100mcg • PRN", status: "PRN" }
              ]}
            />
          </div>

          {/* Neural Summary */}
          <section className="glass-card p-8 bg-black/40 border-white/5 space-y-4">
            <div className="flex items-center gap-2 text-[10px] font-black text-white/40 uppercase tracking-widest">
              <Zap size={14} className="text-cyan-400 animate-pulse" /> Neural Insight Summary
            </div>
            <p className="text-sm text-white/70 leading-relaxed italic">
              Patient exhibits stable vital patterns with a slight elevation in systolic blood pressure during early morning cycles. **Diabetes management** remains the primary clinical focus. Aura AI recommends a titration of Metformin if HbA1c exceeds 7.2% in the next diagnostic loop.
            </p>
          </section>
        </div>
      </div>
    </motion.div>
  );
}

function ProfileStat({ label, value }: any) {
  return (
    <div className="text-center">
      <div className="text-[8px] text-white/20 font-bold uppercase tracking-widest mb-1">{label}</div>
      <div className="text-xs font-black text-white/80">{value}</div>
    </div>
  );
}

function VitalCard({ icon, label, value, unit, color }: any) {
  const colors: any = {
    red: 'border-red-500/20 bg-red-500/5',
    cyan: 'border-cyan-500/20 bg-cyan-500/5',
    yellow: 'border-yellow-500/20 bg-yellow-500/5',
    blue: 'border-blue-500/20 bg-blue-500/5'
  };
  return (
    <div className={`p-4 rounded-3xl border ${colors[color]} flex flex-col items-center gap-2`}>
      <div className="p-2 bg-black/40 rounded-xl border border-white/5">{icon}</div>
      <div className="text-[8px] text-white/40 font-bold uppercase tracking-widest">{label}</div>
      <div className="flex items-baseline gap-1">
        <span className="text-xl font-black text-white">{value}</span>
        <span className="text-[8px] text-white/30 font-bold">{unit}</span>
      </div>
    </div>
  );
}

function RecordSection({ title, icon, items }: any) {
  return (
    <section className="glass-card p-6 bg-black/40 border-white/5">
      <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4 flex items-center gap-2 border-b border-white/5 pb-4">
        {icon} {title}
      </h3>
      <div className="space-y-4">
        {items.map((item: any, i: number) => (
          <div key={i} className="flex justify-between items-center group">
            <div>
              <div className="text-[11px] font-bold text-white group-hover:text-cyan-400 transition-colors">{item.label}</div>
              <div className="text-[9px] text-white/30 uppercase tracking-widest">{item.date}</div>
            </div>
            <div className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${
              item.status === 'Critical' ? 'bg-red-500/20 text-red-400' : 
              item.status === 'Active' ? 'bg-cyan-500/20 text-cyan-400' : 'bg-white/5 text-white/40'
            }`}>
              {item.status}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function AppointmentCard({ date, type, dr }: any) {
  return (
    <div className="p-3 bg-white/[0.02] border border-white/5 rounded-xl flex items-center gap-4 hover:bg-white/5 transition-all cursor-pointer">
      <div className="text-center bg-cyan-400/10 p-2 rounded-lg border border-cyan-400/20 min-w-[50px]">
        <div className="text-[8px] font-black text-cyan-400 tracking-tighter leading-none mb-1">{date.split(' ')[0]}</div>
        <div className="text-xs font-black text-cyan-400 leading-none">{date.split(' ')[1]}</div>
      </div>
      <div>
        <div className="text-[10px] font-bold text-white tracking-tight">{type}</div>
        <div className="text-[8px] text-white/30 uppercase tracking-widest">{dr}</div>
      </div>
    </div>
  );
}

function Zap({ className, size }: any) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
    </svg>
  );
}
