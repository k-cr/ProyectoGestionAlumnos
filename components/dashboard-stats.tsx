"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, ClipboardCheck, TrendingUp } from "lucide-react"
import { DataService } from "@/lib/data-service"

interface DashboardStats {
  totalStudents: number
  activeStudents: number
  todayClasses: number
  recentEvaluations: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await DataService.getDashboardStats()
        setStats(data)
      } catch (error) {
        console.error("Error loading dashboard stats:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-muted rounded w-16 animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (!stats) return null

  const statCards = [
    {
      title: "Total Alumnos",
      value: stats.totalStudents,
      icon: Users,
      description: `${stats.activeStudents} activos`,
    },
    {
      title: "Clases Hoy",
      value: stats.todayClasses,
      icon: Calendar,
      description: "Programadas",
    },
    {
      title: "Evaluaciones",
      value: stats.recentEvaluations,
      icon: ClipboardCheck,
      description: "Esta semana",
    },
    {
      title: "Progreso",
      value: "85%",
      icon: TrendingUp,
      description: "Promedio general",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
