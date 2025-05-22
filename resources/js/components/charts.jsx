"use client"

import React from "react"
import { Bar, BarChart as RechartsBarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { motion } from "framer-motion"

// Simple theme detection without external context
const useTheme = () => {
  const [resolvedTheme, setResolvedTheme] = React.useState("light")

  React.useEffect(() => {
    // Check if dark class is applied or prefers-color-scheme is dark
    const isDark =
      document.documentElement.classList.contains("dark") ||
      (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)
    setResolvedTheme(isDark ? "dark" : "light")

    // Listen for changes in the theme
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          const isDarkNow = document.documentElement.classList.contains("dark")
          setResolvedTheme(isDarkNow ? "dark" : "light")
        }
      })
    })

    observer.observe(document.documentElement, { attributes: true })

    return () => observer.disconnect()
  }, [])

  return { resolvedTheme }
}

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

export function BarChart({ period = "monthly", data = [] }) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === "dark"

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-slate-800 p-3 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700">
          <p className="font-medium text-sm mb-1">{label}</p>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-3 h-3 rounded-full bg-violet-500"></span>
            <p className="text-sm">{`Huruf: ${payload[0].value}`}</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-pink-500"></span>
            <p className="text-sm">{`Kosakata: ${payload[1].value}`}</p>
          </div>
        </div>
      )
    }
    return null
  }

  // Ensure data is not empty
  const chartData = data.length > 0 ? data : [
    { name: "No Data", huruf: 0, kosakata: 0 }
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full"
    >
      <ResponsiveContainer width="100%" height={350}>
        <RechartsBarChart 
          data={chartData} 
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }} 
          barGap={8} 
          barSize={20}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={isDark ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis
            dataKey="name"
            stroke={isDark ? "#64748b" : "#64748b"}
            axisLine={false}
            tickLine={false}
            tickMargin={10}
            angle={-45}
            textAnchor="end"
            height={60}
            tick={{ fontSize: 12 }}
          />
          <YAxis
            stroke={isDark ? "#64748b" : "#64748b"}
            axisLine={false}
            tickLine={false}
            domain={[0, "dataMax + 20"]}
          />
          <Tooltip
            content={<CustomTooltip />}
            cursor={{ fill: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.05)" }}
          />
          <Bar dataKey="huruf" name="Huruf" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="kosakata" name="Kosakata" fill="#ec4899" radius={[4, 4, 0, 0]} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
