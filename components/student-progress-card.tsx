"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import type { Student, Progress as ProgressType } from "@/lib/types"
import { BookOpen, Target, Calendar, Eye } from "lucide-react"
import Link from "next/link"

interface StudentProgressCardProps {
  student: Student
  progress?: ProgressType
  recentEvaluationsCount: number
  upcomingClassesCount: number
}

export function StudentProgressCard({
  student,
  progress,
  recentEvaluationsCount,
  upcomingClassesCount,
}: StudentProgressCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "default"
      case "paused":
        return "secondary"
      case "inactive":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
        return "Activo"
      case "paused":
        return "Pausado"
      case "inactive":
        return "Inactivo"
      default:
        return status
    }
  }

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(student.status)}>{getStatusText(student.status)}</Badge>
              <Badge variant="outline">{student.level}</Badge>
            </div>
          </div>
          <Link href={`/progress/${student.id}`}>
            <Button variant="ghost" size="sm">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{student.subject}</span>
        </div>

        {progress && (
          <div className="space-y-3">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progreso General</span>
                <span className="text-sm font-bold">{progress.overallProgress}%</span>
              </div>
              <Progress value={progress.overallProgress} className="h-2" />
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Target className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Evaluaciones</span>
                </div>
                <span className="font-medium">{recentEvaluationsCount} recientes</span>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span className="text-muted-foreground">Clases</span>
                </div>
                <span className="font-medium">{upcomingClassesCount} próximas</span>
              </div>
            </div>

            {progress.strengths.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-green-700">Fortalezas:</span>
                <div className="flex flex-wrap gap-1">
                  {progress.strengths.slice(0, 2).map((strength, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {strength}
                    </Badge>
                  ))}
                  {progress.strengths.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{progress.strengths.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}

            {progress.areasToImprove.length > 0 && (
              <div className="space-y-2">
                <span className="text-sm font-medium text-orange-700">A mejorar:</span>
                <div className="flex flex-wrap gap-1">
                  {progress.areasToImprove.slice(0, 2).map((area, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {area}
                    </Badge>
                  ))}
                  {progress.areasToImprove.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{progress.areasToImprove.length - 2}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {!progress && (
          <div className="text-center py-4 text-muted-foreground text-sm">No hay datos de progreso disponibles</div>
        )}
      </CardContent>
    </Card>
  )
}
