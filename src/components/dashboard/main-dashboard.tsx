"use client";

import { motion } from 'framer-motion';
import { Users, AlertTriangle, Settings, ChevronDown, Activity, Zap } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function DoctorDashboard({ onNavigate }: { onNavigate: (view: string) => void }) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-black text-white">
      {/* Sidebar Navigation */}
      <aside className="w-[140px] border-r border-white/10 bg-black/40 backdrop-blur-xl flex flex-col items-center py-10 gap-8">
        <div className="mb-8">
          <Image src="/logo.png" alt="Aura Med" width={40} height={40} className="hologram-glow" />
        </div>
        
        <nav className="flex flex-col gap-6">
          <NavItem icon={<Users size={20} />} label="Patients" onClick={() => onNavigate('patients')} />
          <NavItem icon={<AlertTriangle size={20} />} label="Alerts" badge="!" onClick={() => onNavigate('alerts')} />
          <NavItem icon={<Settings size={20} />} label="Settings" />
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-10 overflow-y-auto">
        {/* Header */}
        <header className="flex justify-end mb-12">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-4 bg-white/5 border border-cyan-400/30 px-5 py-2 rounded-full cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-blue-500 overflow-hidden border border-white/20">
              {/* Placeholder Avatar */}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-bold tracking-wider">DR. EVELYN REED</span>
              <span className="text-[10px] text-cyan-400/60 uppercase tracking-widest">Head Physician</span>
            </div>
            <ChevronDown size={14} className="text-white/40" />
          </motion.div>
        </header>

        {/* Dashboard Cards */}
        <div className="flex flex-wrap gap-8 justify-center">
          {/* Card 1: Bio Twin */}
          <DashboardCard 
            title="BIO TWIN SIMULATION" 
            status="SIM STAT: ACTIVE" 
            buttonLabel="ACTIVATE SIMULATION"
            type="cyan"
            onClick={() => onNavigate('simulation')}
            visual={<div className="w-full h-full bg-[url('/body-mesh.png')] bg-contain bg-center bg-no-repeat opacity-40 hologram-glow" />}
          />

          {/* Card 2: Critical Analysis */}
          <DashboardCard 
            title="CRITICAL ANALYSIS" 
            status="ANALYSIS RUNNING" 
            buttonLabel="START ANALYSIS"
            type="blue"
            visual={
              <div className="w-full h-full flex items-center justify-center">
                 <div className="w-48 h-32 flex items-end gap-1">
                    {[...Array(20)].map((_, i) => (
                      <motion.div 
                        key={i}
                        className="flex-1 bg-blue-400/30 rounded-t-sm"
                        animate={{ height: [10, Math.random() * 80 + 20, 10] }}
                        transition={{ repeat: Infinity, duration: 2, delay: i * 0.1 }}
                      />
                    ))}
                 </div>
              </div>
            }
          />
        </div>
      </main>

      {/* Global Background Radial Gradient */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_30%,#062a3a_0%,#030f18_70%)] -z-10" />
    </div>
  );
}

function NavItem({ icon, label, badge, onClick }: { icon: React.ReactNode, label: string, badge?: string, onClick?: () => void }) {
  return (
    <motion.button 
      whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
      onClick={onClick}
      className="flex flex-col items-center justify-center w-[90px] h-[90px] rounded-2xl bg-white/5 border border-white/10 group relative transition-all"
    >
      <div className="text-white/40 group-hover:text-cyan-400 transition-colors mb-2">
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-widest text-white/40 group-hover:text-white transition-colors">
        {label}
      </span>
      {badge && (
        <div className="absolute top-2 right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold shadow-[0_0_8px_rgba(239,68,68,0.8)]">
          {badge}
        </div>
      )}
    </motion.button>
  );
}

function DashboardCard({ title, status, visual, buttonLabel, type, onClick }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card w-full max-w-[450px] p-10 flex flex-col items-center text-center relative overflow-hidden"
    >
      <h2 className="text-xl font-bold tracking-[0.2em] mb-8">{title}</h2>
      
      <div className="w-full h-64 bg-black/40 rounded-3xl border border-white/5 mb-8 relative flex items-center justify-center overflow-hidden">
        {visual}
        <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 rounded-full border border-white/10 text-[9px] tracking-widest text-white/60">
          {status}
        </div>
      </div>

      <button 
        onClick={onClick}
        className={`w-full py-4 rounded-xl font-bold text-xs tracking-widest transition-all ${
        type === 'cyan' 
          ? 'bg-gradient-to-r from-cyan-400 to-cyan-600 text-black shadow-[0_0_20px_rgba(125,249,255,0.3)] hover:brightness-110' 
          : 'bg-gradient-to-r from-blue-500 to-blue-700 text-white hover:brightness-110'
      }`}>
        {buttonLabel}
      </button>
    </motion.div>
  );
}
