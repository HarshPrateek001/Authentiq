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

  // Fetch History on Mount
  useEffect(() => {
    const fetchHistory = async () => {
      const user = LocalDB.getUser()
      if (!user?.token) return

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/user/me`, {
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
        description: "You have reached your daily limit of 5 plagiarism checks.",
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

        const uploadResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/upload-file`, {
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

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000"}/api/check-plagiarism`, {
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
        throw new Error("Analysis failed")
      }

      const data = await response.json()

      LocalDB.incrementLimit('plagiarism')

      setResult({
        similarity: data.plagiarism_score,
        status: data.plagiarism_score < 30 ? "safe" : data.plagiarism_score < 70 ? "moderate" : "high",
        sources: data.sources_found.length,
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
          <div className="lg:col-span-2 space-y-6">
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
                  {statusMessage}
                </>
              ) : (
                "Run Plagiarism Check"
              )}
            </Button>

            {result && (
              <div className="rounded-xl border border-border bg-card p-6 space-y-6">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">Analysis Complete</h3>
                    <p className="text-sm text-muted-foreground">Your content has been checked successfully.</p>
                  </div>
                  {result.status === "safe" ? (
                    <CheckCircle className="h-6 w-6 text-success" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-warning" />
                  )}
                </div>

                <div className="flex items-center gap-8">
                  <div className="relative h-32 w-32">
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
                        strokeDashoffset={264 * (result.similarity / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{100 - result.similarity}%</span>
                      <span className="text-xs text-muted-foreground">Original</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Similarity</span>
                      <span className="font-medium">{result.similarity}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Sources found</span>
                      <span className="font-medium">{result.sources}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Words analyzed</span>
                      <span className="font-medium">{result.words.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Risk level</span>
                      <Badge className={getStatusColor(result.status)}>
                        {result.status.charAt(0).toUpperCase() + result.status.slice(1)}
                      </Badge>
                    </div>
                    {crossLanguageEnabled && (
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Cross-language</span>
                        <Badge variant="outline" className="gap-1 bg-blue-500/10 text-blue-600 border-blue-500/20">
                          <Globe className="h-3 w-3" />
                          Enabled
                        </Badge>
                      </div>
                    )}
                  </div>
                </div>

                <Button asChild className="w-full">
                  <Link href="/dashboard/reports/1">View Detailed Report</Link>
                </Button>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-primary" />
                  <CardTitle className="text-base">AI Risk Prediction</CardTitle>
                </div>
                <CardDescription>Pre-check analysis before full scan</CardDescription>
              </CardHeader>
              <CardContent>
                {isPredicting ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                  </div>
                ) : riskPrediction ? (
                  <div className="space-y-4">
                    {/* Animated gauge */}
                    <div className="relative mx-auto w-32 h-20">
                      <svg viewBox="0 0 100 60" className="w-full h-full">
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          className="text-muted"
                        />
                        <path
                          d="M 10 50 A 40 40 0 0 1 90 50"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="8"
                          strokeLinecap="round"
                          className={getRiskColor(riskPrediction.riskLevel)}
                          strokeDasharray="126"
                          strokeDashoffset={126 - (126 * riskPrediction.overallRisk) / 100}
                          style={{ transition: "stroke-dashoffset 1s ease-out" }}
                        />
                      </svg>
                      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                        <span className={`text-2xl font-bold ${getRiskColor(riskPrediction.riskLevel)}`}>
                          {riskPrediction.overallRisk}%
                        </span>
                        <p className="text-[10px] text-muted-foreground">Risk Score</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Vocabulary
                          </span>
                          <span>{riskPrediction.vocabularyScore}%</span>
                        </div>
                        <Progress value={riskPrediction.vocabularyScore} className="h-1.5" />
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground flex items-center gap-1">
                            <TrendingUp className="h-3 w-3" /> Structure
                          </span>
                          <span>{riskPrediction.structureScore}%</span>
                        </div>
                        <Progress value={riskPrediction.structureScore} className="h-1.5" />
                      </div>
                    </div>

                    <div className="p-2 rounded-lg bg-muted/50 text-center">
                      <Badge className={getStatusColor(riskPrediction.riskLevel)}>
                        {riskPrediction.riskLevel.charAt(0).toUpperCase() + riskPrediction.riskLevel.slice(1)} Risk
                      </Badge>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-6 text-muted-foreground text-sm">
                    <Gauge className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>Enter at least 50 words to see risk prediction</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="rounded-xl border border-border bg-card p-4">
              <h3 className="font-semibold mb-4">Previous Checks</h3>
              <div className="space-y-3">
                {historyItems.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No checks yet.</p>
                ) : (
                  historyItems.map((item, index) => {
                    const details = item.details || {}
                    const title = details.file_name || "Text Content Check"
                    const similarity = Math.round(details.plagiarism_score || 0)
                    const time = new Date(item.timestamp).toLocaleDateString()

                    return (
                      <Link
                        key={index}
                        href={`/dashboard/reports/${item.id}`} // Assuming ID links to report
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{title}</p>
                          <p className="text-xs text-muted-foreground">{time}</p>
                        </div>
                        <span className="text-sm font-medium">{similarity}%</span>
                      </Link>
                    )
                  }))}
              </div>
            </div>

            <div className="rounded-xl border border-border bg-muted/30 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-4 w-4 text-primary" />
                <h4 className="font-medium">Tips for best results</h4>
              </div>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>Include at least 250 words for accurate analysis</li>
                <li>Remove headers and footers from documents</li>
                <li>Enable cross-language for translated content</li>
                <li>Check one document at a time for detailed results</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
