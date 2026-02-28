"use client"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { LocalDB } from "@/lib/local-db"
import { AppLayout } from "@/components/layouts/app-layout"
import { StatsCard } from "@/components/dashboard/stats-card"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { UsageChart } from "@/components/dashboard/usage-chart"
import { SimilarityChart } from "@/components/dashboard/similarity-chart"
import { FileCheck, BarChart3, AlertTriangle, Clock, Loader2, RefreshCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const fetchDashboardStats = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true)

    const user = LocalDB.getUser()
    if (!user) {
      router.push("/login")
      return
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/api/dashboard/stats`, {
        headers: { "Authorization": `Bearer ${user.token}` }
      })

      if (res.status === 401) {
        LocalDB.clearUser()
        router.push("/login")
        return
      }

      if (res.ok) {
        const data = await res.json()
        setStats(data)
      } else {
        // Fallback to local stats if API isn't ready
        setStats(LocalDB.getStats())
      }
    } catch (e) {
      console.error("Failed to fetch stats, falling back to local DB", e)
      setStats(LocalDB.getStats())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    LocalDB.logView('dashboard') // Log view

    // Check demo mode
    if (typeof window !== "undefined" && localStorage.getItem("demo_mode") === "true") {
      setStats(LocalDB.getStats())
      setLoading(false)
      return
    }

    fetchDashboardStats()

    const onFocus = () => fetchDashboardStats(true)
    window.addEventListener("focus", onFocus)
    return () => window.removeEventListener("focus", onFocus)
  }, [router])

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </AppLayout>
    )
  }

  // Safe fallback to prevent rendering errors
  const safeStats = {
    total_checks: stats?.total_checks ?? stats?.checks_done ?? 0,
    avg_similarity: stats?.avg_similarity ?? stats?.average_similarity ?? 0,
    high_risk_count: stats?.high_risk_count ?? stats?.ai_content_found ?? 0,
    remaining_quota: stats?.remaining_quota ?? 15,
    usage_chart: stats?.usage_chart ?? [],
    recent_activity: stats?.recent_activity ?? stats?.history ?? [],
    user_name: stats?.user_name || LocalDB.getUser()?.fullName || "User"
  }

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {safeStats.user_name}! Here&apos;s an overview of your activity.</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => fetchDashboardStats(true)} disabled={refreshing} className="w-full sm:w-auto">
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            {refreshing ? "Syncing..." : "Refresh Data"}
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatsCard
            title="Total Checks"
            value={safeStats.total_checks.toString()}
            description="Lifetime checks"
            icon={FileCheck}
          />
          <StatsCard
            title="Average Similarity"
            value={`${safeStats.avg_similarity}%`}
            description="Across all documents"
            icon={BarChart3}
          />
          <StatsCard
            title="High-Risk Documents"
            value={safeStats.high_risk_count.toString()}
            description="> 70% Similarity"
            icon={AlertTriangle}
          />
          <StatsCard
            title="Remaining Quota"
            value={safeStats.remaining_quota.toString()}
            description="Checks left"
            icon={Clock}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <UsageChart data={safeStats.usage_chart} />
          <SimilarityChart data={safeStats.usage_chart} />
        </div>

        <RecentActivity items={safeStats.recent_activity} />
      </div>
    </AppLayout>
  )
}
