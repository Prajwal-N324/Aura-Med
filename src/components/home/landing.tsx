"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import LoginCard from '@/components/auth/login-card';
import RegistrationStepper from '@/components/auth/registration-stepper';
import MedicalViz from '@/components/viz/medical-viz';
import SymptomAnalyzer from '@/components/symptoms/symptom-analyzer';
import { Activity } from 'lucide-react';

export default function HomeLanding({ onLogin }: { onLogin: () => void }) {
  const [isSymptomModalOpen, setIsSymptomModalOpen] = useState(false);

  return (
    <main className="flex h-screen w-screen overflow-hidden relative">
      {/* Left Section: Auth & Stepper */}
      <div className="flex-1 flex flex-col justify-center items-center p-8 lg:p-16 z-10 relative">
        <div onClick={onLogin}> {/* Temporary hack to login on click for demo */}
          <LoginCard />
        </div>
        
        {/* Registration Stepper at the bottom */}
        <div className="absolute bottom-12 flex flex-col items-center w-full px-8">
          <div className="text-[10px] text-white/30 uppercase tracking-[0.3em] mb-4">Registration Pipeline</div>
          <RegistrationStepper />
        </div>

        {/* Patient Entry Button (AI Analysis) */}
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={(e) => {
            console.log("Opening AI Modal...");
            e.stopPropagation();
            setIsSymptomModalOpen(true);
          }}
          className="mt-8 flex items-center gap-2 px-6 py-3 bg-white/5 border border-cyan-400/30 rounded-full text-xs font-bold text-cyan-400 hover:bg-cyan-400/10 transition-all glow-border relative z-50"
          suppressHydrationWarning
        >
          <Activity size={16} className="pulse-animation" />
          PATIENT SYMPTOM ENTRY (AI DIAGNOSTIC)
        </motion.button>
      </div>

      {/* Right Section: Medical Viz */}
      <div className="hidden lg:flex flex-[1.2] relative bg-black/20 border-l border-white/5">
        <MedicalViz />
        
        {/* Branding Overlay */}
        <div className="absolute top-12 right-12 text-right">
          <div className="text-2xl font-black tracking-tighter opacity-10 select-none">AURA MED</div>
          <div className="text-[8px] uppercase tracking-[0.5em] text-cyan-400/40">Bio-Digital Workspace v3.0</div>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <SymptomAnalyzer 
        isOpen={isSymptomModalOpen} 
        onClose={() => setIsSymptomModalOpen(false)} 
      />

      {/* Global Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />
    </main>
  );
}
