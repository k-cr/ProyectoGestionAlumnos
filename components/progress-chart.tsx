"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Evaluation } from "@/lib/types"
import { TrendingUp, TrendingDown, Minus, BarChart3 } from "lucide-react"

interface ProgressChartProps {
  evaluations: Evaluation[]
  studentName: string
}

export function ProgressChart({ evaluations, studentName }: ProgressChartProps) {
  const sortedEvaluations = [...evaluations].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  const getPercentage = (evaluation: Evaluation) => {
    return Math.round((evaluation.score / evaluation.maxScore) * 100)
  }

  const calculateTrend = () => {
    if (sortedEvaluations.length < 2) return { trend: "stable", value: 0 }

    const recent = sortedEvaluations.slice(-3)
    const previous = sortedEvaluations.slice(-6, -3)

    if (recent.length === 0 || previous.length === 0) return { trend: "stable", value: 0 }

    const recentAvg = recent.reduce((sum, e) => sum + getPercentage(e), 0) / recent.length
    const previousAvg = previous.reduce((sum, e) => sum + getPercentage(e), 0) / previous.length

    const difference = recentAvg - previousAvg

    if (difference > 5) return { trend: "up", value: difference }
    if (difference < -5) return { trend: "down", value: Math.abs(difference) }
    return { trend: "stable", value: Math.abs(difference) }
  }

  const trend = calculateTrend()
  const averageScore =
    sortedEvaluations.length > 0
      ? sortedEvaluations.reduce((sum, e) => sum + getPercentage(e), 0) / sortedEvaluations.length
      : 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            <span>Progreso en Evaluaciones</span>
          </div>
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground">Promedio:</span>
              <span
                className={`font-bold ${
                  averageScore >= 90
                    ? "text-green-600"
                    : averageScore >= 80
                      ? "text-blue-600"
                      : averageScore >= 70
                        ? "text-yellow-600"
                        : averageScore >= 60
                          ? "text-orange-600"
                          : "text-red-600"
                }`}
              >
                {averageScore.toFixed(1)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              {trend.trend === "up" && (
                <>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <span className="text-green-600">+{trend.value.toFixed(1)}%</span>
                </>
              )}
              {trend.trend === "down" && (
                <>
                  <TrendingDown className="h-4 w-4 text-red-600" />
                  <span className="text-red-600">-{trend.value.toFixed(1)}%</span>
                </>
              )}
              {trend.trend === "stable" && (
                <>
                  <Minus className="h-4 w-4 text-gray-600" />
                  <span className="text-gray-600">Estable</span>
                </>
              )}
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {sortedEvaluations.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">No hay evaluaciones registradas</div>
        ) : (
          <div className="space-y-6">
            <div className="relative h-48 bg-gradient-to-t from-muted/20 to-background rounded-lg p-4 border">
              <div className="absolute inset-4">
                {/* Grid lines */}
                <div className="absolute inset-0">
                  {[0, 25, 50, 75, 100].map((value) => (
                    <div
                      key={value}
                      className="absolute w-full border-t border-muted/30"
                      style={{ bottom: `${value}%` }}
                    />
                  ))}
                </div>

                {/* Y-axis labels */}
                <div className="absolute -left-2 top-0 text-xs text-muted-foreground">100%</div>
                <div className="absolute -left-2 top-1/4 text-xs text-muted-foreground">75%</div>
                <div className="absolute -left-2 top-1/2 text-xs text-muted-foreground">50%</div>
                <div className="absolute -left-2 top-3/4 text-xs text-muted-foreground">25%</div>
                <div className="absolute -left-2 bottom-0 text-xs text-muted-foreground">0%</div>

                {/* Chart area */}
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                  {/* Area fill */}
                  <defs>
                    <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.05" />
                    </linearGradient>
                  </defs>

                  {sortedEvaluations.length > 1 && (
                    <polygon
                      fill="url(#areaGradient)"
                      points={`0,100 ${sortedEvaluations
                        .map((evaluation, index) => {
                          const x = (index / (sortedEvaluations.length - 1)) * 100
                          const y = 100 - getPercentage(evaluation)
                          return `${x},${y}`
                        })
                        .join(" ")} 100,100`}
                    />
                  )}

                  {/* Chart line */}
                  {sortedEvaluations.length > 1 && (
                    <polyline
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      points={sortedEvaluations
                        .map((evaluation, index) => {
                          const x = (index / (sortedEvaluations.length - 1)) * 100
                          const y = 100 - getPercentage(evaluation)
                          return `${x},${y}`
                        })
                        .join(" ")}
                    />
                  )}

                  {/* Data points */}
                  {sortedEvaluations.map((evaluation, index) => {
                    const x = sortedEvaluations.length === 1 ? 50 : (index / (sortedEvaluations.length - 1)) * 100
                    const y = 100 - getPercentage(evaluation)
                    const percentage = getPercentage(evaluation)
                    return (
                      <g key={evaluation.id}>
                        <circle
                          cx={x}
                          cy={y}
                          r="4"
                          fill="hsl(var(--background))"
                          stroke="hsl(var(--primary))"
                          strokeWidth="3"
                          className="hover:r-6 transition-all cursor-pointer"
                        />
                        <circle
                          cx={x}
                          cy={y}
                          r="2"
                          fill={
                            percentage >= 90
                              ? "#22c55e"
                              : percentage >= 80
                                ? "#3b82f6"
                                : percentage >= 70
                                  ? "#eab308"
                                  : percentage >= 60
                                    ? "#f97316"
                                    : "#ef4444"
                          }
                        />
                      </g>
                    )
                  })}
                </svg>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-base flex items-center gap-2">
                Historial de Evaluaciones
                <span className="text-sm text-muted-foreground font-normal">({sortedEvaluations.length} total)</span>
              </h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {sortedEvaluations
                  .slice()
                  .reverse()
                  .map((evaluation, index) => {
                    const percentage = getPercentage(evaluation)
                    return (
                      <div
                        key={evaluation.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <div
                              className={`w-4 h-4 rounded-full border-2 ${
                                percentage >= 90
                                  ? "bg-green-500 border-green-600"
                                  : percentage >= 80
                                    ? "bg-blue-500 border-blue-600"
                                    : percentage >= 70
                                      ? "bg-yellow-500 border-yellow-600"
                                      : percentage >= 60
                                        ? "bg-orange-500 border-orange-600"
                                        : "bg-red-500 border-red-600"
                              }`}
                            />
                            <span className="font-medium text-lg">{percentage}%</span>
                          </div>
                          <div>
                            <span className="font-medium">{evaluation.title}</span>
                            <div className="text-xs text-muted-foreground">
                              {evaluation.score}/{evaluation.maxScore} puntos
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">
                            {new Date(evaluation.date).toLocaleDateString("es-ES")}
                          </div>
                          <div className="text-xs text-muted-foreground">{evaluation.type}</div>
                        </div>
                      </div>
                    )
                  })}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
