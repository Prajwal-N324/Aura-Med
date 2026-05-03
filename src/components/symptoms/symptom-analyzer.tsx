"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, AlertCircle, X, Zap, ChevronRight } from 'lucide-react';
import { analyzeSymptoms } from '@/lib/ai-service';

export default function SymptomAnalyzer({ isOpen, onClose, onNavigate }: { isOpen: boolean, onClose: () => void, onNavigate?: (view: string) => void }) {
  const [symptoms, setSymptoms] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [connectionStatus, setConnectionStatus] = useState({ phi: 'checking', gemini: 'checking' });

  useEffect(() => {
    // Neural Handshake
    const checkLinks = () => {
      const hasPhi = !!process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
      const hasGemini = !!process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      setConnectionStatus({
        phi: hasPhi ? 'online' : 'missing_key',
        gemini: hasGemini ? 'online' : 'missing_key'
      });
    };
    checkLinks();
  }, [isOpen]);

  const handleAnalyze = async () => {
    if (!symptoms.trim()) return;
    
    setLoading(true);
    setResult(null);
    
    try {
      const data = await analyzeSymptoms(symptoms);
      setResult(data || { error: "Unknown synchronization failure." });
    } catch (criticalError) {
      setResult({ error: "Neural Engine initialization failed." });
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
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
            className="glass-card w-full max-w-2xl h-full max-h-[90vh] overflow-hidden flex flex-col z-10 border-white/5"
          >
            {/* Header */}
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

            <div className="flex-1 overflow-y-auto p-8 space-y-8 scrollbar-hide">
              <div className="flex gap-4">
                <StatusBadge label="PHI-4 NEURAL" status={connectionStatus.phi} />
                <StatusBadge label="GEMINI CORE" status={connectionStatus.gemini} />
              </div>

              {!result && !loading && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold tracking-tight">Clinical Symptom Intake</h3>
                    <p className="text-sm text-white/40">Enter your symptoms for unrestricted neural analysis and 3D physiological mapping.</p>
                  </div>
                  <textarea 
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    placeholder="e.g. Acute abdominal pain with secondary nausea..."
                    className="w-full h-48 bg-white/[0.03] border border-white/10 rounded-3xl p-6 text-sm outline-none focus:border-cyan-400/40 transition-all placeholder:text-white/10"
                  />
                  <button 
                    onClick={handleAnalyze}
                    disabled={!symptoms.trim()}
                    className="w-full py-5 bg-blue-600 text-white font-black text-xs tracking-[0.3em] rounded-3xl hover:bg-blue-500 disabled:opacity-30 transition-all shadow-[0_0_30px_rgba(37,99,235,0.2)] uppercase"
                  >
                    Start Neural Analysis
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
                    <p className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.5em] animate-pulse">Analyzing Bio-Markers...</p>
                  </div>
                </div>
              )}

              {result && !loading && (
                <div className="space-y-8">
                  {result.error ? (
                    <div className="bg-red-500/5 border border-red-500/20 p-8 rounded-3xl text-center space-y-4">
                      <AlertCircle className="text-red-400 mx-auto" size={32} />
                      <h3 className="text-lg font-bold text-red-400">Sync Failure</h3>
                      <p className="text-xs text-white/40">{result.error}</p>
                      <button onClick={() => setResult(null)} className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-[10px] font-bold uppercase tracking-widest">Retry</button>
                    </div>
                  ) : (
                    <>
                      <section className="bg-cyan-400/[0.03] border border-cyan-400/20 rounded-3xl p-6 space-y-6">
                        <div className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-widest">
                          <Zap size={12} className="animate-pulse" /> Neural Insight Feed
                        </div>
                        <div className="space-y-4">
                          {result.gemini_thoughts?.map((thought: any, i: number) => (
                            <div key={i} className="flex gap-4 border-l-2 border-cyan-400/20 pl-4">
                              <p className="text-[11px] text-white/80 leading-relaxed font-mono" 
                                 dangerouslySetInnerHTML={{ __html: safeFormat(thought.detail) }} />
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* THE NAVIGATION BRIDGE */}
                      <button 
                        onClick={() => {
                          onNavigate?.('simulation');
                          onClose();
                        }}
                        className="w-full py-5 bg-cyan-400 text-black font-black text-[10px] tracking-[0.4em] rounded-3xl hover:bg-cyan-300 transition-all flex items-center justify-center gap-3 group shadow-[0_0_40px_rgba(125,249,255,0.2)]"
                      >
                        Initialize 3D Bio-Twin Simulation <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                      </button>

                      <div className="bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                        <h4 className="text-[9px] font-bold text-white/30 uppercase tracking-[0.3em] mb-3">AI Clinical Summary</h4>
                        <p className="text-xs text-white/70 leading-relaxed italic" 
                           dangerouslySetInnerHTML={{ __html: safeFormat(result.model_interpretation) }} />
                      </div>
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

function StatusBadge({ label, status }: { label: string, status: string }) {
  const colors: any = {
    online: 'text-green-400 bg-green-400/10 border-green-400/20',
    checking: 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20',
    missing_key: 'text-red-400 bg-red-400/10 border-red-400/20',
  };
  return (
    <div className={`px-3 py-1 rounded-full border ${colors[status] || colors.checking} text-[8px] font-black tracking-widest flex items-center gap-2`}>
      <div className={`w-1.5 h-1.5 rounded-full ${status === 'online' ? 'bg-green-400 animate-pulse' : 'bg-current'}`} />
      {label}: {status.toUpperCase()}
    </div>
  );
}
