"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { StudentDetailProgress } from "@/components/student-detail-progress"
import { Button } from "@/components/ui/button"
import { DataService } from "@/lib/data-service"
import type { Student, Progress, Evaluation, Class } from "@/lib/types"
import { ArrowLeft } from "lucide-react"

export default function StudentProgressDetailPage() {
  const params = useParams()
  const router = useRouter()
  const studentId = params.id as string

  const [student, setStudent] = useState<Student | null>(null)
  const [progress, setProgress] = useState<Progress | null>(null)
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStudentData = async () => {
      try {
        const [studentData, progressData, evaluationsData, classesData] = await Promise.all([
          DataService.getStudent(studentId),
          DataService.getProgress(studentId),
          DataService.getEvaluationsByStudent(studentId),
          DataService.getClassesByStudent(studentId),
        ])

        setStudent(studentData || null)
        setProgress(progressData || null)
        setEvaluations(evaluationsData)
        setClasses(classesData)
      } catch (error) {
        console.error("Error loading student data:", error)
      } finally {
        setLoading(false)
      }
    }

    if (studentId) {
      loadStudentData()
    }
  }, [studentId])

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-6 md:p-8">
            <div className="mb-8">
              <div className="h-8 bg-muted rounded w-48 animate-pulse mb-2" />
              <div className="h-4 bg-muted rounded w-64 animate-pulse" />
            </div>
            <div className="space-y-6">
              <div className="h-40 bg-muted rounded animate-pulse" />
              <div className="grid gap-4 md:grid-cols-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded animate-pulse" />
                ))}
              </div>
              <div className="h-80 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </main>
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-6 md:p-8">
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">Alumno no encontrado</p>
              <Button onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
              </Button>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />

      <main className="flex-1 md:ml-64">
        <div className="p-6 md:p-8">
          {/* Header */}
          <div className="mb-8">
            <Button variant="ghost" onClick={() => router.back()} className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al Seguimiento
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">Progreso Detallado</h1>
            <p className="text-muted-foreground">Análisis completo del rendimiento del alumno</p>
          </div>

          {/* Student Progress Detail */}
          <StudentDetailProgress student={student} progress={progress} evaluations={evaluations} classes={classes} />
        </div>
      </main>
    </div>
  )
}
