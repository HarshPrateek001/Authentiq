"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
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
  Download,
  History,
  Info,
  ChevronRight,
  Flame,
  Lightbulb,
  RotateCcw,
  FileIcon,
} from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const intensityLevels = [
  {
    id: "light",
    name: "Light",
    description: "Subtle refinements, maintains original voice",
    icon: Lightbulb,
    color: "text-blue-600",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/30",
    activeColor: "bg-blue-500 text-white border-blue-500",
  },
  {
    id: "balanced",
    name: "Balanced",
    description: "Natural rewrites, human-like flow",
    icon: Sparkles,
    color: "text-primary",
    bgColor: "bg-primary/10",
    borderColor: "border-primary/30",
    activeColor: "bg-primary text-white border-primary",
  },
  {
    id: "aggressive",
    name: "Aggressive",
    description: "Maximum transformation, full humanization",
    icon: Flame,
    color: "text-amber-600",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    activeColor: "bg-amber-500 text-white border-amber-500",
  },
]

const recentHistory = [
  {
    id: 1,
    preview: "The advancement of artificial intelligence has revolutionized...",
    date: "2 hours ago",
    words: 245,
    status: "completed" as const,
  },
  {
    id: 2,
    preview: "Climate change represents one of the most pressing...",
    date: "Yesterday",
    words: 312,
    status: "completed" as const,
  },
  {
    id: 3,
    preview: "In contemporary business environments, digital transformation...",
    date: "3 days ago",
    words: 189,
    status: "completed" as const,
  },
]

import { useToast } from "@/components/ui/use-toast"
import { humanizeText, downloadHumanizedContent } from "@/lib/api"
import { LocalDB } from "@/lib/local-db"

