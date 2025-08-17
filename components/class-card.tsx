import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ClassForm } from "./class-form"
import type { Class } from "@/lib/types"
import { Clock, BookOpen, Calendar, FileText, CheckCircle } from "lucide-react"

interface ClassCardProps {
  classData: Class
  onUpdate: () => void
}

export function ClassCard({ classData, onUpdate }: ClassCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "default"
      case "completed":
        return "secondary"
      case "cancelled":
        return "destructive"
      default:
        return "default"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "scheduled":
        return "Programada"
      case "completed":
        return "Completada"
      case "cancelled":
        return "Cancelada"
      default:
        return status
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const isToday = (date: string) => {
    const today = new Date().toISOString().split("T")[0]
    return date === today
  }

  const isPast = (date: string, time: string) => {
    const classDateTime = new Date(`${date}T${time}`)
    return classDateTime < new Date()
  }

  return (
    <Card className={`hover:shadow-md transition-shadow ${isToday(classData.date) ? "ring-2 ring-primary" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="font-semibold text-lg">{classData.studentName}</h3>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusColor(classData.status)}>{getStatusText(classData.status)}</Badge>
              {isToday(classData.date) && <Badge variant="outline">Hoy</Badge>}
              {isPast(classData.date, classData.time) && classData.status === "scheduled" && (
                <Badge variant="secondary">Pasada</Badge>
              )}
            </div>
          </div>
          <ClassForm classData={classData} onSuccess={onUpdate} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{classData.subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>{formatDate(classData.date)}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>
            {classData.time} ({classData.duration} min)
          </span>
        </div>

        {classData.notes && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <div className="flex items-start gap-2">
              <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Notas:</p>
                <p className="text-sm">{classData.notes}</p>
              </div>
            </div>
          </div>
        )}

        {classData.homework && (
          <div className="mt-3 p-2 bg-accent rounded-md">
            <div className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
              <div>
                <p className="text-xs font-medium text-muted-foreground mb-1">Tarea:</p>
                <p className="text-sm">{classData.homework}</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
