"use client"

import { useState, useEffect, useRef } from "react"
import { AppLayout } from "@/components/layouts/app-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Users,
  Network,
  AlertTriangle,
  FileText,
  Download,
  RefreshCw,
  Info,
  ArrowRight,
  Circle,
  Eye,
} from "lucide-react"

interface Student {
  id: string
  name: string
  email: string
  documents: number
  flaggedCount: number
}

interface SimilarityLink {
  source: string
  target: string
  similarity: number
  document1: string
  document2: string
}

interface Cluster {
  id: string
  students: string[]
  avgSimilarity: number
  riskLevel: "low" | "medium" | "high"
}

const mockStudents: Student[] = [
  { id: "1", name: "Alice Johnson", email: "alice@university.edu", documents: 5, flaggedCount: 2 },
  { id: "2", name: "Bob Smith", email: "bob@university.edu", documents: 4, flaggedCount: 1 },
  { id: "3", name: "Carol Davis", email: "carol@university.edu", documents: 6, flaggedCount: 3 },
  { id: "4", name: "David Lee", email: "david@university.edu", documents: 3, flaggedCount: 0 },
  { id: "5", name: "Emma Wilson", email: "emma@university.edu", documents: 5, flaggedCount: 2 },
  { id: "6", name: "Frank Brown", email: "frank@university.edu", documents: 4, flaggedCount: 1 },
  { id: "7", name: "Grace Miller", email: "grace@university.edu", documents: 3, flaggedCount: 0 },
  { id: "8", name: "Henry Taylor", email: "henry@university.edu", documents: 5, flaggedCount: 2 },
]

const mockLinks: SimilarityLink[] = [
  {
    source: "1",
    target: "3",
    similarity: 78,
    document1: "Research Paper - AI Ethics",
    document2: "Essay - AI in Society",
  },
  {
    source: "2",
    target: "5",
    similarity: 65,
    document1: "Climate Analysis Report",
    document2: "Environmental Study",
  },
  {
    source: "1",
    target: "5",
    similarity: 45,
    document1: "Introduction to ML",
    document2: "Machine Learning Basics",
  },
  {
    source: "3",
    target: "8",
    similarity: 82,
    document1: "Data Science Project",
    document2: "Analytics Report",
  },
  {
    source: "2",
    target: "6",
    similarity: 38,
    document1: "Statistics Review",
    document2: "Math Analysis",
  },
  { source: "5", target: "8", similarity: 55, document1: "Neural Networks", document2: "Deep Learning Essay" },
]

const mockClusters: Cluster[] = [
  {
    id: "1",
    students: ["Alice Johnson", "Carol Davis", "Emma Wilson", "Henry Taylor"],
    avgSimilarity: 65,
    riskLevel: "high",
  },
  { id: "2", students: ["Bob Smith", "Frank Brown"], avgSimilarity: 38, riskLevel: "low" },
]

