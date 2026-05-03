"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis } from 'recharts';
import { Activity, Shield, AlertCircle, Heart, Brain, Droplets, Thermometer, LogOut, Home, FileText, Users, Bell, Settings } from 'lucide-react';
import Image from 'next/image';

const MOCK_WAVEFORM = Array.from({ length: 40 }, (_, i) => ({
  time: i,
  val: 50 + Math.sin(i / 2) * 20 + Math.random() * 10
}));

export default function CriticalDashboard({ onBack }: { onBack: () => void }) {
  const [time, setTime] = useState(new Date().toLocaleTimeString([], { hour12: false }));

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date().toLocaleTimeString([], { hour12: false })), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-screen w-screen bg-[#050c12] text-cyan-50/90 font-sans overflow-hidden flex flex-col p-4 gap-4 relative">
      {/* BACKGROUND DEPTH */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(12,45,64,0.3)_0%,transparent_70%)] pointer-events-none" />

      {/* TOP HEADER */}
      <header className="flex justify-between items-center px-8 py-2 bg-gradient-to-b from-white/5 to-transparent border-x border-t border-white/10 rounded-t-3xl">
        <div className="flex items-center gap-3">
          <div className="p-1.5 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
            <Shield className="text-cyan-400" size={20} />
          </div>
          <div className="text-[10px] font-black tracking-[0.3em] uppercase opacity-60">H.H.C. HOSPITAL</div>
        </div>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-4 text-[11px] font-black tracking-[0.4em] uppercase text-white/80">
          <span className="opacity-40">Critical Care Unit</span>
          <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#7df9ff]" />
          <span>Live Monitoring</span>
        </div>
        <div className="text-xl font-mono font-bold tracking-tighter text-white/90">{time}</div>
      </header>

      {/* MAIN CONTENT GRID */}
      <div className="flex-1 grid grid-cols-[320px_1fr_320px] gap-6 min-h-0">
        
        {/* LEFT COLUMN: PATIENT & PROTOCOLS */}
        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Patient Profile */}
          <section className="glass-card p-6 bg-black/40 border-white/5 space-y-4">
            <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Patient Profile</h3>
            <div className="flex gap-4">
              <div className="w-16 h-16 rounded-xl bg-cyan-400/5 border border-cyan-400/20 relative overflow-hidden">
                <Image src="https://api.dicebear.com/7.x/avataaars/svg?seed=Patel" alt="A. Patel" fill className="p-1 grayscale contrast-125" />
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight uppercase">A. Patel, 38y</h2>
                <div className="text-[9px] text-white/40 font-bold uppercase tracking-widest mt-0.5">ID: 7721</div>
                <div className="text-[9px] text-red-400 font-bold uppercase tracking-widest mt-1">Status: <span className="animate-pulse">Acute Care</span></div>
              </div>
            </div>
            <button className="w-full py-2.5 bg-cyan-400/10 border border-cyan-400/30 rounded-xl text-[9px] font-black text-cyan-400 tracking-[0.3em] uppercase hover:bg-cyan-400/20 transition-all">
              Acute Care
            </button>
          </section>

          {/* Active Alerts */}
          <section className="glass-card p-6 bg-black/40 border-white/5 flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-4">
               <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Active Alerts</h3>
               <button className="text-white/20"><AlertCircle size={14} /></button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2 scrollbar-hide">
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-3 animate-pulse">
                <AlertCircle className="text-red-500" size={14} />
                <span className="text-[10px] font-black text-red-400 uppercase tracking-widest">Critical: Cardiac</span>
              </div>
            </div>
          </section>

          {/* Treatment Protocol */}
          <section className="glass-card p-6 bg-black/40 border-white/5 h-[220px]">
             <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-4">Treatment Protocol</h3>
             <div className="space-y-2">
               {['Pradroctonal', 'Treatment Protocol', 'Treatment Protocol', 'Treatment Protocol'].map((item, i) => (
                 <div key={i} className="p-2.5 bg-white/[0.03] border border-white/5 rounded-xl flex justify-between items-center group cursor-pointer hover:bg-white/5 transition-all">
                    <span className="text-[10px] font-bold text-white/60 tracking-tight group-hover:text-cyan-400">{item}</span>
                    <ChevronRightIcon size={12} className="text-white/20 group-hover:text-cyan-400" />
                 </div>
               ))}
             </div>
          </section>
        </div>

        {/* CENTER COLUMN: HOLOGRAPHIC MIRROR */}
        <div className="relative flex flex-col items-center justify-center">
          {/* ANATOMICAL LABELS LEFT */}
          <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-20 z-20">
            <AnatomicLabel label="Brain" align="right" />
            <AnatomicLabel label="Lungs" align="right" />
            <AnatomicLabel label="Liver" align="right" />
            <AnatomicLabel label="Brain" align="right" />
          </div>

          {/* THE 3D BODY MESH */}
          <div className="relative w-full h-full flex items-center justify-center">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(125,249,255,0.1)_0%,transparent_60%)] pointer-events-none" />
            <motion.div 
              animate={{ 
                rotateY: [0, 360],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ 
                rotateY: { repeat: Infinity, duration: 30, ease: "linear" },
                opacity: { repeat: Infinity, duration: 4 }
              }}
              className="relative w-full h-[85%] preserve-3d"
            >
              <Image 
                src="/body-mesh.png" 
                alt="BioTwin" 
                fill 
                className="object-contain hologram-glow grayscale contrast-150 brightness-150 mix-blend-screen"
                priority 
              />
              {/* Pulsing Heart Overlay */}
              <div className="absolute top-[42%] left-1/2 -translate-x-1/2 w-8 h-8 bg-red-500/40 rounded-full blur-xl animate-ping" />
              <Heart className="absolute top-[43%] left-1/2 -translate-x-1/2 text-red-500 animate-pulse" size={24} fill="currentColor" />
            </motion.div>
            
            {/* CALLOUT LINES & VITALS (RIGHT SIDE) */}
            <div className="absolute right-10 top-[15%] space-y-16 z-20">
              <VitalsCallout label="HEART RATE" value="115 BPM" sub="Pulsing Red" color="red" alert="ALARM: CARDIAC DISTRESS" />
              <VitalsCallout label="OXYGEN SATS" value="91%" sub="Pulsing Orange" color="orange" />
              <VitalsCallout label="BP" value="145/95" sub="Stable" color="cyan" />
              <VitalsCallout label="TEMP" value="37.8 C" sub="Stable" color="white" />
            </div>
          </div>

          {/* SCANNING PLATFORM */}
          <div className="absolute bottom-10 w-64 h-16 bg-gradient-to-t from-cyan-400/20 to-transparent border-b-4 border-cyan-400/40 rounded-[100%] blur-[2px] opacity-40" />
        </div>

        {/* RIGHT COLUMN: TELEMETRY & SYSTEM STATUS */}
        <div className="flex flex-col gap-6 overflow-hidden">
          {/* Live Vitals Flow */}
          <section className="glass-card p-6 bg-black/40 border-white/5 flex-1 flex flex-col min-h-0">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">Live Vitals Flow</h3>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                  <div className="w-1 h-1 bg-white/20 rounded-full" />
                </div>
             </div>
             
             <div className="flex-1 space-y-8 overflow-hidden">
                <WaveformChart color="#ef4444" label="HR" value="115" />
                <WaveformChart color="#f97316" label="91%" value="O2" />
                <WaveformChart color="#7df9ff" label="BP" value="145/95" />
             </div>
          </section>

          {/* Organ System Status */}
          <section className="glass-card p-6 bg-black/40 border-white/5 h-[340px]">
             <h3 className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em] mb-6">Organ System Status</h3>
             <div className="space-y-4">
               <OrganStatus label="HEART" status="Red-Critical" color="red" />
               <OrganStatus label="LUNGS" status="Green-Stable" color="green" />
               <OrganStatus label="BRAIN" status="Green-Stable" color="green" />
               <OrganStatus label="LIVER" status="Green-Stable" color="green" />
               <OrganStatus label="STOMACH" status="Green-Stable" color="green" />
             </div>
          </section>
        </div>
      </div>

      {/* BOTTOM NAVIGATION */}
      <footer className="flex justify-center items-center gap-2 p-2 mt-2">
        <div className="flex bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-1 shadow-2xl">
          <NavButton icon={<Home size={14} />} label="Home" active />
          <NavButton icon={<FileText size={14} />} label="Reports" />
          <NavButton icon={<Users size={14} />} label="Patient Flow" />
          <NavButton icon={<Bell size={14} />} label="Alerts" />
          <NavButton icon={<Settings size={14} />} label="Settings" />
        </div>
        <button onClick={onBack} className="ml-4 px-6 py-3 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center gap-2 group hover:bg-red-500/20 transition-all">
          <LogOut size={14} className="text-red-500" />
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest group-hover:text-red-300">Log Out</span>
        </button>
      </footer>
    </div>
  );
}

