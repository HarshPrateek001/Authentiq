"use client"

import { useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  ArrowLeft,
  Download,
  Share2,
  Trash2,
  ExternalLink,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  Loader2,
  Globe,
  BookOpen,
  FileText,
  MessageSquare,
  Link2,
  Info,
  Gauge,
  Brain,
  ShieldCheck,
  Zap,
  BarChart3,
} from "lucide-react"

const mockReport = {
  id: "1",
  title: "Research Paper - Climate Change",
  date: "December 5, 2024",
  similarity: 15,
  status: "safe" as const,
  words: 2847,
  // Document Integrity Score breakdown
  integrityScore: {
    overall: 87,
    originality: 85,
    vocabularyDiversity: 92,
    rewritingScore: 88,
    aiDetectionProbability: 18,
  },
  sources: [
    {
      id: 1,
      url: "https://example.com/climate-study",
      title: "Climate Change Study 2024",
      similarity: 8,
      snippet: "Global temperatures have risen by an average of 1.1°C since the pre-industrial era...",
      category: "academic" as const,
    },
    {
      id: 2,
      url: "https://example.com/environment",
      title: "Environmental Impact Report",
      similarity: 4,
      snippet: "The effects of greenhouse gas emissions on ocean acidification have been well documented...",
      category: "journal" as const,
    },
    {
      id: 3,
      url: "https://example.com/research",
      title: "Research Methodology Guide",
      similarity: 3,
      snippet: "When conducting environmental research, it is important to consider multiple variables...",
      category: "blog" as const,
    },
  ],
  // Sentence-level heatmap data
  sentences: [
    {
      text: "Climate change represents one of the most pressing challenges of our time.",
      similarity: 0,
      level: "safe" as const,
    },
    {
      text: "The scientific consensus is clear: human activities, particularly the burning of fossil fuels, have led to unprecedented changes in Earth's climate system.",
      similarity: 5,
      level: "safe" as const,
    },
    {
      text: "Global temperatures have risen by an average of 1.1°C since the pre-industrial era, and this trend is accelerating.",
      similarity: 85,
      level: "high" as const,
      sourceId: 1,
    },
    {
      text: "The Intergovernmental Panel on Climate Change (IPCC) has warned that without significant reductions in greenhouse gas emissions, we could see temperature increases of 2°C or more by the end of this century.",
      similarity: 12,
      level: "safe" as const,
    },
    {
      text: "The impacts of climate change are already visible around the world.",
      similarity: 3,
      level: "safe" as const,
    },
    {
      text: "From more frequent and intense extreme weather events to rising sea levels threatening coastal communities, the evidence is mounting.",
      similarity: 25,
      level: "medium" as const,
    },
    {
      text: "The effects of greenhouse gas emissions on ocean acidification have been well documented, with significant implications for marine ecosystems.",
      similarity: 78,
      level: "high" as const,
      sourceId: 2,
    },
    { text: "Addressing climate change requires a multi-faceted approach.", similarity: 8, level: "safe" as const },
    {
      text: "This includes transitioning to renewable energy sources, improving energy efficiency, protecting and restoring natural carbon sinks like forests and wetlands, and adapting to the changes that are already underway.",
      similarity: 15,
      level: "safe" as const,
    },
    {
      text: "When conducting environmental research, it is important to consider multiple variables and use robust methodologies to ensure reliable results.",
      similarity: 65,
      level: "high" as const,
      sourceId: 3,
    },
    {
      text: "This paper examines the latest findings in climate science and proposes actionable recommendations for policymakers.",
      similarity: 2,
      level: "safe" as const,
    },
  ],
  suggestions: [
    {
      original: "Global temperatures have risen by an average of 1.1°C since the pre-industrial era",
      rewrites: {
        minimal: "Global temperatures have increased by approximately 1.1°C since the pre-industrial period",
        moderate:
          "Earth's average temperature has climbed roughly 1.1 degrees Celsius compared to pre-industrial baseline measurements",
        full: "Scientific measurements indicate our planet has experienced a temperature elevation of about 1.1°C when contrasted with conditions before widespread industrialization",
      },
    },
    {
      original: "The effects of greenhouse gas emissions on ocean acidification have been well documented",
      rewrites: {
        minimal: "The impact of greenhouse gas emissions on ocean acidification is well documented",
        moderate:
          "Extensive research has demonstrated the significant impact of carbon dioxide emissions on decreasing ocean pH levels",
        full: "Comprehensive scientific literature confirms that atmospheric CO2 absorption is causing measurable increases in seawater acidity across global marine environments",
      },
    },
    {
      original: "When conducting environmental research, it is important to consider multiple variables",
      rewrites: {
        minimal: "When performing environmental research, considering multiple variables is important",
        moderate: "Environmental research necessitates the examination of numerous interconnected factors",
        full: "Rigorous investigation of ecological systems demands careful analysis of diverse interacting parameters to ensure methodological validity",
      },
    },
  ],
}