export default function InternalGraphPage() {
  const [selectedGroup, setSelectedGroup] = useState("all")
  const [selectedView, setSelectedView] = useState("graph")
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hoveredNode, setHoveredNode] = useState<string | null>(null)

  // Draw the graph visualization
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Calculate node positions in a circle
    const centerX = width / 2
    const centerY = height / 2
    const radius = Math.min(width, height) / 3

    const nodePositions: Record<string, { x: number; y: number }> = {}
    mockStudents.forEach((student, index) => {
      const angle = (index / mockStudents.length) * 2 * Math.PI - Math.PI / 2
      nodePositions[student.id] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      }
    })

    // Draw links
    mockLinks.forEach((link) => {
      const source = nodePositions[link.source]
      const target = nodePositions[link.target]
      if (!source || !target) return

      ctx.beginPath()
      ctx.moveTo(source.x, source.y)
      ctx.lineTo(target.x, target.y)

      // Color based on similarity
      if (link.similarity >= 70) {
        ctx.strokeStyle = "rgba(239, 68, 68, 0.6)" // red
        ctx.lineWidth = 3
      } else if (link.similarity >= 50) {
        ctx.strokeStyle = "rgba(234, 179, 8, 0.6)" // yellow
        ctx.lineWidth = 2
      } else {
        ctx.strokeStyle = "rgba(34, 197, 94, 0.4)" // green
        ctx.lineWidth = 1
      }

      ctx.stroke()

      // Draw similarity label on link
      const midX = (source.x + target.x) / 2
      const midY = (source.y + target.y) / 2
      ctx.fillStyle = "#6b7280"
      ctx.font = "10px sans-serif"
      ctx.fillText(`${link.similarity}%`, midX - 10, midY - 5)
    })

    // Draw nodes
    mockStudents.forEach((student) => {
      const pos = nodePositions[student.id]
      if (!pos) return

      const nodeRadius = student.flaggedCount > 0 ? 20 + student.flaggedCount * 3 : 18

      // Node circle
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, nodeRadius, 0, 2 * Math.PI)

      if (student.flaggedCount >= 2) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.2)"
        ctx.strokeStyle = "#ef4444"
      } else if (student.flaggedCount === 1) {
        ctx.fillStyle = "rgba(234, 179, 8, 0.2)"
        ctx.strokeStyle = "#eab308"
      } else {
        ctx.fillStyle = "rgba(34, 197, 94, 0.2)"
        ctx.strokeStyle = "#22c55e"
      }

      ctx.lineWidth = 2
      ctx.fill()
      ctx.stroke()

      // Node label
      ctx.fillStyle = "#374151"
      ctx.font = "11px sans-serif"
      ctx.textAlign = "center"
      const name = student.name.split(" ")[0]
      ctx.fillText(name, pos.x, pos.y + nodeRadius + 14)
    })
  }, [hoveredNode])

  const getRiskBadge = (level: string) => {
    switch (level) {
      case "high":
        return <Badge className="bg-destructive text-destructive-foreground">High Risk</Badge>
      case "medium":
        return <Badge className="bg-warning text-warning-foreground">Medium Risk</Badge>
      default:
        return <Badge className="bg-success text-success-foreground">Low Risk</Badge>
    }
  }

  const totalFlagged = mockStudents.reduce((acc, s) => acc + s.flaggedCount, 0)
  const highRiskLinks = mockLinks.filter((l) => l.similarity >= 70).length

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Internal Similarity Analysis</h1>
            <p className="text-muted-foreground">Detect student-to-student content matching</p>
          </div>
          <div className="flex items-center gap-2">
            <Select value={selectedGroup} onValueChange={setSelectedGroup}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select group" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Groups</SelectItem>
                <SelectItem value="cs101">CS101 - Fall 2024</SelectItem>
                <SelectItem value="eng201">ENG201 - Fall 2024</SelectItem>
                <SelectItem value="bio301">BIO301 - Fall 2024</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export Report
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockStudents.length}</p>
                  <p className="text-xs text-muted-foreground">Total Students</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Network className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{mockLinks.length}</p>
                  <p className="text-xs text-muted-foreground">Similarity Links</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{highRiskLinks}</p>
                  <p className="text-xs text-muted-foreground">High Risk Matches</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-warning/10">
                  <FileText className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{totalFlagged}</p>
                  <p className="text-xs text-muted-foreground">Flagged Documents</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {highRiskLinks > 0 && (
          <Alert className="bg-destructive/10 border-destructive/20">
            <AlertTriangle className="h-4 w-4 text-destructive" />
            <AlertDescription>
              {highRiskLinks} high-risk similarity match{highRiskLinks > 1 ? "es" : ""} detected. Review the connections
              below for potential academic integrity concerns.
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={selectedView} onValueChange={setSelectedView}>
          <TabsList>
            <TabsTrigger value="graph">Network Graph</TabsTrigger>
            <TabsTrigger value="clusters">Similarity Clusters</TabsTrigger>
            <TabsTrigger value="table">Detailed View</TabsTrigger>
          </TabsList>

          <TabsContent value="graph" className="mt-4">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Similarity Network</CardTitle>
                    <CardDescription>Visual representation of content matches between students</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2">
                    <RefreshCw className="h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={500}
                    className="w-full h-auto border rounded-lg bg-muted/20"
                  />
                  {/* Legend */}
                  <div className="absolute bottom-4 left-4 p-3 rounded-lg bg-background/90 backdrop-blur border shadow-sm">
                    <p className="text-xs font-medium mb-2">Legend</p>
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-red-500/20 text-red-500" />
                        <span className="text-xs text-muted-foreground">High similarity (70%+)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-amber-500/20 text-amber-500" />
                        <span className="text-xs text-muted-foreground">Medium (50-69%)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Circle className="h-3 w-3 fill-emerald-500/20 text-emerald-500" />
                        <span className="text-xs text-muted-foreground">Low (&lt;50%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="clusters" className="mt-4">
            <div className="grid gap-4 md:grid-cols-2">
              {mockClusters.map((cluster) => (
                <Card key={cluster.id} className={cluster.riskLevel === "high" ? "border-destructive/50" : ""}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">Cluster #{cluster.id}</CardTitle>
                      {getRiskBadge(cluster.riskLevel)}
                    </div>
                    <CardDescription>
                      {cluster.students.length} students with {cluster.avgSimilarity}% average similarity
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex flex-wrap gap-2">
                        {cluster.students.map((student, index) => (
                          <Badge key={index} variant="outline" className="bg-muted/50">
                            {student}
                          </Badge>
                        ))}
                      </div>
                      <Button variant="outline" size="sm" className="w-full gap-2 bg-transparent">
                        <Eye className="h-4 w-4" />
                        View Detailed Comparison
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <Card className="border-dashed flex items-center justify-center min-h-[200px]">
                <div className="text-center p-6">
                  <Info className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">
                    Clusters are automatically generated based on similarity patterns
                  </p>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="table" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>All Similarity Matches</CardTitle>
                <CardDescription>Complete list of detected content matches</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student 1</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead className="text-center">Similarity</TableHead>
                      <TableHead>Student 2</TableHead>
                      <TableHead>Document</TableHead>
                      <TableHead className="text-right">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockLinks
                      .sort((a, b) => b.similarity - a.similarity)
                      .map((link, index) => {
                        const student1 = mockStudents.find((s) => s.id === link.source)
                        const student2 = mockStudents.find((s) => s.id === link.target)
                        return (
                          <TableRow key={index}>
                            <TableCell className="font-medium">{student1?.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                              {link.document1}
                            </TableCell>
                            <TableCell className="text-center">
                              <div className="flex items-center justify-center gap-2">
                                <Badge
                                  variant="outline"
                                  className={
                                    link.similarity >= 70
                                      ? "bg-destructive/10 text-destructive border-destructive/20"
                                      : link.similarity >= 50
                                        ? "bg-warning/10 text-warning-foreground border-warning/20"
                                        : "bg-success/10 text-success border-success/20"
                                  }
                                >
                                  {link.similarity}%
                                </Badge>
                                <ArrowRight className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </TableCell>
                            <TableCell className="font-medium">{student2?.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm max-w-[150px] truncate">
                              {link.document2}
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm">
                                Compare
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  )
}
