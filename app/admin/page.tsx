"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  FileText,
  DollarSign,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  AlertCircle,
  CheckCircle,
  Clock,
  Server,
} from "lucide-react"

const stats = [
  {
    title: "Total Users",
    value: "12,847",
    change: "+12.5%",
    trend: "up",
    icon: Users,
  },
  {
    title: "Documents Scanned",
    value: "284,392",
    change: "+8.2%",
    trend: "up",
    icon: FileText,
  },
  {
    title: "Monthly Revenue",
    value: "$48,294",
    change: "+15.3%",
    trend: "up",
    icon: DollarSign,
  },
  {
    title: "Active Subscriptions",
    value: "3,284",
    change: "-2.1%",
    trend: "down",
    icon: TrendingUp,
  },
]

const recentUsers = [
  { name: "Sarah Johnson", email: "sarah.j@edu.com", plan: "Pro", status: "active", date: "2 min ago" },
  { name: "Michael Chen", email: "m.chen@corp.com", plan: "Enterprise", status: "active", date: "15 min ago" },
  { name: "Emily Davis", email: "emily.d@school.edu", plan: "Basic", status: "pending", date: "1 hour ago" },
  { name: "James Wilson", email: "j.wilson@uni.edu", plan: "Pro", status: "active", date: "3 hours ago" },
]

const systemStatus = [
  { name: "API Server", status: "operational", uptime: "99.99%" },
  { name: "Database", status: "operational", uptime: "99.95%" },
  { name: "File Storage", status: "operational", uptime: "99.98%" },
  { name: "ML Pipeline", status: "degraded", uptime: "98.50%" },
]

const alerts = [
  { type: "warning", message: "ML Pipeline experiencing higher latency", time: "10 min ago" },
  { type: "info", message: "New enterprise signup: Acme Corp", time: "1 hour ago" },
  { type: "success", message: "Database backup completed", time: "3 hours ago" },
]

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Admin Dashboard</h1>
          <p className="text-muted-foreground">Monitor and manage the Plag Checker platform</p>
        </div>
        <Button>Generate Report</Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div
                  className={`flex items-center gap-1 text-sm ${stat.trend === "up" ? "text-green-600" : "text-red-600"}`}
                >
                  {stat.trend === "up" ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-2xl font-semibold">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Users */}
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base">Recent Signups</CardTitle>
              <CardDescription>Latest user registrations</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentUsers.map((user, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">{user.plan}</Badge>
                    <Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge>
                    <span className="text-sm text-muted-foreground">{user.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">System Alerts</CardTitle>
            <CardDescription>Recent notifications</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div key={index} className="flex gap-3">
                  <div
                    className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      alert.type === "warning"
                        ? "bg-amber-100 text-amber-600"
                        : alert.type === "success"
                          ? "bg-green-100 text-green-600"
                          : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {alert.type === "warning" ? (
                      <AlertCircle className="h-3.5 w-3.5" />
                    ) : alert.type === "success" ? (
                      <CheckCircle className="h-3.5 w-3.5" />
                    ) : (
                      <Clock className="h-3.5 w-3.5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm">{alert.message}</p>
                    <p className="text-xs text-muted-foreground">{alert.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Server className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-base">System Status</CardTitle>
              <CardDescription>Infrastructure health overview</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {systemStatus.map((service) => (
              <div key={service.name} className="rounded-lg border p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium">{service.name}</p>
                  <div
                    className={`h-2.5 w-2.5 rounded-full ${service.status === "operational" ? "bg-green-500" : "bg-amber-500"}`}
                  />
                </div>
                <div className="mt-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Uptime</span>
                    <span className="font-medium">{service.uptime}</span>
                  </div>
                  <Progress value={Number.parseFloat(service.uptime)} className="mt-2 h-1.5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Manage Users</p>
              <p className="text-sm text-muted-foreground">View and edit users</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Review Documents</p>
              <p className="text-sm text-muted-foreground">Flagged content</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Analytics</p>
              <p className="text-sm text-muted-foreground">Usage insights</p>
            </div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer transition-colors hover:bg-muted/50">
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
              <DollarSign className="h-5 w-5" />
            </div>
            <div>
              <p className="font-medium">Billing</p>
              <p className="text-sm text-muted-foreground">Revenue & invoices</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
