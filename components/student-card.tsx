import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StudentForm } from "./student-form"
import type { Student } from "@/lib/types"
import { Mail, Phone, BookOpen, Calendar } from "lucide-react"

interface StudentCardProps {
  student: Student
  onUpdate: () => void
}

export function StudentCard({ student, onUpdate }: StudentCardProps) {
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
          <div>
            <h3 className="font-semibold text-lg">{student.name}</h3>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant={getStatusColor(student.status)}>{getStatusText(student.status)}</Badge>
              <Badge variant="outline">{student.level}</Badge>
            </div>
          </div>
          <StudentForm student={student} onSuccess={onUpdate} />
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <BookOpen className="h-4 w-4" />
          <span>{student.subject}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Mail className="h-4 w-4" />
          <span>{student.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Phone className="h-4 w-4" />
          <span>{student.phone}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Desde {new Date(student.startDate).toLocaleDateString("es-ES")}</span>
        </div>
        {student.notes && (
          <div className="mt-3 p-2 bg-muted rounded-md">
            <p className="text-sm text-muted-foreground">{student.notes}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
