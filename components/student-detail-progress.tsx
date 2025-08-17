"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ProgressChart } from "./progress-chart"
import type { Student, Progress as ProgressType, Evaluation, Class } from "@/lib/types"
import { Target, TrendingUp, Calendar, CheckCircle } from "lucide-react"

interface StudentDetailProgressProps {
  student: Student
  progress?: ProgressType
  evaluations: Evaluation[]
  classes: Class[]
}

export function StudentDetailProgress({ student, progress, evaluations, classes }: StudentDetailProgressProps) {
  const recentClasses = classes
    .filter((c) => c.status === "completed")
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5)

  const upcomingClasses = classes
    .filter((c) => c.status === "scheduled" && new Date(c.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 3)

  const averageScore =
    evaluations.length > 0
      ? evaluations.reduce((sum, e) => sum + (e.score / e.maxScore) * 100, 0) / evaluations.length
      : 0

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }

  return (
    <div className="space-y-6">
      {/* Student Info Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl">{student.name}</CardTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="default">{student.subject}</Badge>
                <Badge variant="outline">{student.level}</Badge>
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status === "active" ? "Activo" : student.status === "paused" ? "Pausado" : "Inactivo"}
                </Badge>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Desde</div>
              <div className="font-medium">{new Date(student.startDate).toLocaleDateString("es-ES")}</div>
            </div>
          </div>
        </CardHeader>
        {student.notes && (
          <CardContent>
            <div className="bg-muted p-3 rounded-md">
              <p className="text-sm">{student.notes}</p>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Progress Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Progreso General</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{progress?.overallProgress || 0}%</div>
            <Progress value={progress?.overallProgress || 0} className="mt-2" />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Promedio Notas</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore.toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground mt-1">{evaluations.length} evaluaciones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Clases Completadas</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{classes.filter((c) => c.status === "completed").length}</div>
            <p className="text-xs text-muted-foreground mt-1">Total de clases</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Próximas Clases</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingClasses.length}</div>
            <p className="text-xs text-muted-foreground mt-1">Programadas</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Progreso en Evaluaciones</CardTitle>
        </CardHeader>
        <CardContent>
          <ProgressChart evaluations={evaluations} studentName={student.name} />
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clases Recientes</CardTitle>
          </CardHeader>
          <CardContent>
            {recentClasses.length > 0 ? (
              <div className="space-y-3">
                {recentClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{new Date(cls.date).toLocaleDateString("es-ES")}</p>
                      <p className="text-xs text-muted-foreground">
                        {cls.time} • {cls.duration} min
                      </p>
                      {cls.notes && <p className="text-xs text-muted-foreground truncate">{cls.notes}</p>}
                    </div>
                    <Badge variant="secondary">Completada</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay clases recientes.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximas Clases</CardTitle>
          </CardHeader>
          <CardContent>
            {upcomingClasses.length > 0 ? (
              <div className="space-y-3">
                {upcomingClasses.map((cls) => (
                  <div key={cls.id} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-medium">{new Date(cls.date).toLocaleDateString("es-ES")}</p>
                      <p className="text-xs text-muted-foreground">
                        {cls.time} • {cls.duration} min
                      </p>
                      {cls.notes && <p className="text-xs text-muted-foreground truncate">{cls.notes}</p>}
                    </div>
                    <Badge variant="default">Programada</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No hay clases programadas.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
