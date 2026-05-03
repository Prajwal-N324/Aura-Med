"use client";

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Plus, Send, Zap, Activity, Trash2, ChevronRight, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { getSimulationReasoning } from '@/lib/ai-service';

const DRUG_COLORS = ['#7df9ff', '#ff3366', '#ffcc00', '#00ffcc', '#cc00ff'];

export default function BioTwinSimulation({ onBack, onNavigate }: { onBack: () => void, onNavigate?: (view: string) => void }) {
  const [drugs, setDrugs] = useState([
    { id: 1, name: 'Vancomycin', dose: 150, color: '#7df9ff' },
  ]);
  
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
    const updatedDrugs = [...drugs, newDrug];
    setDrugs(updatedDrugs);
    
    // Gemini 2.0 Reasoning for new drug
    const reason = await getSimulationReasoning(updatedDrugs);
    setChatMessages(prev => [...prev, { role: "GEMINI 2.0 // REASONING", text: reason, color: "text-cyan-400 font-bold" }]);
  };

  const updateDose = (id: number, dose: number) => {
    const drug = drugs.find(d => d.id === id);
    if (drug && drug.dose !== dose) {
      const updatedDrugs = drugs.map(d => d.id === id ? { ...d, dose } : d);
      setDrugs(updatedDrugs);
      
      // Trigger Gemini reasoning on significant dose change
      if (Math.abs(drug.dose - dose) > 30) {
        getSimulationReasoning(updatedDrugs).then(reason => {
          setChatMessages(prev => [...prev, { role: "GEMINI 2.0 // IMPACT", text: reason, color: "text-cyan-400 font-bold" }]);
        });
      }
    }
  };

  const updateDrugName = (id: number, name: string) => {
    const updatedDrugs = drugs.map(d => d.id === id ? { ...d, name } : d);
    setDrugs(updatedDrugs);
  };

  const removeDrug = (id: number) => {
    setDrugs(drugs.filter(d => d.id !== id));
  };

  // PK Curve Simulation Logic
  const chartData = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => {
      const data: any = { time: i };
      let totalEffect = 0;
      
      drugs.forEach(drug => {
        // Simple pharmacokinetic curve simulation
        const concentration = (drug.dose / 100) * (Math.exp(-0.1 * i) - Math.exp(-0.5 * i)) * 10;
        data[`drug_${drug.id}`] = concentration;
        totalEffect += concentration;
      });

      // Human body reaction curve (physiological response)
      data.reaction = Math.sin(i / 3) * 10 + totalEffect * 0.8;
      return data;
    });
  }, [drugs]);

  return (
    <div className="flex flex-col h-screen p-6 gap-6 bg-[radial-gradient(circle_at_center,#0a2333_0%,#05111a_100%)] overflow-y-auto overflow-x-hidden">
      {/* Header */}
      <header className="flex justify-between items-center border-b border-cyan-400/20 pb-4">
        <div className="flex items-center gap-4">
          <div className="p-2 bg-cyan-400/10 rounded-lg border border-cyan-400/20">
             <Activity className="text-cyan-400" size={20} />
          </div>
          <div>
            <h1 className="text-lg font-black tracking-widest uppercase">Bio-Digital Twin // v2.0</h1>
            <p className="text-[10px] text-white/30 uppercase tracking-[0.4em]">Real-time Physiological Mirroring</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
             <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Neural Sync</div>
             <div className="text-[10px] text-green-400 font-bold tracking-widest flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" /> 100% STABLE
             </div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">
        {/* Left: Simulation Controls */}
        <div className="space-y-6 flex flex-col min-h-0">
          <section className="glass-card flex-1 p-6 flex flex-col bg-black/40 border-cyan-400/10 overflow-hidden">
             <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-6 flex items-center gap-2">
               <Zap size={14} className="text-cyan-400" /> Drug Interaction Simulator
             </h3>
             
             <div className="flex-1 overflow-y-auto pr-2 space-y-6 scrollbar-hide">
               {drugs.map((drug) => (
                 <div key={drug.id} className="p-4 bg-white/[0.03] rounded-2xl border border-white/5 space-y-4">
                    <div className="flex justify-between items-center">
                      <input 
                        type="text"
                        value={drug.name}
                        onChange={(e) => updateDrugName(drug.id, e.target.value)}
                        className="bg-transparent border-none outline-none font-black text-[10px] tracking-widest uppercase text-cyan-400 w-full focus:ring-0"
                      />
                      {drugs.length > 1 && (
                        <button onClick={() => removeDrug(drug.id)} className="text-white/20 hover:text-red-400 transition-colors p-1">
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                       <div className="flex justify-between text-[10px] text-white/40 font-bold tracking-tighter">
                         <span>DOSAGE</span>
                         <span className="text-white">{drug.dose}mg</span>
                       </div>
                       <input 
                        type="range" 
                        min="0" 
                        max="1000" 
                        value={drug.dose} 
                        onChange={(e) => updateDose(drug.id, parseInt(e.target.value))}
                        className="w-full accent-cyan-400 h-1 bg-white/10 rounded-full cursor-pointer appearance-none"
                       />
                    </div>
                 </div>
               ))}

               {drugs.length < 5 && (
                 <button 
                  onClick={addDrug}
                  className="w-full py-4 border border-dashed border-cyan-400/30 rounded-2xl text-[10px] font-bold text-cyan-400/60 hover:bg-cyan-400/5 hover:border-cyan-400/60 transition-all uppercase tracking-[0.3em] flex items-center justify-center gap-2"
                 >
                   <Plus size={14} /> Add Multiple Drugs
                 </button>
               )}
             </div>
          </section>

          <section className="glass-card p-6 bg-black/40 border-cyan-400/10">
             <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] mb-4">
               Predictive Analytics
             </h3>
             <div className="space-y-3">
               <PredictiveStat label="Bio-Availability" value="88%" trend="up" />
               <PredictiveStat label="Toxicity Risk" value="12%" trend="down" />
               <PredictiveStat label="Clearance Rate" value="0.8 L/h" trend="stable" />
             </div>
          </section>
        </div>

        {/* Middle: Anatomical Visualization */}
        <div className="lg:col-span-1 relative flex flex-col">
            <div className="absolute inset-0 bg-cyan-400/5 rounded-full blur-[120px] pointer-events-none" />
            <div className="flex-1 relative">
              <div className="absolute inset-0 border border-white/5 rounded-3xl bg-black/20 overflow-hidden">
                {/* Visual Grid */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:40px_40px]" />
                
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
                      <Image src="/body-mesh.png" alt="Body" fill className="object-contain hologram-glow grayscale contrast-150 brightness-150 mix-blend-screen" priority />
                    </motion.div>
                    
                    {/* DYNAMIC OVERLAY: Scanning Line */}
                    <motion.div 
                      animate={{ top: ['0%', '100%', '0%'] }}
                      transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
                      className="absolute left-0 right-0 h-[2px] bg-cyan-400/40 shadow-[0_0_15px_rgba(125,249,255,0.8)] z-20 pointer-events-none"
                    />
                </div>
             </div>
          </div>
        </div>

        {/* Right: XAI Reasoning Feed */}
        <div className="flex flex-col gap-6 overflow-hidden">
          <section className="glass-card flex-1 flex flex-col bg-black/40 border-cyan-400/10">
             <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity size={14} className="text-cyan-400" /> PK/PD Live Curve
                </h3>
             </div>
             
             <div className="flex-1 min-h-[200px] p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData}>
                    <defs>
                      <linearGradient id="colorReaction" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ffffff" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#ffffff" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                    <XAxis dataKey="time" hide />
                    <YAxis hide domain={[0, 40]} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#05111a', border: '1px solid rgba(125,249,255,0.2)', borderRadius: '8px' }}
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

          <section className="glass-card flex-1 flex flex-col bg-black/40 border-cyan-400/10 overflow-hidden">
             <div className="p-4 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-xs font-bold text-white/40 uppercase tracking-[0.2em] flex items-center gap-2">
                  <Send size={14} className="text-cyan-400" /> Neural Insight Feed
                </h3>
             </div>
             
             <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
                <AnimatePresence>
                  {chatMessages.map((msg, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-1"
                    >
                      <div className={`text-[8px] font-black tracking-widest uppercase opacity-40`}>{msg.role}</div>
                      <div className={`text-[10px] leading-relaxed ${msg.color || 'text-white/70'}`}
                           dangerouslySetInnerHTML={{ __html: msg.text.replace(/\*\*(.*?)\*\*/g, '<b class="text-cyan-400">$1</b>') }} />
                    </motion.div>
                  ))}
                </AnimatePresence>
             </div>
          </section>
        </div>
      </div>

      {/* Bottom Nav */}
      <nav className="flex justify-between items-center bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-full px-6">
        <div className="flex gap-4">
          <button onClick={onBack} className="px-6 py-2 bg-cyan-400/20 border border-cyan-400/40 rounded-full text-[10px] font-bold text-cyan-400 hover:bg-cyan-400/30 transition-all">BACK TO DASHBOARD</button>
        </div>
        <button onClick={onBack} className="px-8 py-2 bg-red-500/10 border border-red-500/20 rounded-full text-[10px] font-bold text-red-400 uppercase tracking-widest">Terminate Session</button>
      </nav>
    </div>
  );
}

function PredictiveStat({ label, value, trend }: { label: string, value: string, trend: 'up' | 'down' | 'stable' }) {
  return (
    <div className="flex justify-between items-center bg-white/[0.02] p-3 rounded-xl border border-white/5">
      <span className="text-[10px] text-white/40 uppercase tracking-widest font-bold">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-xs font-black text-white">{value}</span>
        {trend === 'up' && <ChevronRight size={12} className="text-red-400 -rotate-90" />}
        {trend === 'down' && <ChevronRight size={12} className="text-green-400 rotate-90" />}
        {trend === 'stable' && <Activity size={12} className="text-cyan-400" />}
      </div>
    </div>
  );
}