const categoryIcons = {
  academic: BookOpen,
  journal: FileText,
  blog: MessageSquare,
  wikipedia: Globe,
  social: Link2,
}

const categoryColors = {
  academic: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  journal: "bg-purple-500/10 text-purple-600 border-purple-500/20",
  blog: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  wikipedia: "bg-gray-500/10 text-gray-600 border-gray-500/20",
  social: "bg-pink-500/10 text-pink-600 border-pink-500/20",
}

const heatmapColors = {
  safe: "bg-emerald-500/10",
  medium: "bg-amber-500/20",
  high: "bg-red-500/20",
}

export default function ReportDetailPage() {
  const [activeTab, setActiveTab] = useState("content")
  const [rewriteStrength, setRewriteStrength] = useState<"minimal" | "moderate" | "full">("moderate")
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null)
  const [isRewritingAll, setIsRewritingAll] = useState(false)
  const [aiBypassEnabled, setAiBypassEnabled] = useState(false)
  const [isConvertingToHuman, setIsConvertingToHuman] = useState(false)
  const [humanizedPreview, setHumanizedPreview] = useState<string | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "safe":
        return "bg-success/10 text-success border-success/20"
      case "moderate":
        return "bg-warning/10 text-warning-foreground border-warning/20"
      case "high":
        return "bg-destructive/10 text-destructive border-destructive/20"
      default:
        return ""
    }
  }

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  const handleRewriteAll = async () => {
    setIsRewritingAll(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsRewritingAll(false)
  }

  const handleConvertToHuman = async () => {
    setIsConvertingToHuman(true)
    await new Promise((resolve) => setTimeout(resolve, 2500))
    setHumanizedPreview(
      "Climate change stands as one of our era's most urgent challenges. Scientists agree: our activities, especially fossil fuel use, have triggered unprecedented shifts in Earth's climate...",
    )
    setIsConvertingToHuman(false)
  }

  const getIntegrityColor = (score: number) => {
    if (score >= 80) return "text-success"
    if (score >= 60) return "text-warning"
    return "text-destructive"
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/reports">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="text-2xl font-bold">{mockReport.title}</h1>
              <p className="text-muted-foreground">Checked on {mockReport.date}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Download PDF
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4" />
              Delete
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              {/* Originality Score */}
              <div className="rounded-xl border border-border bg-card p-6">
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
                        className="text-primary stroke-current"
                        strokeWidth="8"
                        strokeLinecap="round"
                        fill="transparent"
                        r="42"
                        cx="50"
                        cy="50"
                        strokeDasharray={264}
                        strokeDashoffset={264 * (mockReport.similarity / 100)}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold">{100 - mockReport.similarity}%</span>
                      <span className="text-xs text-muted-foreground">Original</span>
                    </div>
                  </div>
                  <Badge variant="outline" className={getStatusColor(mockReport.status)}>
                    {mockReport.status.charAt(0).toUpperCase() + mockReport.status.slice(1)} Risk
                  </Badge>
                </div>

                <div className="mt-6 space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Similarity</span>
                    <span className="font-medium">{mockReport.similarity}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sources</span>
                    <span className="font-medium">{mockReport.sources.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Words</span>
                    <span className="font-medium">{mockReport.words.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-primary" />
                    <CardTitle className="text-base">Integrity Score</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className={`text-4xl font-bold ${getIntegrityColor(mockReport.integrityScore.overall)}`}>
                      {mockReport.integrityScore.overall}
                    </div>
                    <p className="text-xs text-muted-foreground">out of 100</p>
                  </div>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Originality</span>
                        <span>{mockReport.integrityScore.originality}%</span>
                      </div>
                      <Progress value={mockReport.integrityScore.originality} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Vocabulary Diversity</span>
                        <span>{mockReport.integrityScore.vocabularyDiversity}%</span>
                      </div>
                      <Progress value={mockReport.integrityScore.vocabularyDiversity} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Rewriting Score</span>
                        <span>{mockReport.integrityScore.rewritingScore}%</span>
                      </div>
                      <Progress value={mockReport.integrityScore.rewritingScore} className="h-1.5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">AI Detection Prob.</span>
                        <span>{mockReport.integrityScore.aiDetectionProbability}%</span>
                      </div>
                      <Progress value={mockReport.integrityScore.aiDetectionProbability} className="h-1.5" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-none shadow-md">
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Similarity Heatmap</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-emerald-500/20" />
                      <span className="text-xs text-muted-foreground">Safe (0-20%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-amber-500/30" />
                      <span className="text-xs text-muted-foreground">Medium (21-50%)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-red-500/30" />
                      <span className="text-xs text-muted-foreground">High (51-100%)</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="rounded-xl border border-border bg-card p-4">
                <h3 className="font-semibold mb-3">Matched Sources</h3>
                <div className="space-y-3">
                  {mockReport.sources.map((source) => {
                    const CategoryIcon = categoryIcons[source.category] || Globe
                    return (
                      <a
                        key={source.id}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="text-sm font-medium line-clamp-1">{source.title}</p>
                          <ExternalLink className="h-3 w-3 shrink-0 text-muted-foreground" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="outline"
                            className={`text-[10px] px-1.5 py-0 ${categoryColors[source.category]}`}
                          >
                            <CategoryIcon className="h-3 w-3 mr-1" />
                            {source.category}
                          </Badge>
                          <span className="text-xs text-muted-foreground">{source.similarity}% match</span>
                        </div>
                      </a>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList>
                <TabsTrigger value="content">Content Analysis</TabsTrigger>
                <TabsTrigger value="heatmap">Sentence Heatmap</TabsTrigger>
                <TabsTrigger value="suggestions">AI Rewrite</TabsTrigger>
                <TabsTrigger value="bypass">AI Bypass</TabsTrigger>
              </TabsList>

              {/* Content Analysis Tab */}
              <TabsContent value="content" className="mt-4">
                <div className="rounded-xl border border-border bg-card p-6">
                  <TooltipProvider>
                    <div className="prose prose-sm max-w-none dark:prose-invert space-y-4">
                      {mockReport.sentences.map((sentence, index) => {
                        const source = sentence.sourceId
                          ? mockReport.sources.find((s) => s.id === sentence.sourceId)
                          : null
                        return (
                          <span key={index}>
                            {sentence.level === "high" && source ? (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <span className="bg-destructive/20 text-destructive-foreground px-1 rounded cursor-help border-b-2 border-destructive">
                                    {sentence.text}
                                  </span>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="max-w-xs">
                                  <p className="font-medium">{source.title}</p>
                                  <p className="text-xs text-muted-foreground mt-1">{sentence.similarity}% similar</p>
                                </TooltipContent>
                              </Tooltip>
                            ) : sentence.level === "medium" ? (
                              <span className="bg-warning/20 px-1 rounded">{sentence.text}</span>
                            ) : (
                              sentence.text
                            )}{" "}
                          </span>
                        )
                      })}
                    </div>
                  </TooltipProvider>
                </div>
              </TabsContent>

              <TabsContent value="heatmap" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="h-5 w-5" />
                      Sentence-Level Analysis
                    </CardTitle>
                    <CardDescription>Each sentence is color-coded based on similarity percentage</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {mockReport.sentences.map((sentence, index) => (
                      <div key={index} className={`p-3 rounded-lg ${heatmapColors[sentence.level]} transition-colors`}>
                        <div className="flex items-start justify-between gap-4">
                          <p className="text-sm flex-1">{sentence.text}</p>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="outline" className={getStatusColor(sentence.level)}>
                              {sentence.similarity}%
                            </Badge>
                          </div>
                        </div>
                        {sentence.sourceId && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Source: {mockReport.sources.find((s) => s.id === sentence.sourceId)?.title}
                          </p>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="suggestions" className="mt-4">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                            <Sparkles className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <CardTitle>AI Rewrite Assistant</CardTitle>
                            <CardDescription>Choose rewrite strength and apply suggestions</CardDescription>
                          </div>
                        </div>
                        <Button onClick={handleRewriteAll} disabled={isRewritingAll} className="gap-2">
                          {isRewritingAll ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <RefreshCw className="h-4 w-4" />
                          )}
                          Rewrite All
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/50">
                        <Label className="text-sm font-medium">Rewrite Strength:</Label>
                        <div className="flex gap-2">
                          {(["minimal", "moderate", "full"] as const).map((strength) => (
                            <Button
                              key={strength}
                              variant={rewriteStrength === strength ? "default" : "outline"}
                              size="sm"
                              onClick={() => setRewriteStrength(strength)}
                              className="capitalize"
                            >
                              {strength}
                            </Button>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {mockReport.suggestions.map((suggestion, index) => (
                    <Card key={index}>
                      <CardContent className="p-4 space-y-4">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">ORIGINAL</p>
                          <p className="text-sm bg-destructive/10 text-destructive p-3 rounded-lg">
                            {suggestion.original}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-2">
                            SUGGESTED ({rewriteStrength.toUpperCase()})
                          </p>
                          <p className="text-sm bg-success/10 text-success p-3 rounded-lg">
                            {suggestion.rewrites[rewriteStrength]}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-transparent gap-2"
                            onClick={() => handleCopy(suggestion.rewrites[rewriteStrength], index)}
                          >
                            {copiedIndex === index ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
                            {copiedIndex === index ? "Copied" : "Copy"}
                          </Button>
                          <Button size="sm">Apply Suggestion</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="bypass" className="mt-4">
                <Card>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Brain className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle>AI Detection Bypass</CardTitle>
                        <CardDescription>Convert AI-generated content to human-written style</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertDescription>
                        This feature restructures sentences and adjusts vocabulary to make content appear more naturally
                        written while preserving the original meaning.
                      </AlertDescription>
                    </Alert>

                    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary" />
                        <div>
                          <p className="font-medium text-sm">Enable Human-Style Conversion</p>
                          <p className="text-xs text-muted-foreground">Transform content to bypass AI detectors</p>
                        </div>
                      </div>
                      <Switch checked={aiBypassEnabled} onCheckedChange={setAiBypassEnabled} />
                    </div>

                    {aiBypassEnabled && (
                      <>
                        <Button onClick={handleConvertToHuman} disabled={isConvertingToHuman} className="w-full gap-2">
                          {isConvertingToHuman ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Zap className="h-4 w-4" />
                          )}
                          Convert to Human-Written Style
                        </Button>

                        {humanizedPreview && (
                          <div className="space-y-4">
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">BEFORE</p>
                              <p className="text-sm p-4 rounded-lg bg-muted/50">
                                {mockReport.sentences
                                  .slice(0, 2)
                                  .map((s) => s.text)
                                  .join(" ")}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-2">AFTER (HUMANIZED)</p>
                              <p className="text-sm p-4 rounded-lg bg-success/10 border border-success/20">
                                {humanizedPreview}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" className="flex-1 bg-transparent">
                                Preview Full Document
                              </Button>
                              <Button className="flex-1">Apply to Document</Button>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
