"use client";

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function MedicalViz() {
  return (
    <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
      {/* Background Mesh */}
      <motion.div 
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.7 }}
        transition={{ duration: 2, ease: "easeOut" }}
        className="absolute inset-0 z-0"
      >
        <Image 
          src="/body-mesh.png" 
          alt="Body Mesh" 
          fill 
          className="object-contain opacity-50 contrast-125 saturate-150"
        />
      </motion.div>

      {/* Vital Badges */}
      <motion.div 
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute top-[20%] left-[10%] glass-card p-4 border-l-4 border-l-cyan-400 min-w-[180px]"
      >
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Live Telemetry</div>
        <div className="text-xl font-bold text-cyan-400 flex items-baseline gap-2">
          72 <span className="text-xs font-normal">BPM</span>
        </div>
        <div className="w-full h-8 mt-2 flex items-end gap-1">
          {[...Array(10)].map((_, i) => (
            <motion.div 
              key={i}
              className="w-1 bg-cyan-400/50 rounded-full"
              animate={{ height: [8, Math.random() * 20 + 10, 8] }}
              transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
            />
          ))}
        </div>
      </motion.div>

      <motion.div 
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: 1.2 }}
        className="absolute bottom-[20%] right-[10%] glass-card p-4 border-l-4 border-l-blue-400 min-w-[180px]"
      >
        <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Respiration</div>
        <div className="text-xl font-bold text-blue-400 flex items-baseline gap-2">
          16 <span className="text-xs font-normal">BREATHS/MIN</span>
        </div>
        <div className="w-full h-2 mt-3 bg-white/5 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-blue-400 shadow-[0_0_10px_rgba(77,166,255,1)]"
            animate={{ width: ['0%', '100%'] }}
            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          />
        </div>
      </motion.div>

      {/* Scanning Line Effect */}
      <motion.div 
        animate={{ translateY: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent z-10"
      />
    </div>
  );
}
