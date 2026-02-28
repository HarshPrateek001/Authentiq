"use client"
import Link from "next/link"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LocalDB } from "@/lib/local-db"
import { AppLayout } from "@/components/layouts/app-layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { FileText, Download, Search, ExternalLink, Loader2 } from "lucide-react"

type ReportObj = {
  id: string;
  title: string;
  date: string;
  similarity: number;
  status: string;
  words: number;
}

const statusStyles = {
  safe: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning-foreground border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
}

export default function ReportsPage() {
  const router = useRouter()
  const [reports, setReports] = useState<ReportObj[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  useEffect(() => {
    const fetchHistory = async () => {
      const user = LocalDB.getUser()
      if (!user) {
         router.push("/login")
         return
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/history`, {
          headers: { "Authorization": `Bearer ${user.token}` }
        })
        if (res.ok) {
           const data = await res.json()
           setReports(data)
        }
      } catch (e) {
        console.error("Failed to fetch history", e)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [router])

  const filteredReports = reports.filter(r => 
    r.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold">Reports</h1>
            <p className="text-muted-foreground">View and download your plagiarism reports.</p>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input 
              placeholder="Search reports..." 
              className="pl-9" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
           <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
           </div>
        ) : filteredReports.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-40 border border-dashed rounded-lg bg-muted/20">
              <FileText className="h-10 w-10 text-muted-foreground mb-4 opacity-20" />
              <p className="text-muted-foreground">No reports found.</p>
              {search && <p className="text-xs text-muted-foreground mt-1">Try a different search term.</p>}
           </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="group rounded-xl border border-border bg-card p-5 hover:shadow-lg hover:shadow-primary/5 transition-all flex flex-col"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted shrink-0">
                    <FileText className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate" title={report.title}>{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.date}</p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between flex-1">
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{report.similarity}%</p>
                    <p className="text-xs text-muted-foreground">similarity</p>
                  </div>
                  <Badge variant="outline" className={statusStyles[report.status as keyof typeof statusStyles] || statusStyles.safe}>
                    {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                  </Badge>
                </div>

                <div className="mt-4 pt-4 border-t border-border flex items-center gap-2 mt-auto">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                    <Link href={`/dashboard/reports/${report.id}`}>
                      <ExternalLink className="mr-2 h-3 w-3" />
                      View
                    </Link>
                  </Button>
                  {/* Note: PDF download handles separately or locally depending on backend */}
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <Download className="mr-2 h-3 w-3" />
                    PDF
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
