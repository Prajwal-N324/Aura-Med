"use client";

import { useState } from 'react';
import Image from 'next/image';
import { Eye, EyeOff, Activity } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LoginCard() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-10 w-full max-w-[400px] z-10"
    >
      <div className="flex flex-col items-center mb-8">
        <div className="w-16 h-16 relative mb-4">
          <Image 
            src="/logo.png" 
            alt="Aura Med Logo" 
            fill 
            className="object-contain hologram-glow"
          />
        </div>
        <h1 className="text-2xl font-bold tracking-[0.2em] text-center">
          AURA MED <span className="block text-sm font-light text-cyan-400 mt-1">VITAL ACCESS</span>
        </h1>
      </div>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <input 
            type="text" 
            placeholder="Patient ID / Email" 
            className="w-full bg-black/30 border border-white/10 p-4 rounded-lg outline-none focus:border-cyan-400/50 transition-colors"
            required 
            suppressHydrationWarning
          />
        </div>

        <div className="relative">
          <input 
            type={showPassword ? "text" : "password"} 
            placeholder="Password" 
            className="w-full bg-black/30 border border-white/10 p-4 rounded-lg outline-none focus:border-cyan-400/50 transition-colors"
            required 
            suppressHydrationWarning
          />
          <button 
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white/40 hover:text-cyan-400"
            suppressHydrationWarning
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <div className="flex justify-end">
          <a href="#" className="text-xs text-cyan-400 hover:underline">Forgot Password?</a>
        </div>

        <button 
          type="submit" 
          className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold rounded-lg hover:shadow-[0_0_20px_rgba(125,249,255,0.5)] transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
          suppressHydrationWarning
        >
          <Activity size={18} className="pulse-animation" />
          LOGIN
        </button>

        <p className="text-center text-xs text-white/40 mt-6">
          Don't have an account? <a href="#" className="text-cyan-400 hover:underline">Register</a>
        </p>
      </form>
    </motion.div>
  );
}
