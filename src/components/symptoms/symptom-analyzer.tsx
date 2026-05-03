"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Hospital, CreditCard, AlertCircle, X, Zap } from 'lucide-react';
import { analyzeSymptoms } from '@/lib/ai-service';

export default function SymptomAnalyzer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    setLoading(true);
    let locationStr = "India";
    
    // Attempt to get actual location
    try {
      const pos: any = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject);
      });
      locationStr = `Lat: ${pos.coords.latitude}, Long: ${pos.coords.longitude}`;
    } catch (err) {
      console.warn("Location access denied, defaulting to general India context.");
    }

    const data = await analyzeSymptoms(symptoms, locationStr);
    setResult(data);
    setLoading(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-card w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col z-10"
          >
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h2 className="text-xl font-bold text-cyan-400 flex items-center gap-2">
                <Activity size={20} /> AI SYMPTOM ANALYSIS
              </h2>
              <button onClick={onClose} className="text-white/40 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-6">
              {!result ? (
                <div className="space-y-4">
                  <p className="text-sm text-white/60 italic">
                    Enter your symptoms below. Aura Med AI will cross-reference clinical datasets to provide insights.
                  </p>
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g., Severe headache with nausea and sensitivity to light for 2 days..."
                    className="w-full h-32 bg-black/40 border border-white/10 rounded-xl p-4 text-sm outline-none focus:border-cyan-400/50"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={loading || !symptoms}
                    className="w-full py-4 bg-cyan-400 text-black font-bold rounded-xl hover:bg-cyan-300 disabled:opacity-50 transition-colors"
                  >
                    {loading ? 'ANALYZING CLINICAL DATA...' : 'RUN AI DIAGNOSTIC'}
                  </button>
                </div>
              ) : (
                <div className="space-y-8 pb-4">
                  {/* Predicted Diseases */}
                  <section>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Activity size={14} /> Differential Diagnosis (DDx)
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.diseases?.map((d: any, i: number) => (
                        <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center">
                          <span className="text-sm font-medium">{d.name}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                            d.probability === 'High' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            {d.probability}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Hospitals */}
                  <section>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <Hospital size={14} /> Nearby Facilities
                    </h3>
                    <div className="space-y-2">
                      {result.hospitals?.map((h: any, i: number) => (
                        <div key={i} className="bg-white/5 p-3 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                          <div>
                            <div className="font-bold">{h.name}</div>
                            <div className="text-white/40">{h.location}</div>
                          </div>
                          <span className="text-cyan-400 opacity-60">{h.type}</span>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Treatment Costs */}
                  <section>
                    <h3 className="text-xs font-bold text-white/40 uppercase tracking-widest mb-3 flex items-center gap-2">
                      <CreditCard size={14} /> Treatment Tiers
                    </h3>
                    <div className="grid grid-cols-1 gap-3">
                      {result.treatment_options?.map((t: any, i: number) => (
                        <div key={i} className="bg-white/5 p-4 rounded-lg border border-white/5 space-y-1">
                          <div className="flex justify-between items-center">
                            <span className="text-sm font-bold text-cyan-400">{t.category}</span>
                            <span className="text-xs text-white/60">{t.estimated_cost}</span>
                          </div>
                          <p className="text-[11px] text-white/40 leading-relaxed">{t.description}</p>
                        </div>
                      ))}
                    </div>
                  </section>

                  {/* Gemini reasoning flow */}
                  <section className="bg-cyan-500/5 border border-cyan-400/20 p-5 rounded-xl space-y-4">
                    <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-[0.2em] flex items-center gap-2">
                      <Zap size={14} className="pulse-animation" /> GEMINI 1.5 FLASH // CLINICAL REASONING
                    </h3>
                    
                    <div className="space-y-4">
                      {result.gemini_thoughts?.map((thought: any, i: number) => (
                        <div key={i} className="flex gap-4 group">
                          <div className="flex flex-col items-center">
                            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(125,249,255,0.8)]" />
                            {i !== result.gemini_thoughts.length - 1 && <div className="w-px flex-1 bg-cyan-400/20 my-1" />}
                          </div>
                          <div className="flex-1 pb-4">
                            <div className="text-[10px] text-cyan-400/60 uppercase tracking-widest mb-1">{thought.point}</div>
                            <p className="text-[11px] text-white/80 leading-relaxed font-mono" 
                               dangerouslySetInnerHTML={{ __html: thought.detail.replace(/\*\*(.*?)\*\*/g, '<b class="text-cyan-400">$1</b>') }} />
                          </div>
                        </div>
                      ))}
                      
                      <div className="bg-black/40 p-4 rounded-lg border border-white/5 space-y-2">
                        <div className="text-[9px] text-cyan-400/60 uppercase tracking-widest">Recommended Clinical Solution</div>
                        <p className="text-[11px] text-white/60 leading-relaxed italic"
                           dangerouslySetInnerHTML={{ __html: result.model_interpretation.replace(/\*\*(.*?)\*\*/g, '<b class="text-white font-bold">$1</b>') }} />
                      </div>
                    </div>
                  </section>

                  {/* Warning */}
                  <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3">
                    <AlertCircle className="text-red-400 shrink-0" size={20} />
                    <p className="text-[11px] text-red-200/70 italic">{result.advice}</p>
                  </div>

                  <button 
                    onClick={() => setResult(null)}
                    className="w-full py-3 border border-white/10 rounded-xl text-xs hover:bg-white/5 transition-colors"
                  >
                    START NEW ANALYSIS
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