export default function HumanizerPage() {
  const { toast } = useToast()
  const [inputText, setInputText] = useState("")
  const [outputText, setOutputText] = useState("")
  const [intensity, setIntensity] = useState("balanced")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState("text")
  const [aiScore, setAiScore] = useState<number | null>(null)
  const [humanScore, setHumanScore] = useState<number | null>(null)
  const [processingPhase, setProcessingPhase] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // New States for Humanizer Parameters
  const [targetLanguage, setTargetLanguage] = useState("English")
  const [contentType, setContentType] = useState("Article")
  const [crossLanguageEnabled, setCrossLanguageEnabled] = useState(true) // Default to on as requested
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
          // Extract humanize requests, sort by newness
          const requests = userData.history?.humanize_requests || []
          const sorted = requests.slice().reverse().slice(0, 5) // Last 5
          setHistoryItems(sorted)
        }
      } catch (e) {
        console.error("Failed to sync history", e)
      }
    }
    fetchHistory()
  }, [])

  const wordCount = inputText.trim() ? inputText.trim().split(/\s+/).length : 0
  const charCount = inputText.length

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) setSelectedFile(file)
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const handleGenerate = async () => {
    if (!inputText.trim() && !selectedFile) return

    setIsProcessing(true)
    setProcessingPhase(1)

    try {
      // Prepare API parameters based on user selection
      let style = "natural"
      let complexity = "moderate"
      if (intensity === "light") {
        complexity = "simple"
      } else if (intensity === "aggressive") {
        style = "creative"
        complexity = "advanced"
      }

      if (!LocalDB.checkLimit('humanizer')) {
        toast({
          title: "Limit Reached",
          description: "You have reached your daily limit of 5 AI humanizations.",
          variant: "destructive"
        })
        setIsProcessing(false) // Reset state
        setProcessingPhase(0)
        return
      }

      const textToProcess = inputText // Future: Handle file content reading if selectedFile is present

      const result = await humanizeText(
        textToProcess,
        style,
        complexity,
        targetLanguage,
        contentType
      )

      LocalDB.incrementLimit('humanizer')

      setProcessingPhase(2)
      // Small delay to show phase 2 briefly if needed, or just proceed
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOutputText(result.humanized_text)

      // Update scores
      setAiScore(Math.round(result.original_ai_score))
      // Human score is inverse of AI score for the humanized text
      setHumanScore(Math.round(100 - result.humanized_ai_score))

      toast({
        title: "Success",
        description: "Content humanized successfully!",
      })

    } catch (error: any) {
      console.error("Humanization error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to humanize content. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
      setProcessingPhase(0)
    }
  }

  const handleCopy = async () => {
    if (!outputText) return
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(outputText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast({
          description: "Copied to clipboard",
        })
      } else {
        // Fallback for older browsers or if api is missing
        const textarea = document.createElement("textarea")
        textarea.value = outputText
        document.body.appendChild(textarea)
        textarea.select()
        document.execCommand("copy")
        document.body.removeChild(textarea)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast({
          description: "Copied to clipboard",
        })
      }
    } catch (err) {
      console.error('Failed to copy text: ', err)
      toast({
        title: "Error",
        description: "Failed to copy text to clipboard",
        variant: "destructive"
      })
    }
  }

  const handleReset = () => {
    setInputText("")
    setOutputText("")
    setAiScore(null)
    setHumanScore(null)
    setSelectedFile(null)
    setProcessingPhase(0)
  }

  const handleDownload = async (format: "txt" | "word" | "pdf") => {
    if (!outputText) return

    try {
      const blob = await downloadHumanizedContent(outputText, format)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      const extension = format === "word" ? "docx" : format
      a.download = `humanized_content.${extension}`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Success",
        description: `Downloaded as ${format.toUpperCase()}`,
      })
    } catch (error: any) {
      console.error("Download error:", error)
      toast({
        title: "Error",
        description: "Failed to download file.",
        variant: "destructive",
      })
    }
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-white shadow-lg shadow-primary/20">
                <Wand2 className="h-5 w-5" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">AI Humanizer</h1>
                <p className="text-sm text-muted-foreground">
                  Transform AI-generated content into natural, authentic human text
                </p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon">
                    <History className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>View History</TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={handleReset}>
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset</span>
            </Button>
          </div>
        </div>

        <div className="flex gap-4 rounded-xl border border-primary/20 bg-primary/5 p-4">
          <Info className="h-5 w-5 text-primary mt-0.5 shrink-0" />
          <div className="text-sm space-y-1">
            <p className="font-semibold text-primary">How AI Humanizer Works</p>
            <p className="text-muted-foreground">
              Our advanced algorithms analyze text patterns and regenerate content using natural language variations,
              diverse sentence structures, and authentic human writing behaviors to create humanlike output.
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Input Section */}
          <Card className="lg:col-span-1 border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Input Content
              </CardTitle>
              <CardDescription>Paste or upload AI-generated text</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2 mb-4">
                  <TabsTrigger value="text" className="gap-2">
                    <FileText className="h-4 w-4" />
                    <span className="hidden sm:inline">Text</span>
                  </TabsTrigger>
                  <TabsTrigger value="file" className="gap-2">
                    <Upload className="h-4 w-4" />
                    <span className="hidden sm:inline">File</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="text">
                  <Textarea
                    placeholder="Paste your AI-generated content here..."
                    className="min-h-[280px] resize-none focus-visible:ring-primary/20"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                  />
                </TabsContent>

                <TabsContent value="file">
                  <div
                    className="relative min-h-[280px] rounded-lg border-2 border-dashed border-border/50 bg-muted/20 transition-colors hover:border-primary/50 hover:bg-muted/30 cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <input
                      ref={fileInputRef}
                      title="Upload a document for humanization"
                      type="file"
                      accept=".txt,.pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {selectedFile ? (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
                        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 mb-3">
                          <FileText className="h-6 w-6 text-primary" />
                        </div>
                        <p className="font-medium text-center">{selectedFile.name}</p>
                        <p className="text-xs text-muted-foreground mt-1">{(selectedFile.size / 1024).toFixed(1)} KB</p>
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
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <p className="font-medium">Drop file or click</p>
                        <p className="text-xs text-muted-foreground mt-1">TXT, PDF, DOC (max 10MB)</p>
                      </div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>

              <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
                <span>
                  {wordCount} words • {charCount} chars
                </span>
                <span className="text-primary font-medium">10K max</span>
              </div>
            </CardContent>
          </Card>

          {/* Control & Processing Section */}
          <Card className="lg:col-span-1 border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base">Humanization Settings</CardTitle>
              <CardDescription>Select intensity level</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-6">
              <div className="space-y-3">
                {intensityLevels.map((level) => {
                  const Icon = level.icon
                  const isSelected = intensity === level.id
                  return (
                    <TooltipProvider key={level.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            onClick={() => setIntensity(level.id)}
                            className={`w-full flex items-center gap-3 rounded-lg border-2 p-3 transition-all text-left ${isSelected ? level.activeColor : `border-border/50 ${level.bgColor} hover:border-border`
                              }`}
                          >
                            <Icon className="h-5 w-5 shrink-0" />
                            <div className="min-w-0">
                              <p className={`font-medium text-sm ${!isSelected ? level.color : ""}`}>{level.name}</p>
                              {isSelected && <p className="text-xs opacity-90">{level.description}</p>}
                            </div>
                            {isSelected && <Check className="h-4 w-4 ml-auto shrink-0" />}
                          </button>
                        </TooltipTrigger>
                        {!isSelected && (
                          <TooltipContent side="right">
                            <p>{level.description}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>

              {/* New Selectors */}
              <div className="border-t pt-4 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Target Language</p>
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="English">English</SelectItem>
                        <SelectItem value="Spanish">Spanish</SelectItem>
                        <SelectItem value="French">French</SelectItem>
                        <SelectItem value="German">German</SelectItem>
                        <SelectItem value="Hindi">Hindi</SelectItem>
                        <SelectItem value="Chinese">Chinese</SelectItem>
                        <SelectItem value="Arabic">Arabic</SelectItem>
                        <SelectItem value="Japanese">Japanese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-semibold">Content Type</p>
                    <Select value={contentType} onValueChange={setContentType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Article">Article</SelectItem>
                        <SelectItem value="Blog Post">Blog Post</SelectItem>
                        <SelectItem value="Research Paper">Research Paper</SelectItem>
                        <SelectItem value="News Report">News Report</SelectItem>
                        <SelectItem value="Email">Email</SelectItem>
                        <SelectItem value="Essay">Essay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 space-y-3">
                <Button
                  size="lg"
                  className="w-full gap-2 shadow-lg shadow-primary/20"
                  onClick={handleGenerate}
                  disabled={isProcessing || (!inputText.trim() && !selectedFile)}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>
                        {processingPhase === 0 && "Starting..."}
                        {processingPhase === 1 && "Analyzing..."}
                        {processingPhase === 2 && "Humanizing..."}
                      </span>
                    </>
                  ) : (
                    <>
                      <Wand2 className="h-4 w-4" />
                      Humanize
                    </>
                  )}
                </Button>

                {isProcessing && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Processing</span>
                      <span>{Math.round((processingPhase / 3) * 100)}%</span>
                    </div>
                    <Progress value={(processingPhase / 3) * 100} className="h-1.5" />
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Output Section */}
          <Card className="lg:col-span-1 border-border/50">
            <CardHeader className="border-b bg-muted/30">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Humanized Output
              </CardTitle>
              <CardDescription>Your transformed content</CardDescription>
            </CardHeader>
            <CardContent className="p-5 space-y-4">
              {isProcessing ? (
                <div className="min-h-[280px] flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-dashed border-primary/30 bg-primary/5">
                  <div className="relative">
                    <div className="h-14 w-14 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                    <Wand2 className="absolute inset-0 m-auto h-5 w-5 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium">Processing...</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {processingPhase === 1 && "Analyzing content patterns"}
                      {processingPhase === 2 && "Generating human-like text"}
                    </p>
                  </div>
                </div>
              ) : outputText ? (
                <div className="space-y-4">
                  <div className="h-[280px] overflow-y-auto rounded-lg border border-border/50 bg-muted/20 p-4">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{outputText}</p>
                  </div>

                  {aiScore && humanScore && (
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-center space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">Before</p>
                        <p className="text-2xl font-bold text-destructive">{aiScore}%</p>
                        <p className="text-xs text-destructive">AI Detected</p>
                      </div>
                      <div className="rounded-lg border border-success/20 bg-success/5 p-3 text-center space-y-1">
                        <p className="text-xs text-muted-foreground font-medium">After</p>
                        <p className="text-2xl font-bold text-success">{humanScore}%</p>
                        <p className="text-xs text-success">Human Score</p>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 gap-2 bg-transparent" onClick={handleCopy}>
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? "Copied!" : "Copy"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="flex-1 gap-2 bg-transparent">
                          <Download className="h-4 w-4" />
                          Download
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleDownload("word")}>
                          <FileIcon className="mr-2 h-4 w-4" />
                          Word Document (.docx)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload("pdf")}>
                          <FileIcon className="mr-2 h-4 w-4" />
                          PDF Document (.pdf)
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDownload("txt")}>
                          <FileText className="mr-2 h-4 w-4" />
                          Text File (.txt)
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ) : (
                <div className="min-h-[280px] flex flex-col items-center justify-center p-6 text-center rounded-lg border-2 border-dashed border-border/30 bg-muted/10">
                  <Sparkles className="h-8 w-8 text-muted-foreground/50 mb-3" />
                  <p className="font-medium">Ready to humanize</p>
                  <p className="text-xs text-muted-foreground mt-1">Add content and select settings to begin</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Recent History Section */}
        <Card className="border-border/50">
          <CardHeader className="border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="h-4 w-4 text-muted-foreground" />
                <CardTitle className="text-base">Recent Humanizations</CardTitle>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border/50">
              {historyItems.length === 0 ? (
                <div className="p-5 text-center text-sm text-muted-foreground">No recent activity</div>
              ) : (
                historyItems.map((item, idx) => {
                  const details = item.details || {}
                  const dateStr = new Date(item.timestamp).toLocaleString()
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-5 py-3.5 hover:bg-muted/40 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 shrink-0">
                          <FileText className="h-4 w-4 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate max-w-[200px]">{details.original_text || "Content"}</p>
                          <p className="text-xs text-muted-foreground">{details.word_count || 0} words</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-muted-foreground">{dateStr}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </div>
                  )
                }))}
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  )
}
