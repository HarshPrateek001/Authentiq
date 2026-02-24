"use client"

import { useMemo } from "react"
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

export function SimilarityChart({ data = [] }: { data?: any[] }) {
  const chartConfig = useMemo(
    () => ({
      similarity: {
        label: "Avg Similarity",
        color: "hsl(var(--chart-2))",
      },
    }),
    [],
  )

  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="mb-6">
        <h3 className="font-semibold">Similarity Trends</h3>
        <p className="text-sm text-muted-foreground">Average similarity over time</p>
      </div>
      <div className="h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis
              dataKey="name"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              unit="%"
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
              }}
            />
            <Line
              type="monotone"
              dataKey="similarity"
              stroke={chartConfig.similarity.color}
              strokeWidth={2}
              dot={{ fill: chartConfig.similarity.color, strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
