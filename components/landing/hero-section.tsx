import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play, Shield, Zap, FileSearch, Wand2 } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background" />

      <div className="container mx-auto px-4 py-20 md:py-32 md:px-6">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              <span className="text-muted-foreground">Trusted by 50,000+ users worldwide</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl text-balance">
              AI-powered plagiarism checker for <span className="text-primary">serious writers</span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-lg text-pretty">
              Detect copied content, understand originality, and generate clean reports in seconds. Plus, humanize
              AI-generated text to bypass detection.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild className="gap-2">
                <Link href="/signup">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="gap-2 bg-transparent">
                <Play className="h-4 w-4" />
                Watch Demo
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-4 pt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" />
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                <span>Results in seconds</span>
              </div>
              <div className="flex items-center gap-2">
                <Wand2 className="h-4 w-4 text-primary" />
                <span>AI Humanizer</span>
              </div>
            </div>
          </div>

          <div className="relative lg:ml-auto">
            <div className="relative rounded-2xl border border-border bg-card p-6 shadow-2xl shadow-primary/5">
              <div className="absolute -top-3 -right-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg">
                <FileSearch className="h-5 w-5" />
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Originality Score</span>
                  <span className="text-sm text-muted-foreground">research_paper.docx</span>
                </div>

                <div className="relative h-32 w-32 mx-auto">
                  <svg className="h-32 w-32 -rotate-90" viewBox="0 0 100 100">
                    <circle
                      className="text-muted stroke-current"
                      strokeWidth="8"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                    />
                    <circle
                      className="text-primary stroke-current"
                      strokeWidth="8"
                      strokeLinecap="round"
                      fill="transparent"
                      r="42"
                      cx="50"
                      cy="50"
                      strokeDasharray={264}
                      strokeDashoffset={264 * 0.08}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold">92%</span>
                    <span className="text-xs text-muted-foreground">Original</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Sources found</span>
                    <span className="font-medium">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Words analyzed</span>
                    <span className="font-medium">2,847</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Status</span>
                    <span className="inline-flex items-center rounded-full bg-success/10 px-2 py-0.5 text-xs font-medium text-success">
                      Safe
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 rounded-xl border border-border bg-card p-4 shadow-lg">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Wand2 className="h-5 w-5 text-primary" />
                </div>
                <div className="text-sm">
                  <p className="font-medium">AI Humanizer</p>
                  <p className="text-muted-foreground">87% → 96% human</p>
                </div>
              </div>
            </div>

            <div className="absolute -top-4 -left-4 rounded-xl border border-border bg-card p-3 shadow-lg">
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  <div className="h-7 w-7 rounded-full bg-primary/20 border-2 border-card" />
                  <div className="h-7 w-7 rounded-full bg-primary/30 border-2 border-card" />
                  <div className="h-7 w-7 rounded-full bg-primary/40 border-2 border-card" />
                </div>
                <div className="text-xs">
                  <p className="font-medium">12,847</p>
                  <p className="text-muted-foreground">users active</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
