"use client";

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Send, Zap, Activity, Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { getSimulationReasoning } from '@/lib/ai-service';

const INITIAL_DRUGS = [
  { id: 1, name: 'Vancomycin', dose: 150, color: '#7df9ff' },
];

const BASE_PK_DATA = [
  { time: 0, reaction: 0 },
  { time: 1, reaction: 30 },
  { time: 2, reaction: 65 },
  { time: 3, reaction: 90 },
  { time: 4, reaction: 85 },
  { time: 5, reaction: 70 },
  { time: 6, reaction: 55 },
  { time: 8, reaction: 35 },
  { time: 12, reaction: 15 },
];

const DRUG_COLORS = ['#7df9ff', '#ff7d7d', '#7dff8e', '#ffdb7d', '#d47dff'];

export default function BioTwinSimulation({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (view: string) => void }) {
  const [drugs, setDrugs] = useState(INITIAL_DRUGS);
  const [chatMessages, setChatMessages] = useState([
    { role: "XAI", text: "Neural Link established. Monitoring multi-drug interactions...", color: "text-cyan-400" },
  ]);

  const addDrug = async () => {
    if (drugs.length >= 5) return;
    const drugNames = ['Meropenem', 'Heparin', 'Insulin', 'Dopamine'];
    const newDrug = { 
      id: Date.now(), 
      name: drugNames[drugs.length - 1] || 'New Drug', 
      dose: 100, 
      color: DRUG_COLORS[drugs.length % DRUG_COLORS.length] 
    };
    setDrugs([...drugs, newDrug]);
    
    // Gemini 2.0 Reasoning for new drug
    const reason = await getSimulationReasoning([...drugs, newDrug]);
    setChatMessages(prev => [...prev, { role: "GEMINI 2.0 // REASONING", text: reason, color: "text-cyan-400 font-bold" }]);
  };

  const addXAIMessage = (text: string) => {
    setChatMessages(prev => [...prev, { role: "XAI", text, color: "text-cyan-400" }]);
  };

  const updateDose = (id: number, dose: number) => {
    const drug = drugs.find(d => d.id === id);
    if (drug && drug.dose !== dose) {
      setDrugs(drugs.map(d => d.id === id ? { ...d, dose } : d));
      
      // Trigger Gemini reasoning on dose change
      if (Math.abs(drug.dose - dose) > 30) {
        getSimulationReasoning(drugs.map(d => d.id === id ? { ...d, dose } : d)).then(reason => {
          setChatMessages(prev => [...prev, { role: "GEMINI 2.0 // IMPACT", text: reason, color: "text-cyan-400 font-bold" }]);
        });
      }
    }
  };

  const removeDrug = (id: number) => {
    const drug = drugs.find(d => d.id === id);
    setDrugs(drugs.filter(d => d.id !== id));
    addXAIMessage(`Terminating **${drug?.name}** flow. Monitoring redistribution phase.`);
  };

  const pkData = useMemo(() => {
    return BASE_PK_DATA.map(point => {
      const dataPoint: any = { ...point };
      drugs.forEach(drug => {
        dataPoint[`drug_${drug.id}`] = point.reaction * (drug.dose / 150);
      });
      return dataPoint;
    });
  }, [drugs]);

  return (
    <div className="flex flex-col h-screen p-6 gap-6 bg-[radial-gradient(circle_at_center,#0a2333_0%,#05111a_100%)] overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-cyan-400/20 pb-4">
        <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors text-cyan-400">
             <ChevronRight className="rotate-180" size={20} />
           </button>
           <div className="text-xs font-bold tracking-[0.4em] text-cyan-400 uppercase">AURA MED // BIO-DIGITAL TWIN SIMULATION</div>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="text-cyan-400 animate-pulse flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400" /> SYSTEM NORMAL
          </span>
          <span className="opacity-40">{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1fr] gap-6 overflow-hidden">
        
        {/* Left: PK & Dosage */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <section className="glass-card p-6 flex flex-col h-[400px]">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2 flex items-center justify-between">
              Pharmacokinetics <span>(Live)</span>
            </h3>
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={pkData}>
                  <defs>
                    <linearGradient id="colorReaction" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(125,249,255,0.2)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  <Area type="monotone" dataKey="reaction" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorReaction)" name="Body Response" />
                  {[...drugs].reverse().map(drug => (
                    <Area key={drug.id} type="monotone" dataKey={`drug_${drug.id}`} stroke={drug.color} fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" name={drug.name} />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass-card p-6 flex-1">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Drug Interaction Simulator
            </h3>
            <div className="space-y-4">
              <AnimatePresence>
                {drugs.map((drug) => (
                  <motion.div key={drug.id} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, x: -20 }} className="bg-black/40 p-4 rounded-xl border border-white/5 group">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: drug.color }}>{drug.name}</span>
                      <button onClick={() => removeDrug(drug.id)} className="text-white/20 hover:text-red-400 transition-all"><Trash2 size={14} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input type="range" min="0" max="500" value={drug.dose} onChange={(e) => updateDose(drug.id, parseInt(e.target.value))} className="flex-1 accent-cyan-400 h-1 bg-white/10 rounded-full appearance-none cursor-pointer" style={{ accentColor: drug.color }} />
                      <span className="text-[10px] font-mono w-12 text-right">{drug.dose}mg</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              <button onClick={addDrug} disabled={drugs.length >= 5} className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all flex items-center justify-center gap-2">
                <Plus size={14} /> Add Multiple Drugs
              </button>
            </div>
          </section>
        </div>

        {/* Center: DYNAMIC ANATOMY MESH */}
        <div className="relative glass-card bg-black/20 overflow-hidden group">
           {/* Static HUD */}
           <div className="absolute top-6 left-6 z-10">
              <div className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.5em]">Physiological State</div>
              <div className="text-2xl font-black">STABLE</div>
           </div>
           
           <div className="w-full h-full relative flex items-center justify-center">
              {/* Proper Anatomy Image */}
              <div className="w-full h-full relative p-12">
                 <motion.div 
                    animate={{ 
                      opacity: [0.7, 0.9, 0.7],
                      rotateY: [0, 360] 
                    }}
                    transition={{ 
                      opacity: { repeat: Infinity, duration: 4 },
                      rotateY: { repeat: Infinity, duration: 20, ease: "linear" }
                    }}
                    className="w-full h-full relative"
                    style={{ perspective: '1000px' }}
                  >
                    <Image src="/body-mesh.png" alt="Body" fill className="object-contain hologram-glow grayscale contrast-125 mix-blend-screen" priority />
                  </motion.div>
                  
                  {/* DYNAMIC OVERLAY: Scanning Line */}
                  <motion.div 
                    animate={{ top: ['0%', '100%', '0%'] }}
                    transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                    className="absolute left-0 right-0 h-[2px] bg-cyan-400/40 shadow-[0_0_15px_rgba(125,249,255,0.8)] z-20 pointer-events-none"
                  />

                  {/* DYNAMIC OVERLAY: Floating Data Nodes */}
                  <FloatingNode top="25%" left="48%" />
                  <FloatingNode top="55%" left="52%" />
                  <FloatingNode top="75%" left="46%" />

                  {/* Organ Hotspots */}
                  <AnatomyPoint top="22%" left="50%" label="CNS" status="ACTIVE" />
                  <AnatomyPoint top="42%" left="44%" label="PULMONARY" status="RECOVERY" color="bg-yellow-500" />
                  <AnatomyPoint top="52%" left="52%" label="CARDIO" status="STABLE" color="bg-cyan-500" />
                  <AnatomyPoint top="72%" left="46%" label="RENAL" status="STRAIN" color="bg-red-500" />
              </div>
           </div>
        </div>

        {/* Right: XAI Reasoning Feed */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <section className="glass-card flex-1 flex flex-col bg-black/40 border-cyan-400/10">
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">XAI Reasoning (Live)</h3>
                </div>
                <Zap size={14} className="text-cyan-400" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {chatMessages.map((msg, i) => (
                 <motion.div key={i} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="space-y-1">
                   <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">{msg.role}</div>
                   <p className={`text-[11px] leading-relaxed ${msg.color || 'text-white/70'} font-mono`} 
                      dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b class="text-white">$1</b>') }} />
                 </motion.div>
               ))}
             </div>

             <div className="p-6 pt-0 border-t border-white/5">
                <div className="flex items-center gap-3 mt-4">
                  <AlertTriangle size={14} className="text-yellow-500" />
                  <span className="text-[9px] text-white/40 uppercase tracking-widest">Cross-referencing FDA Clinical Data...</span>
                </div>
             </div>
          </section>

          <section className="glass-card p-6 h-[200px] bg-cyan-400/5 border-cyan-400/20">
             <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <Activity size={12} /> Live Interaction
             </h3>
             <div className="space-y-3">
               <PredictiveStat label="Bio-Availability" value="88%" trend="up" />
               <PredictiveStat label="Toxicity Risk" value="12%" trend="down" />
               <PredictiveStat label="Clearance Rate" value="0.8 L/h" trend="stable" />
             </div>
          </section>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full px-6">
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-[10px] font-bold text-cyan-400 hover:bg-cyan-400/30 transition-all">BACK TO DASHBOARD</button>
          <button onClick={() => onNavigate?.('patients')} className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">Patient Reports</button>
          <button onClick={() => onNavigate?.('alerts')} className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest">Live Alerts</button>
        </div>
        <button onClick={onBack} className="px-8 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-widest">Terminate Session</button>
      </nav>
    </div>
  );
}

function FloatingNode({ top, left }: { top: string, left: string }) {
  return (
    <motion.div 
      animate={{ y: [0, -20, 0], opacity: [0.2, 0.6, 0.2] }}
      transition={{ repeat: Infinity, duration: 3 + Math.random() * 2, ease: "easeInOut" }}
      className="absolute w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_10px_#7df9ff]"
      style={{ top, left }}
    />
  );
}

function AnatomyPoint({ top, left, label, status, color = "bg-cyan-500" }: any) {
  return (
    <div className="absolute z-30" style={{ top, left }}>
      <div className={`w-3 h-3 rounded-full ${color} animate-pulse relative`}>
        <div className={`absolute inset-0 rounded-full ${color} opacity-20 scale-[3]`}></div>
      </div>
      <div className="ml-4 -mt-1 bg-black/80 backdrop-blur-md border border-white/10 p-2 rounded flex flex-col min-w-[80px] shadow-2xl">
        <span className="text-[8px] font-bold text-white/40 tracking-widest uppercase">{label}</span>
        <span className={`text-[10px] font-bold ${status === 'CRITICAL' ? 'text-red-400' : (status === 'STRAIN' ? 'text-yellow-400' : 'text-cyan-400')}`}>
          {status}
        </span>
      </div>
    </div>
  );
}

function PredictiveStat({ label, value, trend }: any) {
  return (
    <div className="flex justify-between items-center text-[10px]">
      <span className="text-white/40 uppercase tracking-tight">{label}</span>
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-white">{value}</span>
        <div className={`w-1 h-1 rounded-full ${trend === 'up' ? 'bg-red-400' : (trend === 'down' ? 'bg-cyan-400' : 'bg-white/20')}`} />
      </div>
    </div>
  );
}
