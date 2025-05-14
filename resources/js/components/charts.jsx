"use client"

import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useTheme } from "@/contexts/theme-context"


export function MiniBarChart({ data, color }) {
  // Create data array from the provided data points
  const chartData = data.map((value, index) => ({ value }))

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={chartData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
        <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}

export function BarChart() {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  const data = [
    { name: "Week 01", income: 4000, expense: 2400 },
    { name: "Week 02", income: 3000, expense: 1398 },
    { name: "Week 03", income: 2000, expense: 9800 },
    { name: "Week 04", income: 2780, expense: 3908 },
    { name: "Week 05", income: 1890, expense: 4800 },
    { name: "Week 06", income: 2390, expense: 3800 },
    { name: "Week 07", income: 3490, expense: 4300 },
    { name: "Week 08", income: 4000, expense: 2400 },
    { name: "Week 09", income: 3000, expense: 1398 },
    { name: "Week 10", income: 2000, expense: 9800 },
    { name: "Week 11", income: 2780, expense: 3908 },
  ]

  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
        <XAxis dataKey="name" stroke={isDark ? "#64748b" : "#64748b"} axisLine={false} tickLine={false} />
        <YAxis stroke={isDark ? "#64748b" : "#64748b"} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            backgroundColor: isDark ? "#1e293b" : "#ffffff",
            borderColor: isDark ? "#334155" : "#e2e8f0",
            color: isDark ? "#f8fafc" : "#0f172a",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
        />
        <Bar dataKey="income" fill={isDark ? "#4f46e5" : "#6366f1"} radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill={isDark ? "#d946ef" : "#ec4899"} radius={[4, 4, 0, 0]} />
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
