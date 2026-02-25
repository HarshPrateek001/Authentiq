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

            {/* Vercel-style App Dashboard layout */}
            <div className="absolute top-[20%] left-0 right-0 bottom-[5%] bg-card/80 backdrop-blur-xl border border-border shadow-2xl shadow-foreground/5 dark:shadow-black/50 overflow-hidden flex flex-col translate-x-12 translate-y-4 rounded-tl-xl rounded-bl-xl rounded-tr-md rounded-br-md">
              
              {/* Fake Dashboard Header */}
              <div className="h-12 border-b border-border/60 flex items-center px-5 gap-3 bg-muted/20">
                <div className="flex gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  <div className="w-2.5 h-2.5 rounded-full bg-border" />
                </div>
                <div className="ml-4 text-[10px] sm:text-xs font-bold tracking-widest text-muted-foreground uppercase opacity-70">
                  Production Overview
                </div>
              </div>
              
              {/* Metric Layout Grid inside */}
              <div className="p-6 grid grid-cols-2 gap-4 flex-1 overflow-hidden">
                
                {/* Metric Card 1: Backend */}
                <div className="border border-border/60 rounded-lg p-5 bg-background shadow-xs flex flex-col justify-between group transition-colors hover:border-primary/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-muted-foreground" />
                      doc-backend
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-foreground font-medium px-2.5 py-1 rounded-full border border-border/80 bg-muted/40 group-hover:bg-primary/5 transition-colors">
                      <span className="relative flex h-1.5 w-1.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary"></span>
                      </span>
                      Deploying
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono mb-2 tracking-wider">ACCURACY/CPU</div>
                    {/* Fake line chart using purely CSS and SVG lines to look premium */}
                    <div className="h-10 w-full relative">
                      <div className="absolute bottom-0 w-full h-[1px] bg-border/40" />
                      <div className="absolute bottom-0 w-full h-full border-l border-border/40 pl-[1px]">
                         <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 30" className="opacity-90">
                           <path d="M0,25 Q15,10 30,22 T60,15 T100,5" fill="none" stroke="currentColor" className="text-primary" strokeWidth="2.5" strokeLinecap="round" />
                           <path d="M0,25 Q15,10 30,22 T60,15 T100,5 L100,30 L0,30 Z" fill="currentColor" className="text-primary" opacity="0.1" />
                         </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Metric Card 2: Frontend */}
                <div className="border border-border/60 rounded-lg p-5 bg-background shadow-xs flex flex-col justify-between group transition-colors hover:border-blue-500/50">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-sm font-semibold text-foreground flex items-center gap-2 relative">
                      <div className="w-3.5 h-3.5 rounded-sm bg-blue-500/20 flex flex-col gap-[2px] items-center justify-center p-[2px]">
                         <div className="w-full h-[2px] bg-blue-500 rounded-full" />
                         <div className="w-full h-[2px] bg-blue-500 rounded-full" />
                      </div>
                      app-frontend
                    </span>
                    <span className="flex items-center gap-1.5 text-[11px] text-foreground font-medium px-2.5 py-1 rounded-full border border-border/80 bg-muted/40">
                      <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                      Available
                    </span>
                  </div>
                  <div>
                    <div className="text-[10px] text-muted-foreground font-mono mb-2 tracking-wider">BANDWIDTH</div>
                    <div className="h-10 w-full relative">
                      <div className="absolute bottom-0 w-full h-[1px] bg-border/40" />
                      <div className="absolute bottom-0 w-full h-full border-l border-border/40 pl-[1px]">
                         <svg width="100%" height="100%" preserveAspectRatio="none" viewBox="0 0 100 30" className="opacity-90">
                           <path d="M0,15 L20,15 L35,5 L45,18 L60,12 L80,22 L100,10" fill="none" stroke="currentColor" className="text-blue-500" strokeWidth="2" strokeLinecap="round" />
                         </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Database Row Placeholder */}
                <div className="border border-border/60 rounded-lg p-5 bg-background shadow-xs flex items-center justify-between col-span-2 group hover:border-border transition-colors">
                  <div className="flex gap-4 w-full">
                     <div className="space-y-1.5 flex-[0.7]">
                       <div className="h-2.5 w-24 bg-muted-foreground/20 rounded-full" />
                       <div className="h-2 w-32 bg-muted rounded-full" />
                       <div className="h-2 w-28 bg-muted rounded-full" />
                     </div>
                     <div className="flex-1 flex gap-1 h-full items-end pb-1 opacity-60">
                       <div className="flex-1 bg-primary/20 h-[30%] rounded-sm" />
                       <div className="flex-1 bg-primary/40 h-[60%] rounded-sm" />
                       <div className="flex-1 bg-primary border-t-[2px] border-primary h-[40%] rounded-sm shadow-[0_0_10px_rgba(13,148,136,0.5)]" />
                       <div className="flex-1 bg-primary/30 h-[80%] rounded-sm" />
                       <div className="flex-1 bg-primary/60 h-[50%] rounded-sm" />
                       <div className="flex-1 bg-primary/20 h-[70%] rounded-sm" />
                       <div className="flex-1 bg-primary/80 h-[90%] rounded-sm" />
                       <div className="flex-1 bg-primary/30 h-[60%] rounded-sm" />
                     </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom Accent Decorator Blocks (Vercel Grid Art style) */}
            <div className="absolute -bottom-8 left-12 w-32 h-32 border-4 border-background dark:border-background flex flex-col bg-background overflow-hidden translate-z-10 shadow-lg group">
              <div className="flex-1 bg-primary opacity-90 group-hover:bg-primary/70 transition-colors" />
              <div className="flex-1 bg-blue-500 opacity-90 group-hover:bg-blue-400 transition-colors" />
              <div className="flex-1 flex">
                 <div className="flex-1 bg-purple-500" />
                 <div className="flex-1 bg-indigo-500" />
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </section>
  )
}
