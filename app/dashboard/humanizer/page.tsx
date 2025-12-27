"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Wand2,
  Upload,
  Copy,
  Check,
  FileText,
  X,
  Loader2,
  Sparkles,
  Zap,
  Shield,
  RefreshCw,
  Download,
  History,
  Info,
  ChevronRight,
  Bot,
  User,
  ArrowRight,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const intensityLevels = [
  {
    id: "light",
    name: "Light",
    description: "Subtle changes, keeps original tone",
    icon: Zap,
    color: "bg-blue-500/10 text-blue-600 border-blue-500/30",
    activeColor: "bg-blue-500 text-white border-blue-500",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Natural rewrites, optimal quality",
    icon: Sparkles,
    color: "bg-primary/10 text-primary border-primary/30",
    activeColor: "bg-primary text-primary-foreground border-primary",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Maximum variation, full rewrite",
    icon: Shield,
    color: "bg-amber-500/10 text-amber-600 border-amber-500/30",
    activeColor: "bg-amber-500 text-white border-amber-500",
  },
]

const recentHistory = [
  { id: 1, preview: "The implementation of machine learning...", date: "2 hours ago", words: 245 },
  { id: 2, preview: "Climate change represents one of the...", date: "Yesterday", words: 312 },
  { id: 3, preview: "In the contemporary business landscape...", date: "3 days ago", words: 189 },
]

