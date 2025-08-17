"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, BookOpen, Calendar, CheckCircle } from "lucide-react"
import { DataService } from "@/lib/data-service"
import type { Class, Evaluation } from "@/lib/types"

export function UpcomingActivities() {
  const [classes, setClasses] = useState<Class[]>([])
  const [evaluationsData, setEvaluationsData] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [classesData, evalData] = await Promise.all([DataService.getClasses(), DataService.getEvaluations()])

        // Filter upcoming classes (next 7 days)
        const now = new Date()
        const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)

        const upcomingClasses = classesData
          .filter((cls) => {
            const classDate = new Date(cls.date)
            return classDate >= now && classDate <= nextWeek && cls.status === "scheduled"
          })
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .slice(0, 5)

        // Recent evaluations to review (last 3 days)
        const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000)
        const recentEvaluations = evalData
          .filter((evalItem) => new Date(evalItem.date) >= threeDaysAgo)
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 3)

        setClasses(upcomingClasses)
        setEvaluationsData(recentEvaluations)
      } catch (error) {
        console.error("Error loading data:", error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000)

    if (date.toDateString() === today.toDateString()) {
      return "Hoy"
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return "Mañana"
    } else {
      return date.toLocaleDateString("es-ES", {
        weekday: "short",
        day: "numeric",
        month: "short",
      })
    }
  }

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString("es-ES", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Próximas Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Próximas Actividades
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Upcoming Classes */}
          {classes.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Clases Programadas
              </h4>
              <div className="space-y-3">
                {classes.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-primary rounded-full" />
                      <div>
                        <div className="font-medium text-sm">{cls.studentName}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2">
                          <BookOpen className="h-3 w-3" />
                          {cls.subject}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">{formatDate(cls.date)}</div>
                      <div className="text-xs text-muted-foreground">{formatTime(cls.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Recent Evaluations */}
          {evaluationsData.length > 0 && (
            <div>
              <h4 className="font-medium text-sm text-muted-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Evaluaciones Recientes
              </h4>
              <div className="space-y-3">
                {evaluationsData.map((evaluation) => (
                  <div key={evaluation.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div>
                        <div className="font-medium text-sm">{evaluation.studentName}</div>
                        <div className="text-xs text-muted-foreground">{evaluation.title}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={
                          evaluation.score / evaluation.maxScore >= 0.9
                            ? "default"
                            : evaluation.score / evaluation.maxScore >= 0.7
                              ? "secondary"
                              : "destructive"
                        }
                      >
                        {evaluation.score}/{evaluation.maxScore}
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">{formatDate(evaluation.date)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {classes.length === 0 && evaluationsData.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No hay actividades próximas</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
