"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { DataService } from "@/lib/data-service"
import type { Class, Evaluation } from "@/lib/types"
import { Calendar, ClipboardCheck } from "lucide-react"

export function RecentActivity() {
  const [recentClasses, setRecentClasses] = useState<Class[]>([])
  const [recentEvaluations, setRecentEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadRecentActivity = async () => {
      try {
        const [classes, evaluations] = await Promise.all([DataService.getClasses(), DataService.getEvaluations()])

        // Get last 3 classes
        const sortedClasses = classes
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)

        // Get last 3 evaluations
        const sortedEvaluations = evaluations
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)

        setRecentClasses(sortedClasses)
        setRecentEvaluations(sortedEvaluations)
      } catch (error) {
        console.error("Error loading recent activity:", error)
      } finally {
        setLoading(false)
      }
    }

    loadRecentActivity()
  }, [])

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="h-5 bg-muted rounded w-32 animate-pulse" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="h-4 bg-muted rounded w-full animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Recent Classes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Clases Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentClasses.map((cls) => (
            <div key={cls.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{cls.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {cls.subject} • {new Date(cls.date).toLocaleDateString("es-ES")} • {cls.time}
                </p>
              </div>
              <Badge
                variant={
                  cls.status === "completed" ? "default" : cls.status === "scheduled" ? "secondary" : "destructive"
                }
              >
                {cls.status === "completed" ? "Completada" : cls.status === "scheduled" ? "Programada" : "Cancelada"}
              </Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Recent Evaluations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            Evaluaciones Recientes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recentEvaluations.map((evaluation) => (
            <div key={evaluation.id} className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">{evaluation.studentName}</p>
                <p className="text-xs text-muted-foreground">
                  {evaluation.title} • {new Date(evaluation.date).toLocaleDateString("es-ES")}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">
                  {evaluation.score}/{evaluation.maxScore}
                </p>
                <p className="text-xs text-muted-foreground">
                  {Math.round((evaluation.score / evaluation.maxScore) * 100)}%
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
