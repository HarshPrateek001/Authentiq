"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Users, ShieldCheck, Zap } from "lucide-react"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/30 relative font-sans text-foreground">
      
      {/* Left Form Section */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-8 md:px-16 lg:px-24 xl:px-32 relative z-10 min-h-[100dvh]">
        
        {/* Subtle background glow for light mode */}
        <div className="absolute top-0 left-0 w-full h-[500px] bg-primary/5 blur-[120px] -z-10 rounded-full pointer-events-none dark:opacity-20" />

        <div className="w-full max-w-[420px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-card border border-border/50 shadow-sm rounded-2xl p-6 sm:p-8 w-full"
          >
            {children}
          </motion.div>
        </div>
      </div>

      {/* Right Stats / Showcase Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-muted/20 border-l border-border/40 flex-col justify-center items-center overflow-hidden min-h-[100dvh]">
        
        {/* Absolute Grid Background (Light & Technical) */}
        <div className="absolute inset-0 opacity-40 dark:opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]" />
        
        {/* Glowing orbs */}
        <div className="absolute top-[20%] right-[10%] w-[300px] h-[300px] bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[20%] left-[10%] w-[250px] h-[250px] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative z-10 w-full max-w-lg space-y-8 px-8">
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-4xl font-extrabold tracking-tight text-foreground leading-tight">
              Join over <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500">100,000+ creators</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium">
              Experience the fastest and most accurate originality checking infrastructure designed for production scale.
            </p>
          </motion.div>

          {/* Fake Metric Cards */}
          <div className="grid grid-cols-1 gap-4">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-background/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:border-primary/30 transition-colors"
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">1M+</div>
                <div className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wider">Documents Analyzed</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-background/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 shadow-sm flex items-center gap-4 ml-8 hover:border-blue-500/30 transition-colors"
            >
               <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center border border-blue-500/20 shrink-0">
                <Zap className="h-6 w-6 text-blue-500" />
              </div>
              <div className="flex-1">
                <div className="text-2xl font-bold tracking-tight text-foreground">99.9%</div>
                <div className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wider">Detection Accuracy</div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="bg-background/80 backdrop-blur-sm border border-border/60 rounded-xl p-5 shadow-sm flex items-center gap-4 hover:border-emerald-500/30 transition-colors"
            >
               <div className="h-12 w-12 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 shrink-0">
                <ShieldCheck className="h-6 w-6 text-emerald-500" />
              </div>
              <div>
                <div className="text-2xl font-bold tracking-tight text-foreground">Enterprise</div>
                <div className="text-[13px] text-muted-foreground font-semibold uppercase tracking-wider">Grade Security & Privacy</div>
              </div>
            </motion.div>

          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 pt-6"
          >
             {/* Fake User Avatars */}
             <div className="flex -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-background bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-600 dark:text-slate-300">JD</div>
                <div className="w-10 h-10 rounded-full border-2 border-background bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-bold text-zinc-600 dark:text-zinc-300">AS</div>
                <div className="w-10 h-10 rounded-full border-2 border-background bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300">MK</div>
                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">+2k</div>
             </div>
             <div className="text-sm font-medium text-muted-foreground leading-tight">
               <span className="text-foreground font-semibold">Active users</span><br/>
               joined this week
             </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
