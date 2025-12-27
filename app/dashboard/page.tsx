import { AppLayout } from "@/components/layouts/app-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { SimilarityChart } from "@/components/dashboard/similarity-chart"
import { FileCheck, BarChart3, AlertTriangle, Clock } from "lucide-react"

export default function DashboardPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, John! Here&apos;s an overview of your activity.</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Checks"
            value="78"
            description="This month"
            icon={FileCheck}
            trend={{ value: 12, isPositive: true }}
          />
          <StatsCard
            title="Average Similarity"
            value="14%"
            description="Across all documents"
            icon={BarChart3}
            trend={{ value: 3, isPositive: false }}
          />
          <StatsCard title="High-Risk Documents" value="3" description="Need attention" icon={AlertTriangle} />
          <StatsCard title="Remaining Quota" value="22" description="Checks left this month" icon={Clock} />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <UsageChart />
          <SimilarityChart />
        </div>

        <RecentActivity />
      </div>
    </AppLayout>
  )
}
