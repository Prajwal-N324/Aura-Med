"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Hospital, CreditCard, AlertCircle, X, Zap, RefreshCcw } from 'lucide-react';
import { analyzeSymptoms } from '@/lib/ai-service';

export default function SymptomAnalyzer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setResult(null); // Clear previous results to prevent stale rendering
    
    try {
      let locationStr = "India";
      try {
        const pos: any = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 3000 });
        });
        locationStr = `Lat: ${pos.coords.latitude.toFixed(2)}, Long: ${pos.coords.longitude.toFixed(2)}`;
      } catch (err) {
        console.warn("Location check bypassed.");
      }

      const data = await analyzeSymptoms(symptoms, locationStr);
      setResult(data || { error: "Unknown synchronization failure." });
    } catch (criticalError) {
      setResult({ error: "Neural Engine initialization failed. Please refresh the workspace." });
    } finally {
      setLoading(false);
    }
  };

  const safeFormat = (text: any) => {
    if (typeof text !== 'string') return "";
    return text.replace(/\*\*(.*?)\*\*/g, '<b class="text-cyan-400 font-bold">$1</b>');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 overflow-hidden">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/90 backdrop-blur-md"
          />
          
          <motion.div 
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.98, opacity: 0 }}
            className="glass-card w-full max-w-2xl h-full max-h-[90vh] overflow-hidden flex flex-col z-10 border-white/5 shadow-2xl"
          >
            {/* Nav Header */}
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-black/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 flex items-center justify-center border border-cyan-400/20">
                  <Activity size={18} className="text-cyan-400" />
                </div>
                <h2 className="text-lg font-black text-white tracking-widest">AURA ANALYZER</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                <X size={18} className="text-white/40" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8 scrollbar-hide">
              {!result && !loading && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">What are you experiencing?</h3>
                    <p className="text-sm text-white/40">Describe your symptoms in natural language. Our AI analyzes patterns to provide clinical insights.</p>
                  </div>
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Sharp chest pain after exercise, radiating to left arm..."
                    className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-cyan-400/40 transition-all placeholder:text-white/10 resize-none"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={!symptoms.trim()}
                    className="w-full py-5 bg-cyan-400 text-black font-black text-xs tracking-[0.3em] rounded-3xl hover:bg-cyan-300 disabled:opacity-30 transition-all shadow-[0_0_30px_rgba(125,249,255,0.1)]"
                  >
                    RUN NEURAL DIAGNOSTIC
                  </button>
                </div>
              )}

              {loading && (
                <div className="h-full flex flex-col items-center justify-center space-y-6 py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-2 border-cyan-400/10 rounded-full" />
                    <div className="absolute inset-0 border-2 border-t-cyan-400 rounded-full animate-spin" />
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] animate-pulse">Sequencing Bio-Markers</p>
                    <p className="text-[9px] text-white/20 uppercase tracking-widest mt-2">Consulting Gemini 2.0 Flash...</p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10">
                  {result.error ? (
                    <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl text-center space-y-4">
                      <AlertCircle className="text-red-400 mx-auto" size={32} />
                      <h3 className="text-lg font-bold text-red-400">Analysis Interrupted</h3>
                      <p className="text-xs text-white/40 leading-relaxed max-w-sm mx-auto">{result.error}</p>
                      <button onClick={() => setResult(null)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Retry Analysis</button>
                    </div>
                  ) : (
                    <>
                      {/* Differential Diagnosis */}
                      <section className="space-y-4">
                        <label className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em]">Potential Conditions</label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {result.diseases?.map((d: any, i: number) => (
                            <div key={i} className="bg-white/[0.02] p-4 rounded-2xl border border-white/5 flex justify-between items-center group">
                              <span className="text-sm font-bold text-white/80">{d.name}</span>
                              <span className={`text-[8px] px-2 py-1 rounded-full font-black uppercase tracking-tighter ${
                                d.probability?.toLowerCase() === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-yellow-500/20 text-yellow-400'
                              }`}>{d.probability}</span>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Gemini Flow */}
                      <section className="bg-cyan-400/[0.02] border border-cyan-400/10 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-cyan-400 uppercase tracking-[0.4em] flex items-center gap-2">
                            <Zap size={12} className="animate-pulse" /> Neural Insight Feed
                          </span>
                        </div>
                        <div className="space-y-6">
                          {result.gemini_thoughts?.map((thought: any, i: number) => (
                            <div key={i} className="flex gap-4">
                              <div className="flex flex-col items-center">
                                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#7df9ff]" />
                                {i !== result.gemini_thoughts.length - 1 && <div className="w-px flex-1 bg-cyan-400/10 my-1" />}
                              </div>
                              <div className="flex-1">
                                <div className="text-[8px] text-white/20 uppercase tracking-widest mb-1 font-bold">{thought.point || 'Observation'}</div>
                                <p className="text-[11px] text-white/70 leading-relaxed font-mono" 
                                   dangerouslySetInnerHTML={{ __html: safeFormat(thought.detail) }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Actionable Conclusion */}
                      <section className="space-y-3">
                         <div className="bg-white/[0.03] p-6 rounded-3xl border border-white/5">
                            <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3">AI Clinical Conclusion</h4>
                            <p className="text-xs text-white/80 leading-relaxed italic" 
                               dangerouslySetInnerHTML={{ __html: safeFormat(result.model_interpretation) }} />
                         </div>
                      </section>

                      {/* Warning & Advice */}
                      <div className="bg-red-500/5 border border-red-500/10 p-5 rounded-2xl flex gap-4">
                        <AlertCircle className="text-red-400/60 shrink-0" size={16} />
                        <p className="text-[10px] text-white/30 italic leading-relaxed">{result.advice || "Consult a medical professional for a formal diagnosis."}</p>
                      </div>

                      <button onClick={() => setResult(null)} className="w-full py-4 bg-white/5 border border-white/10 rounded-3xl text-[9px] font-bold uppercase tracking-[0.4em] text-white/20 hover:bg-white/10 transition-all">Start New Analysis</button>
                    </>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
