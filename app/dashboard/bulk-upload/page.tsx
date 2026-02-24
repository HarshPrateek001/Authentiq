"use client"

import type React from "react"
import { useState, useCallback } from "react"
import { checkFilePlagiarism } from "@/lib/api"
import Link from "next/link"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { LocalDB } from "@/lib/local-db"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Upload,
  FileText,
  X,
  Loader2,
  CheckCircle,
  Clock,
  AlertCircle,
  Play,
  Users,
  FolderOpen,
  Network,
} from "lucide-react"

interface UploadedFile {
  id: string
  name: string
  size: number
  status: "queued" | "processing" | "completed" | "error"
  progress: number
  similarity?: number
  riskLevel?: "safe" | "moderate" | "high"
  author?: string
  group?: string
  originalFile: File
}

import { useToast } from "@/components/ui/use-toast"

export default function BulkUploadPage() {
  const { toast } = useToast()
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [groupName, setGroupName] = useState("")
  const [selectedGroup, setSelectedGroup] = useState("none")
  const [enableInternalMatching, setEnableInternalMatching] = useState(false)

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFiles = Array.from(e.dataTransfer.files).slice(0, 20)
    addFiles(droppedFiles)
  }, [])

  const addFiles = (newFiles: File[]) => {
    const uploadedFiles: UploadedFile[] = newFiles
      .filter((f) => f.type === "application/pdf" || f.name.endsWith(".docx") || f.name.endsWith(".txt"))
      .map((file, index) => ({
        id: Math.random().toString(36).substring(7),
        name: file.name,
        size: file.size,
        status: "queued" as const,
        progress: 0,
        author: `Student ${index + 1}`,
        group: groupName || selectedGroup !== "none" ? selectedGroup : undefined,
        originalFile: file
      }))
    setFiles((prev) => [...prev, ...uploadedFiles])
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files).slice(0, 20))
    }
  }

  const removeFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id))
  }

  const startBulkCheck = async () => {
    if (!LocalDB.checkLimit('bulk')) {
      toast({
        title: "Limit Reached",
        description: "You have reached your daily limit of 1 bulk check for today.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    let anySuccess = false

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.status !== "queued") continue

      setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, status: "processing" as const, progress: 10 } : f)))

      try {
        await new Promise(r => setTimeout(r, 500))
        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 30 } : f)))

        const result = await checkFilePlagiarism(file.originalFile, "en", "other")

        setFiles((prev) => prev.map((f) => (f.id === file.id ? { ...f, progress: 100 } : f)))

        const similarity = Math.round(result.plagiarism_score)
        const riskLevel = similarity < 30 ? "safe" : similarity < 70 ? "moderate" : "high"

        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                ...f,
                status: "completed" as const,
                progress: 100,
                similarity,
                riskLevel: riskLevel as "safe" | "moderate" | "high",
              }
              : f,
          ),
        )
        anySuccess = true
      } catch (error) {
        console.error("Error checking file:", error)
        setFiles((prev) =>
          prev.map((f) =>
            f.id === file.id
              ? {
                ...f,
                status: "error" as const,
                progress: 0,
              }
              : f,
          ),
        )
      }
    }

    if (anySuccess) {
      LocalDB.incrementLimit('bulk')
    }

    setIsProcessing(false)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "queued":
        return <Clock className="h-4 w-4 text-muted-foreground" />
      case "processing":
        return <Loader2 className="h-4 w-4 text-primary animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-success" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />
      default:
        return null
    }
  }

  const statusStyles = {
    safe: "bg-success/10 text-success border-success/20",
    moderate: "bg-warning/10 text-warning-foreground border-warning/20",
    high: "bg-destructive/10 text-destructive border-destructive/20",
  }

  const queuedCount = files.filter((f) => f.status === "queued").length
  const completedCount = files.filter((f) => f.status === "completed").length

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Bulk Upload</h1>
          <p className="text-muted-foreground">Upload and check multiple documents at once.</p>
        </div>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-4 w-4" />
              Group Settings
            </CardTitle>
            <CardDescription>Organize uploads for internal similarity matching</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="groupName">New Group Name</Label>
                <Input
                  id="groupName"
                  placeholder="e.g., CS101 Assignment 3"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Or Select Existing Group</Label>
                <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No Group</SelectItem>
                    <SelectItem value="cs101-fall">CS101 - Fall 2024</SelectItem>
                    <SelectItem value="eng201-fall">ENG201 - Fall 2024</SelectItem>
                    <SelectItem value="bio301-fall">BIO301 - Fall 2024</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Internal Matching</Label>
                <Button
                  variant={enableInternalMatching ? "default" : "outline"}
                  className={`w-full gap-2 ${!enableInternalMatching ? "bg-transparent" : ""}`}
                  onClick={() => setEnableInternalMatching(!enableInternalMatching)}
                >
                  <Network className="h-4 w-4" />
                  {enableInternalMatching ? "Enabled" : "Enable Internal Check"}
                </Button>
              </div>
            </div>
            {enableInternalMatching && (
              <div className="mt-4 p-3 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm text-muted-foreground">
                  Internal matching will compare all documents within this group against each other to detect
                  student-to-student copying.{" "}
                  <Link href="/dashboard/internal-graph" className="text-primary hover:underline">
                    View similarity graph
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <div
          className={`relative rounded-xl border-2 border-dashed p-12 text-center transition-colors ${isDragging ? "border-primary bg-primary/5" : "border-border"
            }`}
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragging(true)
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
        >
          <div className="space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Upload className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">Drop your files here or click to browse</p>
              <p className="text-sm text-muted-foreground">Upload up to 20 files (.pdf, .docx, .txt)</p>
            </div>
            <input
              type="file"
              className="absolute inset-0 cursor-pointer opacity-0"
              accept=".pdf,.docx,.txt"
              multiple
              onChange={handleFileSelect}
              aria-label="Upload files"
            />
          </div>
        </div>

        {files.length > 0 && (
          <>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">
                  {files.length} file{files.length !== 1 ? "s" : ""} selected
                </p>
                <p className="text-xs text-muted-foreground">
                  {completedCount} completed, {queuedCount} queued
                  {(groupName || selectedGroup !== "none") && (
                    <span className="ml-2">
                      <FolderOpen className="h-3 w-3 inline mr-1" />
                      {groupName || selectedGroup}
                    </span>
                  )}
                </p>
              </div>
              <Button onClick={startBulkCheck} disabled={isProcessing || queuedCount === 0} className="gap-2">
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start Bulk Check
                  </>
                )}
              </Button>
            </div>

            <div className="rounded-xl border border-border bg-card overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>File</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Result</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {files.map((file) => (
                    <TableRow key={file.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                          </div>
                          <span className="font-medium truncate max-w-[200px]">{file.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">{file.author || "-"}</TableCell>
                      <TableCell className="text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(file.status)}
                          <span className="capitalize text-sm">{file.status}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {file.status === "processing" ? (
                          <Progress value={file.progress} className="w-24" />
                        ) : file.status === "completed" ? (
                          <span className="text-sm text-muted-foreground">100%</span>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {file.status === "completed" && file.riskLevel ? (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{file.similarity}%</span>
                            <Badge variant="outline" className={statusStyles[file.riskLevel]}>
                              {file.riskLevel.charAt(0).toUpperCase() + file.riskLevel.slice(1)}
                            </Badge>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {file.status === "queued" && (
                          <Button variant="ghost" size="icon" onClick={() => removeFile(file.id)}>
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                        {file.status === "completed" && (
                          <Button variant="ghost" size="sm" asChild>
                            <Link href="/dashboard/reports/1">View</Link>
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </>
        )}

        {files.length === 0 && (
          <div className="rounded-xl border border-border bg-muted/30 p-6 text-center">
            <p className="text-muted-foreground">No files uploaded yet. Drag and drop files above to get started.</p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
