"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Copy, Check, FileSearch, Wand2, ArrowRight } from "lucide-react"
import { checkPlagiarism, humanizeText } from "@/lib/api"
import { useToast } from "@/components/ui/use-toast"
import { SmartAction } from "@/components/ui/smart-action"

const sampleText = `Climate change represents one of the most pressing challenges of our time. The scientific consensus is clear: human activities have led to unprecedented changes in Earth's climate system. Global temperatures have risen by an average of 1.1°C since the pre-industrial era.`

const aiSampleText = `Artificial intelligence has revolutionized the way we approach problem-solving in various industries. Machine learning algorithms can process vast amounts of data and identify patterns that would be impossible for humans to detect. This technology continues to evolve at an exponential rate.`

// Initial mock data, will be replaced by API response
const initialFlaggedPhrases = [
  { text: "scientific consensus is clear", similarity: 75, source: "Wikipedia" },
  { text: "Global temperatures have risen by an average of 1.1°C", similarity: 92, source: "IPCC Report 2024" },
]

export function InteractiveDemo() {
  const router = useRouter()
  const { toast } = useToast()
  const [activeMode, setActiveMode] = useState<"plagiarism" | "humanizer">("plagiarism")
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null)
  const [score, setScore] = useState(0)
  const [copied, setCopied] = useState(false)
  const [hasUsedTrial, setHasUsedTrial] = useState(false)

  // Plagiarism states from API
  const [detectedSources, setDetectedSources] = useState<any[]>([])
  const [aiFlaggedSegments, setAiFlaggedSegments] = useState<string[]>([])

  // Humanizer states
  const [humanizedText, setHumanizedText] = useState("")
  const [aiScore, setAiScore] = useState(0)
  const [humanScore, setHumanScore] = useState(0)

  useEffect(() => {
    // Check if user has already used the free trial
    const used = localStorage.getItem("authentiq_free_trial_used")
    if (used === "true") {
      setHasUsedTrial(true)
    }
  }, [])

  const analyzeText = async () => {
    if (!inputText.trim()) return

    if (hasUsedTrial) {
      toast({
        title: "Free Trial Limit Reached",
        description: "You have used your free try. Redirecting to signup...",
      })
      setTimeout(() => router.push("/signup"), 1500)
      return
    }

    setIsAnalyzing(true)
    setAnalyzed(false)
    setHighlightedText(null)
    setDetectedSources([])
    setAiFlaggedSegments([])

    try {
      if (activeMode === "plagiarism") {
        const result = await checkPlagiarism(inputText)

        // Process sources for highlighting
        // Ensure result.sources_found is an array
        const sources = result.sources_found || []
        const aiSegments = result.ai_flagged_segments || []

        setDetectedSources(sources)
        setAiFlaggedSegments(aiSegments)
        setScore(Math.round(result.unique_content_percentage))

        // create phrases structure for highlighting logic
        const phrasesToHighlight = [
          ...sources.map((s: any) => ({
            text: s.snippet || "",
            similarity: Math.round(s.similarity || s.score || 0),
            source: s.source_title || s.title || "Unknown Source",
            type: 'plag'
          })).filter((p: any) => p.text.length > 5),
          ...aiSegments.map((text: string) => ({
            text: text,
            similarity: 100,
            source: "AI Generated",
            type: 'ai'
          })).filter((p: any) => p.text.length > 5)
        ]

        // Logic to highlight text
        const parts: React.ReactNode[] = []
        let lastIndex = 0
        const lowerInput = inputText.toLowerCase()

        // We need to find the indices of all matches
        interface Match { start: number; end: number; phrase: any }
        const matches: Match[] = []

        phrasesToHighlight.forEach((phrase: any) => {
          const idx = lowerInput.indexOf(phrase.text.toLowerCase())
          if (idx !== -1) {
            matches.push({ start: idx, end: idx + phrase.text.length, phrase })
          }
        })

        matches.sort((a, b) => a.start - b.start)

        if (matches.length > 0) {
          matches.forEach((match) => {
            if (match.start >= lastIndex) {
              // Add text before match
              parts.push(inputText.slice(lastIndex, match.start))
              // Add matched text
              const isAi = match.phrase.type === 'ai'
              parts.push(
                <span
                  key={match.start}
                  className={`${isAi ? 'bg-orange-500/20 text-orange-700 dark:text-orange-400' : 'bg-red-500/20 text-red-700 dark:text-red-400'} px-1 rounded cursor-help`}
                  title={isAi ? "Likely AI-generated content" : `${match.phrase.similarity}% match - ${match.phrase.source}`}
                >
                  {inputText.slice(match.start, match.end)}
                </span>
              )
              lastIndex = match.end
            }
          })
          if (lastIndex < inputText.length) {
            parts.push(inputText.slice(lastIndex))
          }
          setHighlightedText(parts)
        } else {
          setHighlightedText(inputText)
        }

      } else {
        // Humanizer logic
        const result = await humanizeText(inputText)

        setHumanizedText(result.humanized_text)
        setAiScore(Math.round(result.original_ai_score))
        // Human score is typically inverse of AI score
        setHumanScore(Math.round(100 - result.humanized_ai_score))
      }

      // Mark trial as used locally
      if (typeof window !== "undefined") {
        localStorage.setItem("authentiq_free_trial_used", "true")
        setHasUsedTrial(true)
      }
      setAnalyzed(true)

    } catch (error: any) {
      console.error("Analysis failed:", error)
      toast({
        title: "Error",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsAnalyzing(false)
    }
  }

  const loadSample = () => {
    if (hasUsedTrial) {
      toast({
        title: "Free Trial Limit Reached",
        description: "You have used your free try. Please sign up.",
      })
      setTimeout(() => router.push("/signup"), 1000)
      return
    }
    setInputText(activeMode === "plagiarism" ? sampleText : aiSampleText)
    setAnalyzed(false)
    setHighlightedText(null)
    setHumanizedText("")
    setDetectedSources([])
  }

  const handleCopy = () => {
    const textToCopy = activeMode === "humanizer" && humanizedText ? humanizedText : sampleText
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
    toast({
      description: "Copied to clipboard",
    })
  }

  const resetDemo = () => {
    if (hasUsedTrial) {
      router.push("/signup")
      return
    }
    setAnalyzed(false)
    setHighlightedText(null)
    setHumanizedText("")
    setInputText("")
    setDetectedSources([])
  }

  const handleModeChange = (mode: string) => {
    setActiveMode(mode as "plagiarism" | "humanizer")
    // Don't fully reset if they just want to switch tabs, but maybe clear results?
    // Let's clear results to avoid confusion
    setAnalyzed(false)
    setHighlightedText(null)
    setHumanizedText("")
    setDetectedSources([])
    // Keep input text if they want to check same text with other tool?
    // Usually input is different for plag check vs humanizer (one is AI, one is potentially plagiarized)
    // The previous implementation cleared it? No, but resetDemo does.
    // Let's keep input text to be friendly.
  }

  return (
    <section className="py-20 bg-muted/30" id="try-it-now">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <Badge variant="secondary" className="mb-2">
            <Sparkles className="h-3 w-3 mr-1" />
            Try It Now
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">See Our AI Tools in Action</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Test our plagiarism checker or AI humanizer instantly - no signup required
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="rounded-2xl border bg-card shadow-lg overflow-hidden">
            <Tabs value={activeMode} onValueChange={handleModeChange} className="w-full">
              <div className="border-b bg-muted/30 p-2">
                <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto">
                  <TabsTrigger value="plagiarism" className="gap-2">
                    <FileSearch className="h-4 w-4" />
                    Plagiarism Checker
                  </TabsTrigger>
                  <TabsTrigger value="humanizer" className="gap-2">
                    <Wand2 className="h-4 w-4" />
                    AI Humanizer
                  </TabsTrigger>
                </TabsList>
              </div>

              <div className="p-6">
                <TabsContent value="plagiarism" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Enter text to check for plagiarism</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy Sample"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={loadSample} className="text-xs bg-transparent">
                        Load Sample
                      </Button>
                    </div>
                  </div>

                  {analyzed && highlightedText ? (
                    <div className="h-[250px] overflow-y-auto p-4 rounded-lg bg-muted/50 text-sm leading-relaxed whitespace-pre-wrap">
                      {highlightedText}
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Paste or type your text here to check for plagiarism..."
                      className="h-[250px] resize-none"
                      value={inputText}
                      onChange={(e) => {
                        setInputText(e.target.value)
                        setAnalyzed(false)
                      }}
                    />
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {analyzed && (
                        <div className="flex items-center gap-2">
                          {score >= 80 ? (
                            <CheckCircle className="h-5 w-5 text-success" />
                          ) : (
                            <AlertTriangle className="h-5 w-5 text-warning" />
                          )}
                          <span className="text-sm font-medium">
                            Unique Content: <span className={score >= 80 ? "text-success" : "text-warning"}>{score}%</span>
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {analyzed && (
                        <Button variant="outline" onClick={resetDemo} className="bg-transparent">
                          Edit Text
                        </Button>
                      )}
                      <Button onClick={analyzeText} disabled={!inputText.trim() || isAnalyzing}>
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing...
                          </>
                        ) : analyzed ? (
                          "Re-analyze"
                        ) : (
                          hasUsedTrial ? "Sign up to Check" : "Check Plagiarism"
                        )}
                      </Button>
                    </div>
                  </div>

                  {analyzed && (detectedSources.length > 0 || aiFlaggedSegments.length > 0) && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Flagged sections (hover for details):</p>
                      <div className="flex flex-wrap gap-2">
                        {detectedSources.map(
                          (source, index) => (
                            <Badge
                              key={`plag-${index}`}
                              variant="outline"
                              className="bg-red-500/10 text-red-600 border-red-500/20 cursor-help"
                              title={source.url}
                            >
                              {Math.round(source.similarity)}% - {source.source_title || source.title || "Unknown"}
                            </Badge>
                          )
                        )}
                        {aiFlaggedSegments.map(
                          (segment, index) => (
                            <Badge
                              key={`ai-${index}`}
                              variant="outline"
                              className="bg-orange-500/10 text-orange-600 border-orange-500/20 cursor-help max-w-[200px] truncate"
                              title={segment}
                            >
                              AI Detected: {segment.substring(0, 20)}...
                            </Badge>
                          )
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="humanizer" className="mt-0 space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Enter AI-generated text to humanize</p>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1 text-xs">
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                        {copied ? "Copied" : "Copy Sample"}
                      </Button>
                      <Button variant="outline" size="sm" onClick={loadSample} className="text-xs bg-transparent">
                        Load Sample
                      </Button>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Input (AI Content)</p>
                      <Textarea
                        placeholder="Paste AI-generated content here..."
                        className="h-[250px] resize-none"
                        value={inputText}
                        onChange={(e) => {
                          setInputText(e.target.value)
                          setAnalyzed(false)
                          setHumanizedText("")
                        }}
                      />
                      {analyzed && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">AI Detected:</span>
                          <span className="font-medium text-red-600">{aiScore}%</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs text-muted-foreground font-medium">Output (Humanized)</p>
                      {isAnalyzing ? (
                        <div className="h-[250px] rounded-md border bg-muted/30 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Humanizing...</span>
                          </div>
                        </div>
                      ) : humanizedText ? (
                        <div className="h-[250px] p-3 rounded-md border bg-success/5 border-success/20 text-sm leading-relaxed overflow-y-auto">
                          {humanizedText}
                        </div>
                      ) : (
                        <div className="h-[250px] rounded-md border border-dashed bg-muted/20 flex items-center justify-center">
                          <p className="text-sm text-muted-foreground">Humanized text appears here</p>
                        </div>
                      )}
                      {analyzed && humanizedText && (
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-muted-foreground">Human Score:</span>
                          <span className="font-medium text-success">{humanScore}%</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-4">
                      {analyzed && humanizedText && (
                        <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                          +{Math.max(0, humanScore - (100 - aiScore))}% improvement
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {analyzed && (
                        <Button variant="outline" onClick={resetDemo} className="bg-transparent">
                          Reset
                        </Button>
                      )}
                      <Button onClick={analyzeText} disabled={!inputText.trim() || isAnalyzing} className="gap-2">
                        {isAnalyzing ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          <>
                            <Wand2 className="h-4 w-4" />
                            {hasUsedTrial ? "Sign up to Humanize" : "Humanize Text"}
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </TabsContent>
              </div>
            </Tabs>
          </div>

          <div className="mt-6 text-center">
            <SmartAction
              variant="link"
              className="gap-2 text-primary"
              href="/signup?redirect=/dashboard"
              loggedInHref="/dashboard"
            >
              Try the full version with advanced features
              <ArrowRight className="h-4 w-4" />
            </SmartAction>
          </div>
        </div>
      </div>
    </section>
  )
}
