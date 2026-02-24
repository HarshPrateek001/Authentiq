"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Zap, FileSearch, Wand2 } from "lucide-react"
import { SmartAction } from "@/components/ui/smart-action"
import { useState, useRef, useEffect } from "react"
import { useTheme } from "next-themes"

export function HeroSection() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const heroRef = useRef<HTMLElement>(null)
  const { theme } = useTheme()

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (heroRef.current) {
      const rect = heroRef.current.getBoundingClientRect()
      setMousePos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  return (
    <section 
      ref={heroRef}
      onMouseMove={handleMouseMove}
      className="relative overflow-hidden border-b border-border/40"
    >
      {/* Fallback base color gradient */}
      <div className="absolute inset-0 -z-30 bg-background" />
      
      {/* Base radial gradient */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      {/* Interactive Grid Definition */}
      <div 
        className="absolute inset-[-100%] w-[300%] h-[300%] -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] opacity-60"
        style={{
          animation: 'gridMove 10s linear infinite',
        }}
      />
      
      {/* Animated Gradient Blobs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-primary/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob -z-20" />
      <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-2000 -z-20" />
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-teal-500/30 rounded-full mix-blend-multiply filter blur-2xl opacity-70 animate-blob animation-delay-4000 -z-20" />

      {/* Dynamic Hover Gradient for the Grid (Desktop mostly) */}
      <div
        className="absolute inset-0 -z-10 transition-opacity duration-300 pointer-events-none hidden md:block"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(13, 148, 136, 0.15), transparent 60%)`
        }}
      />

      <div className="container relative mx-auto px-4 py-20 md:py-32 md:px-6 z-10 w-full h-full">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8 relative z-10">
            {/* Trusted By Badge with Avatars */}
            <div className="inline-flex items-center gap-3 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm backdrop-blur-md shadow-sm transition-transform hover:scale-105 duration-300">
              <span className="flex h-2.5 w-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
              <div className="flex -space-x-2">
                 <img className="h-6 w-6 rounded-full border-2 border-background object-cover grayscale-[20%]" src="https://i.pravatar.cc/100?img=1" alt="Avatar 1"/>
                 <img className="h-6 w-6 rounded-full border-2 border-background object-cover grayscale-[20%]" src="https://i.pravatar.cc/100?img=2" alt="Avatar 2"/>
                 <img className="h-6 w-6 rounded-full border-2 border-background object-cover grayscale-[20%]" src="https://i.pravatar.cc/100?img=3" alt="Avatar 3"/>
                 <img className="h-6 w-6 rounded-full border-2 border-background object-cover grayscale-[20%]" src="https://i.pravatar.cc/100?img=4" alt="Avatar 4"/>
              </div>
              <span className="text-foreground/90 font-medium pl-1">Trusted by 50,000+ top professionals</span>
            </div>

            {/* Premium Gradient Headline */}
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl md:text-7xl text-balance leading-[1.1]">
              Ensure Originality with <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-teal-400 to-blue-500 drop-shadow-sm">Authentiq</span>
            </h1>

            {/* Sub-headline */}
            <p className="text-xl text-muted-foreground max-w-xl text-pretty leading-relaxed">
              The ultimate AI-powered plagiarism checker and humanizer. Detect copied content, bypass AI detection, and generate verifiable reports in seconds.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <SmartAction
                size="lg"
                className="gap-2 text-base h-14 px-8 shadow-[0_0_20px_rgba(13,148,136,0.3)] hover:shadow-[0_0_30px_rgba(13,148,136,0.5)] transition-all duration-300 bg-gradient-to-r from-primary to-teal-500 border-0"
                href="/signup?redirect=/"
                loggedInHref="/dashboard"
              >
                Get Started for Free
                <ArrowRight className="h-5 w-5" />
              </SmartAction>
              <Button size="lg" variant="outline" className="gap-2 bg-background/50 backdrop-blur-md border-border text-base h-14 px-8 hover:bg-muted/80 hover:text-foreground transition-all duration-300">
                <Play className="h-5 w-5" />
                View Interactive Demo
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-6 pt-6 text-sm font-medium text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-primary/80" />
                <span>Bank-grade Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-blue-500/80" />
                <span>Lightning Fast</span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto w-full max-w-lg mt-14 lg:mt-0 xl:mr-8 perspective-1000 hidden lg:block">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] -z-10 rounded-full opacity-70 pointer-events-none" />
            
            <div className="grid grid-cols-2 gap-4 lg:gap-5 animate-float">
              
              {/* Main Score Card (Left Column, spans 2 rows) */}
              <div className="col-span-1 row-span-2 rounded-[2rem] bg-card border border-border shadow-xl shadow-primary/5 overflow-hidden relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent transition-opacity duration-500 opacity-50 group-hover:opacity-100" />
                <div className="p-6 flex flex-col items-center justify-between h-full relative z-10 w-full">
                  <div className="w-full flex justify-between items-center mb-6">
                    <FileSearch className="h-5 w-5 text-primary" />
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Accuracy</span>
                  </div>
                  
                  <div className="relative h-36 w-36 lg:h-40 lg:w-40 mb-6 transform transition-transform duration-500 group-hover:scale-105">
                    <svg className="h-full w-full -rotate-90 drop-shadow-sm" viewBox="0 0 100 100">
                      <circle className="text-muted/20 stroke-current" strokeWidth="6" fill="transparent" r="44" cx="50" cy="50" />
                      <circle className="text-primary stroke-current drop-shadow-[0_0_8px_rgba(13,148,136,0.6)]" strokeWidth="6" strokeLinecap="round" fill="transparent" r="44" cx="50" cy="50" strokeDasharray={276} strokeDashoffset={276 * 0.04} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-4xl font-black text-foreground">99<span className="text-xl text-muted-foreground">%</span></span>
                    </div>
                  </div>
                  
                  <div className="w-full text-center">
                    <span className="inline-flex items-center justify-center px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold tracking-widest uppercase border border-primary/20">
                      Original
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Card (Top Right) */}
              <div className="col-span-1 rounded-[2rem] bg-card border border-border shadow-xl shadow-primary/5 p-5 flex flex-col justify-center relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 transform translate-x-3 -translate-y-3 group-hover:scale-110 group-hover:opacity-10 transition-all duration-500">
                  <Shield className="h-16 w-16 text-foreground" />
                </div>
                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2 relative z-10">Document</span>
                <p className="font-semibold text-foreground text-sm truncate relative z-10">thesis_final_v2.docx</p>
                <div className="mt-4 flex items-center gap-2 relative z-10">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success/70 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
                  </span>
                  <span className="text-xs font-semibold text-success">Scan Complete</span>
                </div>
              </div>

              {/* AI Humanizer Card (Bottom Right) */}
              <div className="col-span-1 rounded-[2rem] bg-gradient-to-br from-primary to-teal-500 shadow-xl shadow-primary/20 p-5 flex flex-col justify-center text-white relative overflow-hidden group">
                <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="flex items-center gap-3 mb-3 relative z-10">
                  <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm shadow-inner overflow-hidden">
                    <Wand2 className="h-4 w-4 text-white" />
                  </div>
                  <span className="font-bold text-sm tracking-wide">Humanizer</span>
                </div>
                <div className="flex items-end gap-2 mt-1 relative z-10">
                  <span className="text-2xl font-black line-through text-white/50">87%</span>
                  <ArrowRight className="h-4 w-4 text-white/80 mb-2" />
                  <span className="text-3xl font-black text-white drop-shadow-md">99.9%</span>
                </div>
              </div>

              {/* Bottom Details Row */}
              <div className="col-span-2 grid grid-cols-2 gap-4 lg:gap-5">
                <div className="rounded-[2rem] bg-card border border-border shadow-xl shadow-primary/5 p-4 lg:p-5 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                  <div className="h-12 w-12 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-orange-600 dark:text-orange-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <Zap className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground block leading-none tracking-tight">50</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Sources</span>
                  </div>
                </div>
                
                <div className="rounded-[2rem] bg-card border border-border shadow-xl shadow-primary/5 p-4 lg:p-5 flex items-center gap-4 group hover:-translate-y-1 transition-transform duration-300 cursor-default">
                  <div className="h-12 w-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300 shadow-inner">
                    <FileSearch className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="text-2xl font-black text-foreground block leading-none tracking-tight">14.2k</span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1 block">Words</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
