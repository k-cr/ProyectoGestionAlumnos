import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { EvaluationForm } from "./evaluation-form"
import type { Evaluation } from "@/lib/types"
import { Calendar, User, BookOpen, FileText } from "lucide-react"

interface EvaluationCardProps {
  evaluation: Evaluation
  onUpdate: () => void
}

export function EvaluationCard({ evaluation, onUpdate }: EvaluationCardProps) {
  const getTypeColor = (type: string) => {
    switch (type) {
      case "exam":
        return "default"
      case "homework":
        return "secondary"
      case "quiz":
        return "outline"
      case "project":
        return "destructive"
      default:
        return "default"
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case "exam":
        return "Examen"
      case "homework":
        return "Tarea"
      case "quiz":
        return "Quiz"
      case "project":
        return "Proyecto"
      default:
        return type
    }
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600 bg-green-50"
    if (percentage >= 80) return "text-blue-600 bg-blue-50"
    if (percentage >= 70) return "text-yellow-600 bg-yellow-50"
    if (percentage >= 60) return "text-orange-600 bg-orange-50"
    return "text-red-600 bg-red-50"
  }

  const percentage = Math.round((evaluation.score / evaluation.maxScore) * 100)

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{evaluation.title}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getTypeColor(evaluation.type)}>{getTypeText(evaluation.type)}</Badge>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${getGradeColor(percentage)}`}>
                {percentage}%
              </div>
            </div>
          </div>
          <EvaluationForm evaluation={evaluation} onSuccess={onUpdate} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4" />
          <span>{evaluation.studentName}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{evaluation.subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{new Date(evaluation.date).toLocaleDateString("es-ES")}</span>
        </div>

        <div className="bg-muted p-3 rounded-md">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Puntuación</span>
            <span className="text-lg font-bold">
              {evaluation.score} / {evaluation.maxScore}
            </span>
          </div>
          <div className="w-full bg-background rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all ${
                percentage >= 90
                  ? "bg-green-500"
                  : percentage >= 80
                    ? "bg-blue-500"
                    : percentage >= 70
                      ? "bg-yellow-500"
                      : percentage >= 60
                        ? "bg-orange-500"
                        : "bg-red-500"
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        {evaluation.notes && (
          <div className="mt-3 p-2 bg-accent rounded-md">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Comentarios:</p>
                <p className="text-sm">{evaluation.notes}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
