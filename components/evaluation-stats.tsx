"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { Evaluation } from "@/lib/types"
import { TrendingUp, Target, Award, BarChart3 } from "lucide-react"

interface EvaluationStatsProps {
  evaluations: Evaluation[]
}

export function EvaluationStats({ evaluations }: EvaluationStatsProps) {
  const calculateStats = () => {
    if (evaluations.length === 0) {
      return {
        averageScore: 0,
        totalEvaluations: 0,
        excellentCount: 0,
        passingRate: 0,
        byType: {},
        recentTrend: 0,
      }
    }

    const scores = evaluations.map((e) => (e.score / e.maxScore) * 100)
    const averageScore = scores.reduce((sum, score) => sum + score, 0) / scores.length

    const excellentCount = scores.filter((score) => score >= 90).length
    const passingCount = scores.filter((score) => score >= 60).length
    const passingRate = (passingCount / evaluations.length) * 100

    // Group by type
    const byType = evaluations.reduce(
      (acc, evaluation) => {
        const type = evaluation.type
        if (!acc[type]) {
          acc[type] = { count: 0, totalScore: 0 }
        }
        acc[type].count++
        acc[type].totalScore += (evaluation.score / evaluation.maxScore) * 100
        return acc
      },
      {} as Record<string, { count: number; totalScore: number }>,
    )

    // Calculate recent trend (last 5 vs previous 5)
    const sortedByDate = [...evaluations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    const recent5 = sortedByDate.slice(0, 5)
    const previous5 = sortedByDate.slice(5, 10)

    let recentTrend = 0
    if (recent5.length > 0 && previous5.length > 0) {
      const recentAvg = recent5.reduce((sum, e) => sum + (e.score / e.maxScore) * 100, 0) / recent5.length
      const previousAvg = previous5.reduce((sum, e) => sum + (e.score / e.maxScore) * 100, 0) / previous5.length
      recentTrend = recentAvg - previousAvg
    }

    return {
      averageScore,
      totalEvaluations: evaluations.length,
      excellentCount,
      passingRate,
      byType,
      recentTrend,
    }
  }

  const stats = calculateStats()

  const getTypeText = (type: string) => {
    switch (type) {
      case "exam":
        return "Exámenes"
      case "homework":
        return "Tareas"
      case "quiz":
        return "Quizzes"
      case "project":
        return "Proyectos"
      default:
        return type
    }
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Promedio General</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.averageScore.toFixed(1)}%</div>
          <Progress value={stats.averageScore} className="mt-2" />
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Evaluaciones</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEvaluations}</div>
          <p className="text-xs text-muted-foreground mt-1">Evaluaciones registradas</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Excelencia</CardTitle>
          <Award className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.excellentCount}</div>
          <p className="text-xs text-muted-foreground mt-1">Calificaciones ≥ 90%</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tendencia</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${stats.recentTrend >= 0 ? "text-green-600" : "text-red-600"}`}>
            {stats.recentTrend >= 0 ? "+" : ""}
            {stats.recentTrend.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">Últimas 5 evaluaciones</p>
        </CardContent>
      </Card>

      {/* Type breakdown */}
      {Object.keys(stats.byType).length > 0 && (
        <Card className="md:col-span-2 lg:col-span-4">
          <CardHeader>
            <CardTitle className="text-lg">Rendimiento por Tipo</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {Object.entries(stats.byType).map(([type, data]) => {
                const average = data.totalScore / data.count
                return (
                  <div key={type} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{getTypeText(type)}</span>
                      <span className="text-sm text-muted-foreground">({data.count})</span>
                    </div>
                    <div className="text-xl font-bold">{average.toFixed(1)}%</div>
                    <Progress value={average} className="h-2" />
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
