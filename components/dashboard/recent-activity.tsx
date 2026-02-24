import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { FileText, ExternalLink } from "lucide-react"

interface ActivityItem {
  id: string
  title: string
  date: string
  score: number | null
  status: string
  type: string
}

const statusStyles: any = {
  safe: "bg-success/10 text-success border-success/20",
  moderate: "bg-warning/10 text-warning-foreground border-warning/20",
  high: "bg-destructive/10 text-destructive border-destructive/20",
}

export function RecentActivity({ items = [] }: { items?: any[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="rounded-xl border border-border bg-card p-6 text-center text-muted-foreground">
        No recent activity
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border p-4">
        <h3 className="font-semibold">Recent Activity</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/history">
            View all
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </div>
      <div className="divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 p-4 hover:bg-muted/50 transition-colors">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
              <FileText className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{item.title}</p>
              <p className="text-sm text-muted-foreground">{new Date(item.date).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-3">
              {item.score !== null && <span className="text-sm font-medium">{item.score}%</span>}
              <Badge variant="outline" className={statusStyles[item.status] || statusStyles.safe}>
                {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