function AnatomicLabel({ label, align }: any) {
  return (
    <div className={`flex items-center gap-4 ${align === 'right' ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`text-[10px] font-black text-cyan-400/80 uppercase tracking-[0.4em]`}>{label}</div>
      <div className="w-16 h-px bg-cyan-400/30" />
      <div className="w-2 h-2 rounded-full border border-cyan-400/60 flex items-center justify-center">
        <div className="w-1 h-1 bg-cyan-400 rounded-full" />
      </div>
    </div>
  );
}

function VitalsCallout({ label, value, sub, color, alert }: any) {
  const colors: any = {
    red: 'text-red-400',
    orange: 'text-orange-400',
    cyan: 'text-cyan-400',
    white: 'text-white'
  };
  return (
    <div className="flex items-center gap-6 relative">
      <div className="w-2 h-2 rounded-full border border-white/40 flex items-center justify-center">
        <div className="w-1 h-1 bg-white rounded-full" />
      </div>
      <div className="w-20 h-px bg-white/20" />
      <div className="relative">
        <div className="flex flex-col">
          <div className="text-[9px] font-black text-white/40 uppercase tracking-widest">{label}: <span className={colors[color]}>{value}</span></div>
          <div className={`text-[8px] font-bold uppercase tracking-widest mt-0.5 ${colors[color]}`}>{sub}</div>
        </div>
        {alert && (
          <div className="absolute top-[-30px] left-0 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-lg text-[8px] font-black text-red-500 tracking-widest animate-pulse whitespace-nowrap">
            {alert}
          </div>
        )}
      </div>
    </div>
  );
}

function WaveformChart({ color, label, value }: any) {
  const data = useMemo(() => MOCK_WAVEFORM.map(d => ({ ...d, val: d.val + Math.random() * 5 })), []);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-end px-2">
        <div className="text-[10px] font-black uppercase tracking-widest text-white/30">{label}</div>
        <div className="text-sm font-mono font-bold" style={{ color }}>{value}</div>
      </div>
      <div className="h-10 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} isAnimationActive={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function OrganStatus({ label, status, color }: any) {
  const data = useMemo(() => MOCK_WAVEFORM.map(d => ({ ...d, val: 50 + Math.random() * 20 })), []);
  const colorHex = color === 'red' ? '#ef4444' : '#10b981';
  return (
    <div className="flex items-center gap-4 group">
      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: colorHex }} />
      <div className="flex-1">
        <div className="flex justify-between text-[8px] font-black tracking-widest uppercase mb-1">
          <span className="text-white/60">{label}</span>
          <span style={{ color: colorHex }}>{status}</span>
        </div>
        <div className="h-6 w-full opacity-40 group-hover:opacity-100 transition-opacity">
           <ResponsiveContainer width="100%" height="100%">
             <AreaChart data={data}>
               <Area type="monotone" dataKey="val" stroke={colorHex} fill={colorHex} fillOpacity={0.1} dot={false} strokeWidth={1} />
             </AreaChart>
           </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

function NavButton({ icon, label, active }: any) {
  return (
    <button className={`px-6 py-2.5 rounded-xl flex items-center gap-3 transition-all ${
      active ? 'bg-cyan-400/20 border border-cyan-400/40 text-cyan-400' : 'text-white/30 hover:text-white hover:bg-white/5'
    }`}>
      {icon}
      <span className="text-[9px] font-black uppercase tracking-[0.2em]">{label}</span>
    </button>
  );
}

function ChevronRightIcon({ size, className }: any) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="m9 18 6-6-6-6"/>
    </svg>
  );
}
