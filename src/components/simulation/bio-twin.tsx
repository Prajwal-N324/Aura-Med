"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Play, Plus, Send, Terminal, Zap, Activity } from 'lucide-react';
import Image from 'next/image';

const initialPkData = [
  { time: 0, conc: 0, predicted: 0 },
  { time: 1, conc: 40, predicted: 45 },
  { time: 2, conc: 80, predicted: 95 },
  { time: 3, conc: 120, predicted: 140 },
  { time: 4, conc: 100, predicted: 125 },
  { time: 5, conc: 70, predicted: 90 },
  { time: 6, conc: 50, predicted: 65 },
  { time: 8, conc: 30, predicted: 40 },
  { time: 12, conc: 10, predicted: 15 },
];

export default function BioTwinSimulation({ onBack }: { onBack: () => void }) {
  const [pkData, setPkData] = useState(initialPkData);
  const [dosage, setDosage] = useState(150);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleDosageChange = (val: number) => {
    setDosage(val);
    // Simulate PK curve shift
    const newData = initialPkData.map(d => ({
      ...d,
      predicted: d.predicted * (val / 150)
    }));
    setPkData(newData);
  };

  return (
    <div className="flex flex-col h-screen p-6 gap-6 bg-[radial-gradient(circle_at_center,#0a2333_0%,#05111a_100%)]">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-cyan-400/20 pb-4">
        <div className="text-xs font-bold tracking-[0.4em] text-cyan-400/60 uppercase">AURA MED // BIO-DIGITAL TWIN</div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-cyan-400 animate-pulse">● LIVE SIMULATION</span>
          <span className="opacity-40">10:32:58</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.5fr_1fr] gap-6 overflow-hidden">
        
        {/* Left: PK & Dosage */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2">
          <div className="glass-card p-6 flex flex-col h-[350px]">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Pharmacokinetic (PK) Curves
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pkData}>
                  <defs>
                    <linearGradient id="colorConc" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7df9ff" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#7df9ff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', border: '1px solid rgba(125,249,255,0.2)' }}
                    itemStyle={{ color: '#7df9ff', fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="predicted" stroke="#7df9ff" fillOpacity={1} fill="url(#colorConc)" />
                  <Area type="monotone" dataKey="conc" stroke="#4da6ff" fillOpacity={0} strokeDasharray="5 5" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Drug Dosage Simulator
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-black/40 p-3 rounded-lg border border-white/5">
                <span className="text-xs font-bold">DRUG A (Vancomycin)</span>
                <input 
                  type="range" 
                  min="0" 
                  max="500" 
                  value={dosage} 
                  onChange={(e) => handleDosageChange(parseInt(e.target.value))}
                  className="accent-cyan-400"
                />
                <span className="text-xs text-cyan-400 font-mono w-12 text-right">{dosage}mg</span>
              </div>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-colors">
                + Add Multiple Dosages
              </button>
            </div>
          </div>
        </div>

        {/* Center: Anatomy Viz & Chat */}
        <div className="flex flex-col gap-6 relative">
          <div className="flex-1 relative flex items-center justify-center">
            <motion.div 
              animate={{ opacity: [0.4, 0.7, 0.4], scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="w-full h-full relative"
            >
              <Image src="/body-mesh.png" alt="Body" fill className="object-contain hologram-glow" />
            </motion.div>
            
            {/* Hover Points */}
            <AnatomyPoint top="25%" left="50%" label="BRAIN" status="STABLE" />
            <AnatomyPoint top="45%" left="45%" label="LUNGS" status="WARNING" color="bg-yellow-500" />
            <AnatomyPoint top="55%" left="50%" label="HEART" status="CRITICAL" color="bg-red-500" />
          </div>

          <div className="glass-card p-6 bg-black/60 border-cyan-400/20">
             <div className="flex items-center gap-2 mb-4">
               <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
               <h3 className="text-xs font-bold tracking-widest uppercase">XAI Reasoning Chatbox</h3>
             </div>
             <div className="h-32 overflow-y-auto mb-4 space-y-3 pr-2 scrollbar-hide">
               <ChatMessage role="Dr" text="How will increasing dosage to 200mg affect renal clearance?" />
               <ChatMessage role="XAI" text="Simulated results indicate a 15% increase in serum concentration. Renal stress marker predicted at 1.4 mg/dL." color="text-cyan-400" />
             </div>
             <div className="relative">
               <input 
                 type="text" 
                 placeholder="Ask XAI a question..." 
                 className="w-full bg-black/60 border border-white/10 rounded-full py-3 px-6 text-xs outline-none focus:border-cyan-400/50"
               />
               <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-cyan-400 hover:text-white transition-colors">
                 <Send size={16} />
               </button>
             </div>
          </div>
        </div>

        {/* Right: Live Vitals & Terminal */}
        <div className="flex flex-col gap-6 overflow-y-auto pl-2">
          <div className="glass-card p-6">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Live Vitals Flow
            </h3>
            <div className="flex flex-col items-center">
              <div className="text-5xl font-black text-cyan-400 mb-2">72</div>
              <div className="text-[10px] text-white/40 uppercase tracking-[0.3em]">Beats Per Minute</div>
              <div className="w-full h-24 mt-6">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={initialPkData}>
                    <Line type="stepAfter" dataKey="conc" stroke="#7df9ff" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="glass-card p-6 bg-black flex-1 flex flex-col font-mono text-[10px]">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Simulation Terminal
            </h3>
            <div className="flex-1 space-y-2 opacity-60 overflow-y-auto scrollbar-hide">
              <p>XAI // INITIALIZING PK-3.0 ENGINE...</p>
              <p className="text-cyan-400">STATUS: NEURAL WEIGHTS LOADED</p>
              <p>GEMINI // CROSS-REFERENCING LIVER CLEARANCE...</p>
              <p className="text-yellow-400">WARNING: HEPATIC STRAIN DETECTED</p>
              <p>ADJUSTING PREDICTED CURVE BY +12%...</p>
              <p>SESSION ID: AURA-992-X</p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full px-6">
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-[10px] font-bold text-cyan-400 hover:bg-cyan-400/30 transition-all">BACK TO DASHBOARD</button>
          <button className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40">REPORTS</button>
          <button className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40">ALERTS</button>
        </div>
        <div className="flex-1 max-w-md px-10">
          <div className="relative">
             <Terminal size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-400/40" />
             <input 
               type="text" 
               placeholder="XAI TERMINAL: TYPE A COMMAND..." 
               className="w-full bg-black/40 border border-white/10 rounded-full py-2 px-10 text-[10px] outline-none"
             />
          </div>
        </div>
        <button className="px-6 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400">LOG OUT</button>
      </nav>
    </div>
  );
}

function AnatomyPoint({ top, left, label, status, color = "bg-cyan-500" }: any) {
  return (
    <div className="absolute" style={{ top, left }}>
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse relative`}>
        <div className={`absolute inset-0 rounded-full ${color} opacity-20 scale-[3]`}></div>
      </div>
      <div className="ml-4 -mt-1 bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded flex flex-col min-w-[80px]">
        <span className="text-[8px] font-bold text-white/40 tracking-widest">{label}</span>
        <span className={`text-[10px] font-bold ${status === 'CRITICAL' ? 'text-red-400' : (status === 'WARNING' ? 'text-yellow-400' : 'text-cyan-400')}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function ChatMessage({ role, text, color = "text-white/60" }: any) {
  return (
    <div className="text-[11px] leading-relaxed">
      <span className="font-bold uppercase tracking-wider text-white mr-2">{role}:</span>
      <span className={color}>{text}</span>
    </div>
  );
}