export default function HumanizerPage() {
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [intensity, setIntensity] = useState("balanced")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [aiScore, setAiScore] = useState<number | null>(null)
  const [humanScore, setHumanScore] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleGenerate = async () => {
    if (!inputText.trim() && !selectedFile) return

    setIsProcessing(true)
    setAiScore(null)
    setHumanScore(null)

    // Simulate processing stages
    await new Promise((resolve) => setTimeout(resolve, 800))
    setAiScore(87)

    await new Promise((resolve) => setTimeout(resolve, 1200))

    const intensityText =
      intensity === "light" ? "lightly adjusted" : intensity === "balanced" ? "naturally rewritten" : "fully rewritten"

    setOutputText(
      `${inputText
        .split(". ")
        .map((sentence, i) => {
          if (i % 2 === 0) return sentence.replace(/\b(the|a|an)\b/gi, (m) => (m === "the" ? "this" : m))
          return sentence
        })
        .join(
          ". ",
        )}\n\nThis content has been ${intensityText} to appear more human-written while preserving the original meaning and context.`,
    )
    setHumanScore(96)
    setIsProcessing(false)
  }

  const handleCopy = async () => {
    if (!outputText) return
    await navigator.clipboard.writeText(outputText)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleReset = () => {
    setInputText("")
    setOutputText("")
    setAiScore(null)
    setHumanScore(null)
    setSelectedFile(null)
  }

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
  const charCount = inputText.length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-lg shadow-primary/20">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">AI Humanizer</h1>
              <p className="text-sm text-muted-foreground">
                Transform AI-generated content into natural, human-like text
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" size="icon" className="bg-transparent">
                  <History className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>View History</TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
            <RefreshCw className="h-4 w-4" />
            Reset
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start gap-3 rounded-xl border border-primary/20 bg-primary/5 p-4">
        <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
        <div className="text-sm">
          <p className="font-medium text-primary">How it works</p>
          <p className="text-muted-foreground">
            Our AI analyzes your text's patterns and rewrites it using natural language variations, varied sentence
            structures, and human writing patterns to bypass AI detection systems.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-[1fr,auto,1fr]">
        {/* Input Section */}
        <Card className="overflow-hidden border-border/50">
          <div className="border-b bg-muted/30 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">AI Content Input</span>
              </div>
              {aiScore !== null && (
                <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/30">
                  {aiScore}% AI Detected
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="text" className="gap-2">
                  <FileText className="h-4 w-4" />
                  Paste Text
                </TabsTrigger>
                <TabsTrigger value="file" className="gap-2">
                  <Upload className="h-4 w-4" />
                  Upload File
                </TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="mt-0">
                <Textarea
                  placeholder="Paste your AI-generated content here to humanize it..."
                  className="min-h-[300px] resize-none border-border/50 focus-visible:ring-primary/20"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                />
              </TabsContent>

              <TabsContent value="file" className="mt-0">
                <div
                  className="relative min-h-[300px] rounded-lg border-2 border-dashed border-border/50 bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/30"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".txt,.pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  {selectedFile ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 mb-4">
                        <FileText className="h-7 w-7 text-primary" />
                      </div>
                      <p className="font-medium text-center">{selectedFile.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="mt-3 text-destructive hover:text-destructive"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleRemoveFile()
                        }}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 cursor-pointer">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mb-4">
                        <Upload className="h-7 w-7 text-muted-foreground" />
                      </div>
                      <p className="font-medium">Drop your file here or click to browse</p>
                      <p className="text-sm text-muted-foreground mt-1">Supports TXT, PDF, DOC, DOCX (max 10MB)</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>
                {wordCount} words / {charCount} characters
              </span>
              <span>Max 10,000 words</span>
            </div>
          </CardContent>
        </Card>

        {/* Middle Section - Intensity & Action */}
        <div className="flex flex-col items-center justify-center gap-4 lg:py-8">
          <div className="hidden lg:flex flex-col items-center gap-3">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Intensity</span>
            <div className="flex flex-col gap-2">
              {intensityLevels.map((level) => (
                <TooltipProvider key={level.id}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => setIntensity(level.id)}
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 transition-all ${
                          intensity === level.id ? level.activeColor : level.color
                        }`}
                      >
                        <level.icon className="h-5 w-5" />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p className="font-medium">{level.name}</p>
                      <p className="text-xs text-muted-foreground">{level.description}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </div>

          {/* Mobile intensity selector */}
          <div className="flex lg:hidden w-full gap-2 px-5">
            {intensityLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setIntensity(level.id)}
                className={`flex-1 flex items-center justify-center gap-2 rounded-lg border-2 p-3 transition-all ${
                  intensity === level.id ? level.activeColor : level.color
                }`}
              >
                <level.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{level.name}</span>
              </button>
            ))}
          </div>

          <Button
            size="lg"
            className="gap-2 px-8 shadow-lg shadow-primary/20"
            onClick={handleGenerate}
            disabled={isProcessing || (!inputText.trim() && !selectedFile)}
          >
            {isProcessing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Humanizing...
              </>
            ) : (
              <>
                Humanize
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </Button>

          <div className="hidden lg:block">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>

        {/* Output Section */}
        <Card className="overflow-hidden border-border/50">
          <div className="border-b bg-muted/30 px-5 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Humanized Output</span>
              </div>
              {humanScore !== null && (
                <Badge variant="outline" className="bg-success/10 text-success border-success/30">
                  {humanScore}% Human Score
                </Badge>
              )}
            </div>
          </div>
          <CardContent className="p-5 space-y-4">
            {isProcessing ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">
                <div className="relative">
                  <div className="h-16 w-16 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                  <Wand2 className="absolute inset-0 m-auto h-6 w-6 text-primary" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Analyzing & Rewriting...</p>
                  <p className="text-sm text-muted-foreground mt-1">This usually takes a few seconds</p>
                </div>
                <div className="w-48">
                  <Progress value={aiScore ? 60 : 30} className="h-1" />
                </div>
              </div>
            ) : outputText ? (
              <div className="space-y-4">
                <div className="min-h-[260px] rounded-lg border border-border/50 bg-muted/20 p-4">
                  <p className="whitespace-pre-wrap text-sm leading-relaxed">{outputText}</p>
                </div>

                {/* Score Comparison */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="rounded-lg border border-red-500/20 bg-red-500/5 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Before</p>
                    <p className="text-2xl font-bold text-red-600">{aiScore}%</p>
                    <p className="text-xs text-red-600">AI Detected</p>
                  </div>
                  <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-center">
                    <p className="text-xs text-muted-foreground mb-1">After</p>
                    <p className="text-2xl font-bold text-success">{humanScore}%</p>
                    <p className="text-xs text-success">Human Score</p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                    {copied ? "Copied!" : "Copy Text"}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            ) : (
              <div className="min-h-[300px] flex flex-col items-center justify-center p-6 text-center rounded-lg border border-dashed border-border/50 bg-muted/10">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-muted mb-4">
                  <Wand2 className="h-7 w-7 text-muted-foreground" />
                </div>
                <p className="font-medium">Your humanized text will appear here</p>
                <p className="text-sm text-muted-foreground mt-1">Paste content on the left and click "Humanize"</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent History */}
      <Card className="border-border/50">
        <div className="border-b bg-muted/30 px-5 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Recent Humanizations</span>
            </div>
            <Button variant="ghost" size="sm" className="text-xs">
              View All
            </Button>
          </div>
        </div>
        <CardContent className="p-0">
          <div className="divide-y divide-border/50">
            {recentHistory.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between px-5 py-3 hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium truncate max-w-[200px] sm:max-w-[300px]">{item.preview}</p>
                    <p className="text-xs text-muted-foreground">{item.words} words</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground">{item.date}</span>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
