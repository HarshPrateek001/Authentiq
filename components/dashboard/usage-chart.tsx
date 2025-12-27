"use client"

import { useMemo } from "react"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
  { name: "Mon", checks: 12 },
  { name: "Tue", checks: 19 },
  { name: "Wed", checks: 8 },
  { name: "Thu", checks: 25 },
  { name: "Fri", checks: 15 },
  { name: "Sat", checks: 6 },
  { name: "Sun", checks: 4 },
]

export function UsageChart() {
  const chartConfig = useMemo(
    () => ({
      checks: {
        label: "Checks",
        color: "hsl(var(--primary))",
      },
    }),
    [],
  )

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Weekly Usage</h3>
        <p className="text-sm text-muted-foreground">Plagiarism checks this week</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }} />
            <Tooltip
              cursor={{ fill: "hsl(var(--muted))", opacity: 0.5 }}
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Bar dataKey="checks" fill={chartConfig.checks.color} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
