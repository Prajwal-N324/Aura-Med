"use client";

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Send, Zap, Activity, Trash2, ChevronRight } from 'lucide-react';
import Image from 'next/image';

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
    { role: "Dr", text: "How will increasing dosage to 200mg affect renal clearance?" },
    { role: "XAI", text: "Simulated results indicate a 15% increase in serum concentration. Renal stress marker predicted at 1.4 mg/dL.", color: "text-cyan-400" },
  ]);

  const addDrug = () => {
    if (drugs.length >= 5) return;
    const newId = Date.now();
    const drugNames = ['Meropenem', 'Heparin', 'Insulin', 'Dopamine'];
    setDrugs([...drugs, { 
      id: newId, 
      name: drugNames[drugs.length - 1] || 'New Drug', 
      dose: 100, 
      color: DRUG_COLORS[drugs.length % DRUG_COLORS.length] 
    }]);
  };

  const updateDose = (id: number, dose: number) => {
    setDrugs(drugs.map(d => d.id === id ? { ...d, dose } : d));
  };

  const removeDrug = (id: number) => {
    setDrugs(drugs.filter(d => d.id !== id));
  };

  // Calculate dynamic PK data based on all drugs
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
    <div className="flex flex-col h-screen p-6 gap-6 bg-[radial-gradient(circle_at_center,#0a2333_0%,#05111a_100%)] overflow-hidden">
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
            <div className="w-2 h-2 rounded-full bg-cyan-400" /> LIVE SYNCHRONIZATION
          </span>
          <span className="opacity-40">{new Date().toLocaleTimeString()}</span>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_1.8fr_1fr] gap-6 overflow-hidden">
        
        {/* Left: PK & Dosage */}
        <div className="flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
          <section className="glass-card p-6 flex flex-col h-[400px]">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Multi-Drug Pharmacokinetics
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
                  <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} label={{ value: 'Hours', position: 'insideBottom', offset: -5, fontSize: 8, fill: 'white', opacity: 0.4 }} />
                  <YAxis stroke="rgba(255,255,255,0.3)" fontSize={10} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.9)', border: '1px solid rgba(125,249,255,0.2)', borderRadius: '12px' }}
                    itemStyle={{ fontSize: '10px' }}
                  />
                  {/* Human Body Reaction Curve - Distinct White/Ghost Color */}
                  <Area type="monotone" dataKey="reaction" stroke="#ffffff" strokeWidth={2} fillOpacity={1} fill="url(#colorReaction)" name="Body Response" />
                  
                  {/* Dynamic Drug Curves */}
                  {drugs.map(drug => (
                    <Area 
                      key={drug.id}
                      type="monotone" 
                      dataKey={`drug_${drug.id}`} 
                      stroke={drug.color} 
                      fillOpacity={0} 
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name={drug.name}
                    />
                  ))}
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="glass-card p-6 flex-1">
            <h3 className="text-[10px] font-bold text-white/40 uppercase tracking-widest mb-4 border-b border-white/5 pb-2">
              Multi-Drug Dosage Simulator
            </h3>
            <div className="space-y-4">
              <AnimatePresence>
                {drugs.map((drug) => (
                  <motion.div 
                    key={drug.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/5 group"
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold tracking-widest uppercase" style={{ color: drug.color }}>{drug.name}</span>
                      <button onClick={() => removeDrug(drug.id)} className="text-white/20 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <input 
                        type="range" 
                        min="0" 
                        max="500" 
                        value={drug.dose} 
                        onChange={(e) => updateDose(drug.id, parseInt(e.target.value))}
                        className="flex-1 accent-cyan-400 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                        style={{ accentColor: drug.color }}
                      />
                      <span className="text-[10px] font-mono w-12 text-right">{drug.dose}mg</span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <button 
                onClick={addDrug}
                disabled={drugs.length >= 5}
                className="w-full py-4 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-cyan-400/10 hover:border-cyan-400/30 transition-all flex items-center justify-center gap-2"
              >
                <Plus size={14} /> Add Multiple Drugs
              </button>
            </div>
          </section>
        </div>

        {/* Center: Anatomy Viz - FULL HEIGHT */}
        <div className="relative glass-card bg-black/20 overflow-hidden group">
           <div className="absolute top-6 left-6 z-10">
              <div className="text-[10px] font-bold text-cyan-400/60 uppercase tracking-[0.5em]">Anatomical State</div>
              <div className="text-2xl font-black">STABLE</div>
           </div>
           
           <div className="w-full h-full relative p-12">
             <motion.div 
                animate={{ opacity: [0.6, 0.8, 0.6], scale: [1, 1.01, 1] }}
                transition={{ repeat: Infinity, duration: 8 }}
                className="w-full h-full relative"
              >
                <Image src="/body-mesh.png" alt="Body" fill className="object-contain hologram-glow" priority />
              </motion.div>
              
              {/* Hover Points */}
              <AnatomyPoint top="20%" left="50%" label="CNS" status="NORMAL" />
              <AnatomyPoint top="40%" left="42%" label="PULMONARY" status="RECOVERY" color="bg-yellow-500" />
              <AnatomyPoint top="50%" left="52%" label="CARDIO" status="STABILIZED" color="bg-cyan-500" />
              <AnatomyPoint top="70%" left="45%" label="RENAL" status="STRAIN" color="bg-red-500" />
           </div>

           <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <div className="text-[8px] font-mono text-white/20">BIO-TWIN ID: #AURA-492-X-99</div>
              <div className="flex gap-2">
                <div className="w-12 h-1 bg-cyan-400/40 rounded-full" />
                <div className="w-12 h-1 bg-white/10 rounded-full" />
                <div className="w-12 h-1 bg-white/10 rounded-full" />
              </div>
           </div>
        </div>

        {/* Right: XAI Reasoning Feed */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <section className="glass-card flex-1 flex flex-col bg-black/40 border-cyan-400/10">
             <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <h3 className="text-[10px] font-bold tracking-[0.2em] uppercase">XAI Reasoning Feed</h3>
                </div>
                <Zap size={14} className="text-cyan-400" />
             </div>
             
             <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
               {chatMessages.map((msg, i) => (
                 <motion.div 
                   key={i}
                   initial={{ opacity: 0, x: 10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="space-y-1"
                 >
                   <div className="text-[9px] font-bold uppercase tracking-widest opacity-40">{msg.role}</div>
                   <p className={`text-[11px] leading-relaxed ${msg.color || 'text-white/70'} font-mono`}>
                     {msg.text}
                   </p>
                 </motion.div>
               ))}
             </div>

             <div className="p-6 pt-0">
               <div className="relative">
                 <input 
                   type="text" 
                   placeholder="Ask Intelligence Engine..." 
                   className="w-full bg-black/60 border border-white/10 rounded-xl py-4 px-6 text-[10px] outline-none focus:border-cyan-400/50 transition-all"
                 />
                 <button className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 hover:text-white transition-colors">
                   <Send size={16} />
                 </button>
               </div>
             </div>
          </section>

          <section className="glass-card p-6 h-[200px] bg-cyan-400/5 border-cyan-400/20">
             <h3 className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest mb-3 flex items-center gap-2">
               <Activity size={12} /> Predictive Impact
             </h3>
             <div className="space-y-3">
               <PredictiveStat label="Bio-Availability" value="88%" trend="up" />
               <PredictiveStat label="Toxicity Risk" value="12%" trend="down" />
               <PredictiveStat label="Clearance Rate" value="0.8 L/h" trend="stable" />
             </div>
          </section>
        </div>
      </div>

      {/* Simplified Bottom Nav */}
      <nav className="flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full px-6">
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-[10px] font-bold text-cyan-400 hover:bg-cyan-400/30 transition-all">BACK TO DASHBOARD</button>
          <button onClick={() => onNavigate?.('patients')} className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest transition-all">Patient Reports</button>
          <button onClick={() => onNavigate?.('alerts')} className="px-6 py-2 hover:bg-white/5 rounded-full text-[10px] font-bold text-white/40 uppercase tracking-widest transition-all">Live Alerts</button>
        </div>
        
        <button onClick={onBack} className="px-8 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-widest hover:bg-red-500/20 transition-all">Terminate Session</button>
      </nav>
    </div>
  );
}

function AnatomyPoint({ top, left, label, status, color = "bg-cyan-500" }: any) {
  return (
    <div className="absolute z-20" style={{ top, left }}>
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
