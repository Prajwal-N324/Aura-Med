"use client";

import { motion } from 'framer-motion';

const steps = [
  { id: 1, label: '1. Credentials' },
  { id: 2, label: '2. Profile' },
  { id: 3, label: '3. Biometrics' },
];

export default function RegistrationStepper() {
  const activeStep = 1;

  return (
    <div className="w-full max-w-xl mt-12 px-4 relative">
      <div className="flex justify-between items-center relative z-10">
        {steps.map((step) => (
          <div key={step.id} className="flex flex-col items-center">
            <span className={`text-xs uppercase tracking-widest transition-colors ${
              step.id === activeStep ? 'text-cyan-400 font-bold' : 'text-white/40'
            }`}>
              {step.label}
            </span>
            {step.id === activeStep && (
              <motion.div 
                layoutId="pulse"
                className="w-1 h-1 bg-cyan-400 rounded-full mt-2 shadow-[0_0_10px_rgba(125,249,255,1)]"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            )}
          </div>
        ))}
      </div>
      
      {/* Progress Line */}
      <div className="absolute top-1.5 left-0 w-full h-[1px] bg-white/10" />
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: '33%' }}
        className="absolute top-1.5 left-0 h-[1px] bg-cyan-400 shadow-[0_0_8px_rgba(125,249,255,0.8)]"
      />
    </div>
  );
}
