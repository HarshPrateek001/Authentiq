"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Terminal } from "lucide-react"
import { SmartAction } from "@/components/ui/smart-action"
import { useState, useEffect } from "react"
import { useTheme } from "next-themes"

const WORDS = ["documents", "content", "essays", "code", "reports"]

export function HeroSection() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const currentWord = WORDS[currentWordIndex]
    
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1))
        } else {
          // Pause at the end of typing before starting to delete
          setTimeout(() => setIsDeleting(true), 2000)
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(currentWord.slice(0, displayText.length - 1))
        } else {
          setIsDeleting(false)
          setCurrentWordIndex((prev) => (prev + 1) % WORDS.length)
        }
      }
    }, isDeleting ? 40 : 100) // Delete faster than type

    return () => clearTimeout(timeout)
  }, [displayText, isDeleting, currentWordIndex])

  return (
    <section className="relative overflow-hidden border-b border-border/40 bg-background text-foreground">
      {/* Absolute Grid Background (Light & Technical) */}
      <div className="absolute inset-0 flex">
        {/* Left side stays solid/clean */}
        <div className="w-1/2 h-full hidden lg:block bg-background" />
        {/* Right side has the technical grid */}
        <div className="w-full lg:w-1/2 h-full opacity-20 dark:opacity-10 bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:linear-gradient(to_bottom,white_20%,transparent_100%)]" />
      </div>

      {/* Subtle background glow effect over grid */}
      <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-primary/10 blur-[150px] -z-10 rounded-full opacity-0 dark:opacity-50 transition-opacity duration-1000" />
      <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] -z-10 rounded-full dark:hidden" />

      <div className="container relative mx-auto px-4 py-24 md:py-32 lg:py-40 md:px-6 z-10 w-full min-h-[85vh] flex items-center">
        <div className="grid gap-16 lg:grid-cols-[1.1fr_0.9fr] items-center w-full">
          
          {/* Left: Typography (Vercel Style) */}
          <div className="space-y-8 relative z-10 max-w-[640px]">
            <h1 className="text-5xl font-extrabold tracking-tighter sm:text-6xl md:text-[5.5rem] text-balance leading-[1.05] text-foreground transition-all duration-300">
              Your fastest path <br className="hidden lg:block" />
              to originality for <br className="hidden lg:block" />
              <div className="flex items-center mt-2 flex-wrap min-h-[1.2em]">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-500 pr-1 inline-flex">
                  {displayText}
                </span>
                <span className="inline-block w-[3px] md:w-[4px] h-[1em] bg-primary animate-[pulse_1s_ease-in-out_infinite] opacity-80" />
              </div>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground/90 max-w-xl text-pretty leading-relaxed tracking-tight font-medium">
              Intuitive infrastructure to scan, humanize, and verify any application text or agent output from your first draft to your final submission.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
               <SmartAction
                size="lg"
                className="gap-2 text-base h-12 px-8 bg-foreground text-background hover:bg-foreground/90 transition-colors shadow-none rounded-[6px] font-bold tracking-tight border border-transparent"
                href="/signup?redirect=/"
                loggedInHref="/dashboard"
              >
                Start for free
                <ArrowRight className="h-4 w-4 text-background/80" />
              </SmartAction>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent text-foreground border-border text-base h-12 px-8 hover:bg-muted transition-colors rounded-[6px] font-medium tracking-tight shadow-none">
                Get in touch
              </Button>
            </div>
          </div>

          {/* Right: Technical Grid/Dashboard Graphics */}
          <div className="relative w-full h-[550px] hidden lg:block overflow-visible perspective-1000 -mr-12">
            
            {/* Terminal Command float badge */}
            <div className="absolute top-[10%] -left-12 bg-card border border-border rounded-lg py-3 px-5 shadow-2xl flex items-center gap-3 z-30 transition-transform hover:-translate-y-1 hover:shadow-primary/20 duration-300 backdrop-blur-md">
              <span className="text-primary font-mono text-lg font-bold">~</span>
              <code className="text-[15px] font-mono font-medium text-foreground tracking-tight">$ authentiq scan app</code>
            </div>

            {/* Authentiq-style App Dashboard layout */}
            <div className="absolute top-[20%] left-0 right-0 bottom-[5%] bg-card/80 backdrop-blur-xl border border-border shadow-2xl shadow-foreground/5 dark:shadow-primary/10 overflow-hidden flex flex-col translate-x-12 translate-y-4 rounded-tl-xl rounded-bl-xl rounded-tr-md rounded-br-md">
              
              {/* Fake Dashboard Header */}
              <div className="h-12 border-b border-border/60 flex items-center px-5 gap-3 bg-muted/20">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400/50" />
                  <div className="w-3 h-3 rounded-full bg-amber-400/50" />
                  <div className="w-3 h-3 rounded-full bg-green-400/50" />
                </div>
                <div className="ml-4 text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70">
                  Authentiq Engine Overview
                </div>
              </div>
              
              {/* Metric Layout Grid inside */}
              <div className="p-6 grid grid-cols-2 gap-4 flex-1 overflow-hidden relative">
                
                {/* Background scanning line effect for the whole widget */}
                <div className="absolute left-0 top-0 w-full h-[2px] bg-primary/20 blur-[1px] shadow-[0_0_15px_rgba(13,148,136,0.6)] animate-[scan_3s_ease-in-out_infinite]" />

                {/* Metric Card 1: AI Engine */}
                <div className="border border-border/60 rounded-lg p-5 bg-background/50 backdrop-blur-sm shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-primary/50 hover:shadow-primary/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-primary" />
                      humanizer-model
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-foreground font-medium px-2.5 py-1 rounded-full border border-primary/30 bg-primary/10">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                      </span>
                      Running
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono mb-2 tracking-wider flex justify-between">
                      <span>PROCESSING LOAD</span>
                      <span className="text-primary font-bold">98.4%</span>
                    </div>
                    {/* Fake text block scanning animation */}
                    <div className="space-y-1.5 relative overflow-hidden h-10 w-full rounded-md bg-muted/20 p-1.5">
                       <div className="h-1.5 w-[85%] bg-muted-foreground/30 rounded-full" />
                       <div className="h-1.5 w-[90%] bg-muted-foreground/30 rounded-full" />
                       <div className="h-1.5 w-[65%] bg-primary/40 rounded-full" />
                       <div className="h-1.5 w-[75%] bg-muted-foreground/30 rounded-full" />
                       {/* Scanner overlay */}
                       <div className="absolute inset-y-0 left-0 w-[20%] bg-gradient-to-r from-transparent via-primary/30 to-transparent animate-[shimmer_2s_infinite]" />
                    </div>
                  </div>
                </div>

                {/* Metric Card 2: Plagiarism Engine */}
                <div className="border border-border/60 rounded-lg p-5 bg-background/50 backdrop-blur-sm shadow-xs flex flex-col justify-between group transition-all duration-300 hover:border-blue-500/50 hover:shadow-blue-500/10">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-bold text-foreground flex items-center gap-2 relative">
                      <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                         <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                      </div>
                      plagiarism-scanner
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-foreground font-medium px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 group-hover:bg-blue-500/10 transition-colors">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Ready
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono mb-2 tracking-wider">DETECTION ACCURACY</div>
                    <div className="h-10 w-full relative">
                      <div className="absolute bottom-0 w-full h-[1px] bg-border/40" />
                      <div className="absolute bottom-0 w-full h-full border-l border-border/40 pl-[1px]">
                         <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 30" className="opacity-90">
                           <path d="M0,25 L15,22 L30,10 L45,15 L60,5 L80,12 L100,5" fill="none" stroke="url(#blue-gradient)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="drop-shadow-[0_2px_4px_rgba(59,130,246,0.3)]"/>
                           <defs>
                             <linearGradient id="blue-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                               <stop offset="0%" stopColor="#3b82f6" />
                               <stop offset="100%" stopColor="#60a5fa" />
                             </linearGradient>
                           </defs>
                         </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Real-time Document Analysis Tracker */}
                <div className="border border-border/60 rounded-lg p-5 bg-background/50 backdrop-blur-sm shadow-xs flex flex-col justify-between col-span-2 group hover:border-border transition-all duration-300 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-background via-background/80 to-transparent z-10" />
                  
                  <div className="flex justify-between items-center w-full mb-3 z-20 relative">
                     <div className="text-[11px] font-bold tracking-widest text-muted-foreground uppercase flex items-center gap-2">
                       <span className="relative flex h-2 w-2">
                         <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                         <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                       </span>
                       Live Document Stream
                     </div>
                     <div className="text-xs font-mono font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded border border-border/50">
                        {Math.floor(Date.now() / 1000).toString().slice(-6)}
                     </div>
                  </div>

                  <div className="flex gap-4 w-full relative z-0">
                     <div className="flex-1 flex flex-col justify-end h-16 gap-[3px] opacity-80">
                       <div className="w-full bg-primary/20 h-[30%] rounded-sm hover:h-[35%] transition-all" />
                       <div className="w-full bg-blue-500/20 h-[60%] rounded-sm hover:h-[65%] transition-all" />
                       <div className="w-full bg-primary h-[85%] rounded-sm shadow-[0_0_10px_rgba(13,148,136,0.4)] transition-all z-10" />
                       <div className="w-full bg-primary/40 h-[40%] rounded-sm hover:h-[45%] transition-all" />
                     </div>
                      <div className="flex-1 flex flex-col justify-end h-16 gap-[3px] opacity-80">
                       <div className="w-full bg-primary/30 h-[50%] rounded-sm" />
                       <div className="w-full bg-primary/20 h-[70%] rounded-sm" />
                       <div className="w-full bg-blue-500/80 h-[90%] rounded-sm shadow-[0_0_10px_rgba(59,130,246,0.4)]" />
                       <div className="w-full bg-primary/40 h-[60%] rounded-sm" />
                     </div>
                       <div className="flex-1 flex flex-col justify-end h-16 gap-[3px] opacity-30">
                       <div className="w-full bg-secondary h-[40%] rounded-sm" />
                       <div className="w-full bg-secondary h-[30%] rounded-sm" />
                       <div className="w-full bg-secondary h-[60%] rounded-sm" />
                       <div className="w-full bg-secondary h-[20%] rounded-sm" />
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Top-Right Accent Decorator Block (Real-time Inference) */}
            <div className="absolute -top-6 -right-6 w-40 h-[104px] border border-border/80 bg-card/90 backdrop-blur-md rounded-xl shadow-2xl flex flex-col p-3 z-30 transition-transform hover:scale-105 duration-300">
               <div className="flex items-center gap-2 mb-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                 <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Inference</span>
               </div>
               <div className="flex-1 flex items-end gap-1 opacity-80">
                  <div className="w-full bg-primary/20 h-[30%] rounded-sm animate-[pulse_1s_infinite]" />
                  <div className="w-full bg-primary/40 h-[50%] rounded-sm animate-[pulse_1.5s_infinite]" />
                  <div className="w-full bg-blue-500/60 h-[90%] rounded-sm animate-[pulse_2s_infinite]" />
                  <div className="w-full bg-primary/30 h-[70%] rounded-sm animate-[pulse_1.2s_infinite]" />
                  <div className="w-full bg-primary/20 h-[40%] rounded-sm animate-[pulse_1.8s_infinite]" />
                  <div className="w-full bg-primary/50 h-[80%] rounded-sm animate-[pulse_1.4s_infinite]" />
               </div>
            </div>

            {/* Bottom-Left Accent Decorator Block (API Stream) */}
            <div className="absolute -bottom-8 left-6 w-[220px] h-[130px] border border-border/80 bg-background/95 backdrop-blur-xl rounded-xl shadow-2xl flex flex-col p-4 z-30 transition-transform hover:-translate-y-2 hover:shadow-primary/20 duration-300">
              <div className="text-[10px] font-mono text-muted-foreground mb-3 flex items-center justify-between">
                <span>POST /v1/analyze</span>
                <span className="text-emerald-500">200 OK</span>
              </div>
              <div className="space-y-2">
                 <div className="flex justify-between items-center bg-muted/30 p-1.5 rounded text-[10px] font-mono">
                    <span className="text-muted-foreground">Tokens</span>
                    <span className="text-foreground">1,024</span>
                 </div>
                 <div className="flex justify-between items-center bg-muted/30 p-1.5 rounded text-[10px] font-mono">
                    <span className="text-muted-foreground">AI Prob</span>
                    <span className="text-primary font-bold">1.2%</span>
                 </div>
                 <div className="flex justify-between items-center bg-muted/30 p-1.5 rounded text-[10px] font-mono">
                    <span className="text-muted-foreground">Latency</span>
                    <span className="text-blue-500">24ms</span>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
