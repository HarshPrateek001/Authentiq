"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Sparkles, AlertTriangle, CheckCircle, Copy, Check, FileSearch, Wand2, ArrowRight } from "lucide-react"

const sampleText = `Climate change represents one of the most pressing challenges of our time. The scientific consensus is clear: human activities have led to unprecedented changes in Earth's climate system. Global temperatures have risen by an average of 1.1°C since the pre-industrial era.`

const aiSampleText = `Artificial intelligence has revolutionized the way we approach problem-solving in various industries. Machine learning algorithms can process vast amounts of data and identify patterns that would be impossible for humans to detect. This technology continues to evolve at an exponential rate.`

const flaggedPhrases = [
  { text: "scientific consensus is clear", similarity: 75, source: "Wikipedia" },
  { text: "Global temperatures have risen by an average of 1.1°C", similarity: 92, source: "IPCC Report 2024" },
]

export function InteractiveDemo() {
  const [activeMode, setActiveMode] = useState<"plagiarism" | "humanizer">("plagiarism")
  const [inputText, setInputText] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzed, setAnalyzed] = useState(false)
  const [highlightedText, setHighlightedText] = useState<React.ReactNode>(null)
  const [score, setScore] = useState(0)
  const [copied, setCopied] = useState(false)

  // Humanizer states
  const [humanizedText, setHumanizedText] = useState("")
  const [aiScore, setAiScore] = useState(0)
  const [humanScore, setHumanScore] = useState(0)

  const analyzeText = async () => {
    if (!inputText.trim()) return

    setIsAnalyzing(true)
    setAnalyzed(false)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    if (activeMode === "plagiarism") {
      // Plagiarism check logic
      let matches = 0
      flaggedPhrases.forEach((phrase) => {
        if (inputText.toLowerCase().includes(phrase.text.toLowerCase())) {
          matches++
        }
      })

      const parts: React.ReactNode[] = []
      let lastIndex = 0
      const lowerInput = inputText.toLowerCase()

      flaggedPhrases.forEach((phrase, index) => {
        const phraseIndex = lowerInput.indexOf(phrase.text.toLowerCase())
        if (phraseIndex !== -1) {
          if (phraseIndex > lastIndex) {
            parts.push(inputText.slice(lastIndex, phraseIndex))
          }
          parts.push(
            <span
              key={index}
              className="bg-red-500/20 text-red-700 dark:text-red-400 px-1 rounded cursor-help"
              title={`${phrase.similarity}% match - ${phrase.source}`}
            >
              {inputText.slice(phraseIndex, phraseIndex + phrase.text.length)}
            </span>,
          )
          lastIndex = phraseIndex + phrase.text.length
        }
      })

      if (lastIndex < inputText.length) {
        parts.push(inputText.slice(lastIndex))
      }

      setHighlightedText(parts.length > 1 ? parts : inputText)
      setScore(matches > 0 ? Math.floor(100 - matches * 25) : 100)
    } else {
      // Humanizer logic
      setAiScore(87)
      await new Promise((resolve) => setTimeout(resolve, 800))

      const humanized = inputText
        .split(". ")
        .map((sentence, i) => {
          if (i % 2 === 0)
            return sentence.replace(/\b(the|a|an|this|that)\b/gi, (m) => {
              const replacements: Record<string, string> = {
                the: "this",
                a: "one",
                an: "a single",
                this: "the",
                that: "which",
              }
              return replacements[m.toLowerCase()] || m
            })
          return sentence
        })
        .join(". ")

      setHumanizedText(humanized)
      setHumanScore(96)
    }

    setAnalyzed(true)
    setIsAnalyzing(false)
  }

  const loadSample = () => {
    setInputText(activeMode === "plagiarism" ? sampleText : aiSampleText)
    setAnalyzed(false)
    setHighlightedText(null)
    setHumanizedText("")
  }

  const handleCopy = () => {
    const textToCopy = activeMode === "humanizer" && humanizedText ? humanizedText : sampleText
    navigator.clipboard.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const resetDemo = () => {
    setAnalyzed(false)
    setHighlightedText(null)
    setHumanizedText("")
    setInputText("")
  }

  const handleModeChange = (mode: string) => {
    setActiveMode(mode as "plagiarism" | "humanizer")
    resetDemo()
  }

  return (
    <section className="py-20 bg-muted/30">
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
                    <div className="min-h-[150px] p-4 rounded-lg bg-muted/50 text-sm leading-relaxed">
                      {highlightedText}
                    </div>
                  ) : (
                    <Textarea
                      placeholder="Paste or type your text here to check for plagiarism..."
                      className="min-h-[150px] resize-none"
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
                            Originality: <span className={score >= 80 ? "text-success" : "text-warning"}>{score}%</span>
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
                          "Check Plagiarism"
                        )}
                      </Button>
                    </div>
                  </div>

                  {analyzed && (
                    <div className="pt-4 border-t">
                      <p className="text-xs text-muted-foreground mb-2">Flagged sections (hover for details):</p>
                      <div className="flex flex-wrap gap-2">
                        {flaggedPhrases.map(
                          (phrase, index) =>
                            inputText.toLowerCase().includes(phrase.text.toLowerCase()) && (
                              <Badge
                                key={index}
                                variant="outline"
                                className="bg-red-500/10 text-red-600 border-red-500/20"
                              >
                                {phrase.similarity}% - {phrase.source}
                              </Badge>
                            ),
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
                        className="min-h-[150px] resize-none"
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
                        <div className="min-h-[150px] rounded-md border bg-muted/30 flex items-center justify-center">
                          <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-6 w-6 animate-spin text-primary" />
                            <span className="text-sm text-muted-foreground">Humanizing...</span>
                          </div>
                        </div>
                      ) : humanizedText ? (
                        <div className="min-h-[150px] p-3 rounded-md border bg-success/5 border-success/20 text-sm leading-relaxed">
                          {humanizedText}
                        </div>
                      ) : (
                        <div className="min-h-[150px] rounded-md border border-dashed bg-muted/20 flex items-center justify-center">
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
                          +{humanScore - (100 - aiScore)}% improvement
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
                            Humanize Text
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
            <Button variant="link" className="gap-2 text-primary" asChild>
              <a href="/signup">
                Try the full version with advanced features
                <ArrowRight className="h-4 w-4" />
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
