"use client"

import type React from "react"
import { motion } from "framer-motion"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="dark min-h-screen w-full flex items-center justify-center bg-[#07070A] selection:bg-primary/30 relative overflow-hidden font-sans">
      
      {/* Heavy but performant Background Layer (CSS instead of massive motion divs) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0 pointer-events-none filter saturate-[1.2] will-change-transform">
        
        {/* Foundation Grid */}
        <div 
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px)`,
            backgroundSize: '30px 30px',
            transform: 'perspective(500px) rotateX(25deg) scale(1.8) translateY(-20%)',
            transformOrigin: 'top center'
          }}
        />

        {/* Lightweight performant Glow Orbs using CSS keyframes mapped to tailwind */}
        <div 
          className="absolute top-[-10%] right-[10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[160px] mix-blend-screen animate-pulse will-change-transform" 
          style={{ animationDuration: '8s' }}
        />
        <div 
          className="absolute bottom-[-10%] left-[5%] w-[60vw] h-[60vw] bg-primary/20 rounded-full blur-[150px] mix-blend-screen animate-pulse will-change-transform" 
          style={{ animationDuration: '10s', animationDelay: '1s' }}
        />
        <div 
          className="absolute top-[30%] left-[-10%] w-[40vw] h-[40vw] bg-blue-500/15 rounded-full blur-[140px] mix-blend-screen animate-pulse will-change-transform" 
          style={{ animationDuration: '12s', animationDelay: '2s' }}
        />
        
        {/* Deep Vignette Mask overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#07070A_95%)]" />
      </div>

      {/* Centralized Form Container -> Premium Glassmorphism, Compact */}
      <div className="relative z-10 w-full max-w-[460px] px-4 py-4 md:py-8 flex flex-col items-center justify-center min-h-[100dvh]">
        
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)", scale: 0.96 }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
          transition={{ 
            type: "spring",
            stiffness: 80,
            damping: 20,
            duration: 0.8
          }}
          className="w-full relative group perspective-[1000px] my-auto"
        >
          {/* Subtle backglow for the glass sheet */}
          <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-blue-500/20 to-indigo-500/30 rounded-[2.5rem] blur-[30px] opacity-40 group-hover:opacity-70 transition-opacity duration-500 pointer-events-none will-change-transform animate-pulse" style={{ animationDuration: '4s' }} />
          
          <div className="bg-white/5 border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] relative rounded-[2rem] p-6 sm:p-8 overflow-hidden w-full backdrop-blur-[40px] saturate-150 transition-transform duration-300">
            
            {/* Glass light reflection edges */}
            <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute bottom-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="absolute left-0 inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            <div className="absolute right-0 inset-y-0 w-[1px] bg-gradient-to-b from-transparent via-white/10 to-transparent" />
            
            {/* Ambient internal soft glass glow */}
            <div className="absolute -top-32 -right-32 w-48 h-48 bg-primary/20 rounded-full blur-[60px] pointer-events-none z-0" />
            <div className="absolute -bottom-32 -left-32 w-48 h-48 bg-blue-500/20 rounded-full blur-[60px] pointer-events-none z-0" />
            
            <div className="relative z-10 w-full text-foreground">
               {children}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
