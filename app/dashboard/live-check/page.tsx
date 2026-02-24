"use client"

import { useState, useEffect, useCallback } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { RefreshCw, Sparkles, Minimize2, Circle, Loader2, Wand2, AlignLeft, Info } from "lucide-react"

interface WordAnalysis {
  word: string
  start: number
  end: number
  risk: "safe" | "medium" | "high"
  similarity?: number
}

interface SentenceAnalysis {
  text: string
  risk: "safe" | "medium" | "high"
  similarity: number
}

const riskyPhrases = [
  "climate change represents",
  "scientific consensus",
  "unprecedented changes",
  "greenhouse gas emissions",
  "global temperatures",
  "ocean acidification",
  "rising sea levels",
  "renewable energy",
  "carbon footprint",
  "environmental impact",
]

const mediumRiskPhrases = ["research shows", "studies indicate", "experts agree", "data suggests", "evidence points"]

export default function LiveCheckPage() {
  const [content, setContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sentenceAnalysis, setSentenceAnalysis] = useState<SentenceAnalysis[]>([])
  const [overallScore, setOverallScore] = useState(100)
  const [lastAnalyzedContent, setLastAnalyzedContent] = useState("")

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length
  const charCount = content.length

  const analyzeContent = useCallback(() => {
    if (!content.trim() || content === lastAnalyzedContent) return

    setIsAnalyzing(true)

    // Simulate analysis delay
    setTimeout(() => {
      const sentences = content.match(/[^.!?]+[.!?]+/g) || [content]
      const analyzed: SentenceAnalysis[] = sentences.map((sentence) => {
        const lowerSentence = sentence.toLowerCase()
        const hasHighRisk = riskyPhrases.some((phrase) => lowerSentence.includes(phrase))
        const hasMediumRisk = mediumRiskPhrases.some((phrase) => lowerSentence.includes(phrase))

        let risk: "safe" | "medium" | "high" = "safe"
        let similarity = Math.floor(Math.random() * 15)

        if (hasHighRisk) {
          risk = "high"
          similarity = 60 + Math.floor(Math.random() * 35)
        } else if (hasMediumRisk) {
          risk = "medium"
          similarity = 25 + Math.floor(Math.random() * 30)
        }

        return { text: sentence.trim(), risk, similarity }
      })

      setSentenceAnalysis(analyzed)

      // Calculate overall score
      const avgSimilarity = analyzed.reduce((acc, s) => acc + s.similarity, 0) / analyzed.length
      setOverallScore(Math.max(0, Math.floor(100 - avgSimilarity)))
      setLastAnalyzedContent(content)
      setIsAnalyzing(false)
    }, 500)
  }, [content, lastAnalyzedContent])

  useEffect(() => {
    const timer = setTimeout(() => {
      if (content.length > 50) {
        analyzeContent()
      }
    }, 1000)

    return () => clearTimeout(timer)
  }, [content, analyzeContent])

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "bg-emerald-500/20 border-emerald-500/30"
      case "medium":
        return "bg-amber-500/20 border-amber-500/30"
      case "high":
        return "bg-red-500/20 border-red-500/30"
      default:
        return ""
    }
  }

  const getRiskTextColor = (risk: string) => {
    switch (risk) {
      case "safe":
        return "text-emerald-600"
      case "medium":
        return "text-amber-600"
      case "high":
        return "text-red-600"
      default:
        return ""
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  const handleToolAction = async (action: string) => {
    // Mock tool actions
    console.log(`Tool action: ${action}`)
  }
  const runBackendCheck = async (text: string) => {
  setIsAnalyzing(true)

  const res = await fetch("http://localhost:8000/api/check-plagiarism", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      check_ai_content: true,
    }),
  })

  if (!res.ok) {
    setIsAnalyzing(false)
    throw new Error("Plagiarism check failed")
  }

  const data = await res.json()
  setIsAnalyzing(false)
  return data
}

  const highRiskCount = sentenceAnalysis.filter((s) => s.risk === "high").length
  const mediumRiskCount = sentenceAnalysis.filter((s) => s.risk === "medium").length

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Live Plagiarism Detection</h1>
            <p className="text-muted-foreground">Real-time analysis as you type</p>
          </div>
          <div className="flex items-center gap-2">
            {isAnalyzing && (
              <Badge variant="outline" className="gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Analyzing...
              </Badge>
            )}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-3 space-y-4">
            {/* Toolbar */}
            <Card>
              <CardContent className="p-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleToolAction("rewrite")}
                        >
                          <Wand2 className="h-4 w-4" />
                          Rewrite
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Rewrite selected text to reduce similarity</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleToolAction("summarize")}
                        >
                          <Minimize2 className="h-4 w-4" />
                          Summarize
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Summarize and condense content</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-2 bg-transparent"
                          onClick={() => handleToolAction("simplify")}
                        >
                          <AlignLeft className="h-4 w-4" />
                          Simplify
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Simplify complex sentences</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>

                  <div className="flex-1" />

                  <Button variant="ghost" size="sm" className="gap-2" onClick={() => setContent("")}>
                    <RefreshCw className="h-4 w-4" />
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Editor */}
            <Card className="min-h-[500px]">
              <CardContent className="p-0">
                <div className="relative">
                  <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Start typing or paste your content here. The system will analyze it in real-time and highlight potentially plagiarized sections..."
                    className="w-full min-h-[500px] p-6 text-base leading-relaxed resize-none bg-transparent focus:outline-none"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {sentenceAnalysis.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Sentence Analysis
                  </CardTitle>
                  <CardDescription>Each sentence color-coded by risk level</CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  {sentenceAnalysis.map((sentence, index) => (
                    <div key={index} className={`p-3 rounded-lg border ${getRiskColor(sentence.risk)} transition-all`}>
                      <div className="flex items-start justify-between gap-4">
                        <p className="text-sm flex-1">{sentence.text}</p>
                        <Badge variant="outline" className={`shrink-0 ${getRiskTextColor(sentence.risk)}`}>
                          {sentence.similarity}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Originality Score</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center space-y-4">
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
                        className="stroke-current transition-all duration-500"
                        style={{ color: overallScore >= 80 ? "#22c55e" : overallScore >= 60 ? "#eab308" : "#ef4444" }}
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        strokeDasharray={264}
                        strokeDashoffset={264 - (264 * overallScore) / 100}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>{overallScore}%</span>
                      <span className="text-xs text-muted-foreground">Original</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Words</span>
                  <span className="font-medium">{wordCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Characters</span>
                  <span className="font-medium">{charCount}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sentences</span>
                  <span className="font-medium">{sentenceAnalysis.length || 0}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Risk Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-red-500 text-red-500" />
                    <span className="text-sm">High Risk</span>
                  </div>
                  <Badge variant="outline" className="text-red-600">
                    {highRiskCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span className="text-sm">Medium Risk</span>
                  </div>
                  <Badge variant="outline" className="text-amber-600">
                    {mediumRiskCount}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Circle className="h-3 w-3 fill-emerald-500 text-emerald-500" />
                    <span className="text-sm">Safe</span>
                  </div>
                  <Badge variant="outline" className="text-emerald-600">
                    {sentenceAnalysis.length - highRiskCount - mediumRiskCount}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-2">
                <Info className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">How it works</p>
                  <p>
                    As you type, the system analyzes your content in real-time. Sentences are color-coded based on
                    potential plagiarism risk. Use the toolbar to rewrite flagged content.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
