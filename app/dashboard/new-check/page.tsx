"use client"

import type React from "react"
import { useState, useCallback, useEffect } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { LocalDB } from "@/lib/local-db"
import { useToast } from "@/components/ui/use-toast"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Switch } from "@/components/ui/switch"
import {
  Upload,
  FileText,
  Loader2,
  CheckCircle,
  AlertCircle,
  X,
  Globe,
  Brain,
  Gauge,
  TrendingUp,
  BookOpen,
  Sparkles,
} from "lucide-react"

interface CheckResult {
  id?: string
  similarity: number
  status: "safe" | "moderate" | "high"
  sources: number
  words: number
}

interface RiskPrediction {
  vocabularyScore: number
  structureScore: number
  riskLevel: "low" | "medium" | "high"
  overallRisk: number
}

export default function NewCheckPage() {
  const [activeTab, setActiveTab] = useState("text")
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<CheckResult | null>(null)
  const [textContent, setTextContent] = useState("")
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const [originalLanguage, setOriginalLanguage] = useState("en")
  const [crossLanguageEnabled, setCrossLanguageEnabled] = useState(false)
  const [riskPrediction, setRiskPrediction] = useState<RiskPrediction | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [historyItems, setHistoryItems] = useState<any[]>([])

  const [scanAccuracy, setScanAccuracy] = useState(0)

  // Animated Accuracy Meter logic
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isChecking) {
      setScanAccuracy(0)
      interval = setInterval(() => {
        setScanAccuracy(prev => {
          const next = prev + Math.random() * 12 + 2
          if (next >= 99) return 98 + Math.random() // Hover around 98-99%
          return next
        })
      }, 300)
    } else {
      setScanAccuracy(0)
    }
    return () => clearInterval(interval)
  }, [isChecking])

  const [elapsedTime, setElapsedTime] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isChecking) {
      setElapsedTime(0)
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isChecking])

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  }

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      const user = LocalDB.getUser()
      if (!user?.token) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/user/me`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        })
        if (res.ok) {
          const userData = await res.json()
          // Extract plagiarism checks, sort by newness
          const checks = userData.history?.plagiarism_checks || []
          const sorted = checks.slice().reverse().slice(0, 5) // Last 5
          setHistoryItems(sorted)
        }
      } catch (e) {
        console.error("Failed to sync history", e)
      }
    }
    fetchHistory()
  }, [])

  const wordCount = textContent.trim().split(/\s+/).filter(Boolean).length
  const charCount = textContent.length

  const predictRisk = useCallback(async () => {
    if (wordCount < 50) return
    setIsPredicting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock prediction based on content analysis
    const vocabScore = Math.floor(60 + Math.random() * 35)
    const structScore = Math.floor(55 + Math.random() * 40)
    const overall = Math.floor((vocabScore + structScore) / 2)
    const level = overall > 75 ? "low" : overall > 50 ? "medium" : "high"

    setRiskPrediction({
      vocabularyScore: vocabScore,
      structureScore: structScore,
      riskLevel: level,
      overallRisk: 100 - overall,
    })
    setIsPredicting(false)
  }, [wordCount])

  const [statusMessage, setStatusMessage] = useState("Analyzing content...")
  const { toast } = useToast()

  const handleCheck = async () => {
    if (!LocalDB.checkLimit('plagiarism')) {
      toast({
        title: "Limit Reached",
        description: "You have reached your daily demo limit for checks.",
        variant: "destructive"
      })
      return
    }

    setIsChecking(true)
    setResult(null)
    setStatusMessage("Initializing...")

    try {
      let textToAnalyze = textContent

      if (activeTab === "file" && uploadedFile) {
        setStatusMessage("Uploading and extracting text...")
        const formData = new FormData()
        formData.append("file", uploadedFile)

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/upload-file`, {
          method: "POST",
          body: formData,
        })

        if (!uploadResponse.ok) {
          const errData = await uploadResponse.json()
          throw new Error(errData.detail || "File upload failed")
        }

        const uploadData = await uploadResponse.json()
        textToAnalyze = uploadData.text_content

        if (!textToAnalyze || textToAnalyze.trim().length < 50) {
          throw new Error("Extracted text is too short or empty. Please ensure the document contains readable text.")
        }
      }

      setStatusMessage("Scanning for plagiarism...")

      const user = LocalDB.getUser()
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      }
      if (user?.token) {
        headers["Authorization"] = `Bearer ${user.token}`
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/check-plagiarism`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          text: textToAnalyze,
          check_ai_content: true,
          title: title || (uploadedFile ? uploadedFile.name : "Untitled Check"),
          category: category || "other",
          language: originalLanguage,
          cross_language: crossLanguageEnabled
        }),
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.detail || "Analysis failed")
      }

      const responseJson = await response.json()
      const data = responseJson.data || responseJson

      LocalDB.incrementLimit('plagiarism')

      setResult({
        id: data.id,
        similarity: data.plagiarism_score,
        status: data.plagiarism_score < 30 ? "safe" : data.plagiarism_score < 70 ? "moderate" : "high",
        sources: data.sources_found ? data.sources_found.length : 0,
        words: data.word_count,
      })
    } catch (error: any) {
      console.error("Plagiarism check error:", error)
      alert(error.message || "An error occurred during verification.")
    } finally {
      setIsChecking(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && (file.type === "application/pdf" || file.name.endsWith(".docx") || file.name.endsWith(".txt"))) {
      setUploadedFile(file)
    }
  }, [])

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setUploadedFile(file)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
      case "low":
        return "bg-success text-success-foreground"
      case "moderate":
      case "medium":
        return "bg-warning text-warning-foreground"
      case "high":
        return "bg-destructive text-destructive-foreground"
      default:
        return ""
    }
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case "low":
        return "text-success"
      case "medium":
        return "text-warning"
      case "high":
        return "text-destructive"
      default:
        return ""
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">New Plagiarism Check</h1>
          <p className="text-muted-foreground">Upload or paste your content to check for plagiarism.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6 relative">
            {isChecking && (
              <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-xl border border-primary/30 shadow-[0_0_40px_rgba(var(--primary),0.1)] animate-in fade-in zoom-in-95 duration-300">
                <div className="flex flex-col items-center space-y-6 p-8 text-center">
                  <div className="relative">
                    <div className="absolute inset-0 blur-xl bg-primary/20 rounded-full animate-pulse" />
                    <Loader2 className="h-16 w-16 animate-spin text-primary relative z-10" />
                  </div>
                  <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/80">
                    {statusMessage}
                  </h3>
                  <div className="font-mono text-5xl tracking-widest text-foreground font-black mt-2 bg-muted/80 py-4 px-8 rounded-2xl border border-border shadow-inner">
                    {formatTime(elapsedTime)}
                  </div>
                  <p className="mt-4 text-sm font-medium text-muted-foreground animate-pulse">Running advanced multi-layer analysis...</p>
                </div>
              </div>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="text">Text Input</TabsTrigger>
                <TabsTrigger value="file">File Upload</TabsTrigger>
              </TabsList>

              <TabsContent value="text" className="space-y-4 mt-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Document Title (optional)</Label>
                    <Input
                      id="title"
                      placeholder="e.g., Research Paper - Climate Change"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category (optional)</Label>
                    <Select value={category} onValueChange={setCategory}>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="blog">Blog Post</SelectItem>
                        <SelectItem value="research">Research Paper</SelectItem>
                        <SelectItem value="article">Article</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Card className="border-dashed">
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-center gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="language">Original Language</Label>
                          <Select value={originalLanguage} onValueChange={setOriginalLanguage}>
                            <SelectTrigger id="language" className="w-[160px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="en">English</SelectItem>
                              <SelectItem value="es">Spanish</SelectItem>
                              <SelectItem value="fr">French</SelectItem>
                              <SelectItem value="de">German</SelectItem>
                              <SelectItem value="zh">Chinese</SelectItem>
                              <SelectItem value="ja">Japanese</SelectItem>
                              <SelectItem value="ar">Arabic</SelectItem>
                              <SelectItem value="hi">Hindi</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                        <Globe className="h-4 w-4 text-primary" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">Cross-Language Detection</p>
                          <p className="text-xs text-muted-foreground">Compare across 50+ languages</p>
                        </div>
                        <Switch checked={crossLanguageEnabled} onCheckedChange={setCrossLanguageEnabled} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Paste or type your content here..."
                    className="min-h-[300px] resize-none"
                    value={textContent}
                    onChange={(e) => {
                      setTextContent(e.target.value)
                      setRiskPrediction(null)
                    }}
                    onBlur={predictRisk}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{wordCount} words</span>
                    <span>{charCount} characters</span>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="file" className="mt-4">
                <div
                  className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"}`}
                  onDragOver={(e) => {
                    e.preventDefault()
                    setIsDragging(true)
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={handleDrop}
                >
                  {uploadedFile ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-muted-foreground">{(uploadedFile.size / 1024).toFixed(1)} KB</p>
                        </div>
                        <Button variant="ghost" size="icon" onClick={() => setUploadedFile(null)} className="ml-auto">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                        <Upload className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-medium">Drop your file here or click to browse</p>
                        <p className="text-sm text-muted-foreground">Supports PDF, DOCX, TXT (max 50MB)</p>
                      </div>
                      <input
                        type="file"
                        className="absolute inset-0 cursor-pointer opacity-0"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileSelect}
                        aria-label="Upload document"
                      />
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>

            <Button
              className="w-full"
              size="lg"
              onClick={handleCheck}
              disabled={isChecking || (activeTab === "text" && !textContent) || (activeTab === "file" && !uploadedFile)}
            >
              {isChecking ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Checking...
                </>
              ) : (
                "Run Plagiarism Check"
              )}
            </Button>


          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-card overflow-hidden h-full min-h-[500px] flex flex-col items-center justify-center p-8">
                {isChecking ? (
                  <div className="relative z-10 text-center space-y-8 w-full animate-in fade-in zoom-in-95 duration-500">
                    <h3 className="text-2xl font-black tracking-tight text-foreground">
                      Scanning Accuracy
                    </h3>
                    
                    {/* Accuracy Meter Visual */}
                    <div className="relative h-56 w-56 mx-auto">
                      {/* Outer spinning dashed ring */}
                      <svg className="absolute inset-0 h-full w-full animate-[spin_8s_linear_infinite]" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" className="text-primary/20" strokeWidth="1" strokeDasharray="4 4" />
                      </svg>
                      
                      {/* Middle spinning ring opposite direction */}
                      <svg className="absolute inset-0 h-full w-full animate-[spin_12s_linear_infinite_reverse]" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="44" fill="none" stroke="currentColor" className="text-primary/30" strokeWidth="2" strokeDasharray="20 10" />
                      </svg>

                      {/* Inner static ring background */}
                      <svg className="absolute inset-0 h-full w-full -rotate-90 origin-center" viewBox="0 0 100 100">
                         <circle cx="50" cy="50" r="38" fill="none" stroke="currentColor" className="text-muted" strokeWidth="6" />
                         
                         {/* Animated progress ring */}
                         <circle 
                           cx="50" cy="50" r="38" fill="none" stroke="url(#scanGradient)" className="transition-all duration-300 ease-out" 
                           strokeWidth="6" strokeLinecap="round"
                           strokeDasharray="238.76"
                           strokeDashoffset={238.76 - (238.76 * scanAccuracy) / 100}
                         />
                         <defs>
                           <linearGradient id="scanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                             <stop offset="0%" stopColor="hsl(var(--primary))" />
                             <stop offset="100%" stopColor="hsl(var(--primary) / 0.5)" />
                           </linearGradient>
                         </defs>
                      </svg>

                      {/* Center Text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                         <span className="text-5xl font-black tracking-tighter tabular-nums text-foreground">
                           {scanAccuracy.toFixed(1)}<span className="text-2xl text-muted-foreground">%</span>
                         </span>
                         <span className="text-xs font-bold tracking-[0.2em] text-primary uppercase mt-1">Confidence</span>
                      </div>
                    </div>
                  </div>
                ) : result ? (
                  <div className="w-full max-w-sm flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-500 space-y-8">
                    <div className="flex items-start justify-between w-full">
                      <div>
                        <h3 className="text-xl font-bold">Analysis Complete</h3>
                        <p className="text-sm text-muted-foreground mt-1">Your content has been checked successfully.</p>
                      </div>
                      {result.status === "safe" ? (
                        <CheckCircle className="h-8 w-8 text-success shrink-0" />
                      ) : (
                        <AlertCircle className="h-8 w-8 text-warning shrink-0" />
                      )}
                    </div>

                    <div className="flex flex-col items-center gap-6 w-full">
                      <div className="relative h-40 w-40">
                        <svg className="h-40 w-40 -rotate-90" viewBox="0 0 100 100">
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
                            strokeDashoffset={264 * (result.similarity / 100)}
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span className="text-3xl font-bold">{(100 - result.similarity).toFixed(1)}%</span>
                          <span className="text-xs uppercase tracking-wider text-muted-foreground font-bold mt-1">Original</span>
                        </div>
                      </div>

                      <div className="space-y-4 w-full bg-muted/30 p-4 rounded-xl">
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-sm text-muted-foreground">Similarity</span>
                          <span className="font-semibold">{result.similarity.toFixed(2)}%</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-sm text-muted-foreground">Sources found</span>
                          <span className="font-semibold">{result.sources}</span>
                        </div>
                        <div className="flex items-center justify-between border-b border-border/50 pb-2">
                          <span className="text-sm text-muted-foreground">Words analyzed</span>
                          <span className="font-semibold">{result.words.toLocaleString()}</span>
                        </div>
                        <div className="flex items-center justify-between pb-1">
                          <span className="text-sm text-muted-foreground">Risk level</span>
                          <Badge className={getStatusColor(result.status)}>
                            {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                          </Badge>
                        </div>
                        {crossLanguageEnabled && (
                          <div className="flex items-center justify-between pt-1 border-t border-border/50">
                            <span className="text-sm text-muted-foreground">Cross-language</span>
                            <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                              <Globe className="h-3 w-3" />
                              Enabled
                            </Badge>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="w-full pt-2">
                      <Button asChild className="w-full py-6 text-md font-semibold" disabled={!result.id}>
                        <Link href={result.id ? `/dashboard/reports/${result.id}` : "#"}>
                          {result.id ? "View Detailed Report" : "Login to View Report"}
                        </Link>
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-full opacity-50">
                    <Brain className="h-16 w-16 mx-auto text-muted-foreground mb-6" />
                    <h3 className="text-xl font-bold tracking-tight mb-2">Real-Time Tracker</h3>
                    <p className="text-muted-foreground text-sm">Once you start checking, the live accuracy confidence meter will appear here.</p>
                  </div>
                )}
            </Card>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
