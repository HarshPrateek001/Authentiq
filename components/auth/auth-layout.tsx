"use client"

import type React from "react"
import { motion } from "framer-motion"
import { Star } from "lucide-react"
import Image from "next/image"

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full flex bg-background selection:bg-primary/30 relative font-sans text-foreground">
      
      {/* Mobile-only Header */}
      <div className="absolute top-0 left-0 right-0 h-16 flex items-center justify-between px-6 z-50 lg:hidden pointer-events-auto">
        <a href="/" className="flex items-center gap-2">
          <img src="/Authentiq_logo.svg" alt="Authentiq Logo" className="h-20 w-auto" />
        </a>
      </div>

      {/* Left Showcase Section (Hidden on Mobile) */}
      <div className="hidden lg:flex w-[55%] relative flex-col justify-center items-center overflow-hidden min-h-[100dvh]">
        
        {/* Desktop Header superimposed on left side */}
        <div className="absolute top-0 left-0 w-full h-20 flex items-center px-10 z-50">
          <a href="/" className="flex items-center gap-2 group">
            <img src="/Authentiq_logo.svg" alt="Authentiq Logo" className="h-28 w-auto transition-transform duration-300 group-hover:scale-105" />
          </a>
        </div>
        
        {/* Absolute Grid Background (Homepage Style) */}
        <div className="absolute inset-0 opacity-20 dark:opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]" />
        
        {/* Subtle background glow effect over grid */}
        <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 blur-[150px] -z-10 rounded-full opacity-0 dark:opacity-50 transition-opacity duration-1000" />
        <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] -z-10 rounded-full dark:hidden" />

        {/* Floating Particles Animation */}
         <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1.5 h-1.5 bg-primary/30 rounded-full"
              initial={{
                x: `${Math.random() * 50}vw`,
                y: `${Math.random() * 100}vh`,
                opacity: Math.random() * 0.5 + 0.2,
              }}
              animate={{
                y: [null, Math.random() * -100 - 50],
                opacity: [null, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>

        <div className="relative z-10 w-full max-w-[560px] space-y-12 px-8">
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="space-y-4"
          >
            <h2 className="text-5xl font-extrabold tracking-tighter text-foreground leading-[1.1]">
              Engineered for <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 inline-block py-1">Production Scale</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed font-medium max-w-md">
              Join the fastest growing platform for originality verification. Trusted by thousands of content teams globally.
            </p>
          </motion.div>

          {/* Testimonial Cards */}
          <div className="space-y-5 relative">
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="bg-card backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xl shadow-foreground/5 hover:border-primary/50 hover:shadow-primary/10 transition-all duration-300 group cursor-default relative overflow-hidden"
            >
              <div className="absolute -inset-x-0 bottom-0 h-1 bg-gradient-to-r from-primary to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="flex items-center gap-4 mb-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-primary/20">
                  <Image src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Alex Rivera" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Alex Rivera</div>
                  <div className="text-xs font-medium text-muted-foreground">Editor-in-Chief, TechDaily</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                "Authentiq completely transformed our editorial workflow. The speed and accuracy of the plagiarism checks are unmatched. It feels like a premium tool built perfectly for our needs."
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="bg-card backdrop-blur-xl border border-border/60 rounded-2xl p-6 shadow-xl shadow-foreground/5 hover:border-blue-500/50 hover:shadow-blue-500/10 transition-all duration-300 group cursor-default ml-8 overflow-hidden relative"
            >
              <div className="absolute -inset-x-0 bottom-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity" />
               <div className="flex items-center gap-4 mb-3">
                <div className="h-12 w-12 rounded-full overflow-hidden border-2 border-background ring-2 ring-blue-500/20">
                  <Image src="https://i.pravatar.cc/150?u=a042581f4e29026024d" alt="Sarah Chen" width={48} height={48} className="object-cover" />
                </div>
                <div>
                  <div className="font-bold text-foreground">Sarah Chen</div>
                  <div className="text-xs font-medium text-muted-foreground">Academic Researcher</div>
                </div>
                <div className="ml-auto flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              </div>
              <p className="text-sm font-medium text-foreground/80 leading-relaxed italic">
                "The UI is incredibly slick, and the API integration took exactly minutes. It's rare to find software that looks this good while handling complex data processing effortlessly."
              </p>
            </motion.div>

          </div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="flex items-center gap-4 pt-4"
          >
             <div className="flex -space-x-3">
                <Image src="https://i.pravatar.cc/100?u=1" alt="User 1" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                <Image src="https://i.pravatar.cc/100?u=2" alt="User 2" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                <Image src="https://i.pravatar.cc/100?u=3" alt="User 3" width={40} height={40} className="w-10 h-10 rounded-full border-2 border-background object-cover" />
                <div className="w-10 h-10 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">+10k</div>
             </div>
             <div className="text-sm font-medium text-muted-foreground leading-tight">
               <span className="text-foreground font-semibold">Active enterprise users</span><br/>
               scaling with us today
             </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Section */}
      <div className="w-full lg:w-[45%] flex flex-col justify-center px-4 sm:px-8 md:px-12 relative z-10 min-h-[100dvh] bg-background/50 backdrop-blur-3xl border-l border-border/40 shadow-[-20px_0_50px_-15px_rgba(0,0,0,0.05)]">
        
        <div className="w-full max-w-[420px] mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="bg-card border border-border/50 shadow-2xl shadow-foreground/5 rounded-[1.5rem] p-6 sm:p-8 w-full relative overflow-hidden"
          >
             {/* Form top accent edge */}
             <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-primary via-blue-500 to-indigo-500" />
            {children}
          </motion.div>
        </div>
      </div>

    </div>
  )
}
