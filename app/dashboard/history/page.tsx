"use client"

import { useState } from "react"
import Link from "next/link"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  Search,
  FileText,
  Upload,
  MoreHorizontal,
  Eye,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

const historyData = [
  {
    id: "1",
    title: "Research Paper - Climate Change",
    type: "file",
    date: "Dec 5, 2024",
    similarity: 8,
    status: "safe",
  },
  {
    id: "2",
    title: "Blog Post - Tech Trends 2024",
    type: "text",
    date: "Dec 4, 2024",
    similarity: 23,
    status: "moderate",
  },
  { id: "3", title: "Essay - Literature Review", type: "file", date: "Dec 3, 2024", similarity: 5, status: "safe" },
  { id: "4", title: "Article - Market Analysis", type: "text", date: "Dec 2, 2024", similarity: 45, status: "high" },
  { id: "5", title: "Report - Q4 Summary", type: "file", date: "Dec 1, 2024", similarity: 12, status: "safe" },
  { id: "6", title: "Thesis Chapter 1", type: "file", date: "Nov 30, 2024", similarity: 18, status: "moderate" },
  { id: "7", title: "Product Description", type: "text", date: "Nov 29, 2024", similarity: 3, status: "safe" },
  { id: "8", title: "Press Release Draft", type: "text", date: "Nov 28, 2024", similarity: 7, status: "safe" },
]

const statusStyles = {
  safe: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning-foreground border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 5

  const filteredData = historyData.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || item.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil(filteredData.length / itemsPerPage)
  const paginatedData = filteredData.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">History</h1>
          <p className="text-muted-foreground">View all your previous plagiarism checks.</p>
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by title..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="safe">Safe</SelectItem>
                <SelectItem value="moderate">Moderate</SelectItem>
                <SelectItem value="high">High Risk</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Document</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Similarity</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-[70px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedData.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                        {item.type === "file" ? (
                          <FileText className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <Upload className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                      <span className="font-medium">{item.title}</span>
                    </div>
                  </TableCell>
                  <TableCell className="capitalize text-muted-foreground">{item.type}</TableCell>
                  <TableCell className="text-muted-foreground">{item.date}</TableCell>
                  <TableCell>
                    <span className="font-medium">{item.similarity}%</span>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusStyles[item.status as keyof typeof statusStyles]}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/dashboard/reports/${item.id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Report
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
              {Math.min(currentPage * itemsPerPage, filteredData.length)} of {filteredData.length} results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="bg-transparent"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(page)}
                  className={currentPage !== page ? "bg-transparent" : ""}
                >
                  {page}
                </Button>
              ))}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="bg-transparent"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
