"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { StudentProgressCard } from "@/components/student-progress-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DataService } from "@/lib/data-service"
import type { Student, Progress, Evaluation, Class } from "@/lib/types"
import { Search } from "lucide-react"

export default function ProgressPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [progress, setProgress] = useState<Progress[]>([])
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [classes, setClasses] = useState<Class[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [subjectFilter, setSubjectFilter] = useState("all")

  const loadData = async () => {
    try {
      const [studentsData, evaluationsData, classesData] = await Promise.all([
        DataService.getStudents(),
        DataService.getEvaluations(),
        DataService.getClasses(),
      ])

      setStudents(studentsData)
      setEvaluations(evaluationsData)
      setClasses(classesData)
      setFilteredStudents(studentsData)

      // Load progress for each student
      const progressData = await Promise.all(
        studentsData.map(async (student) => {
          const studentProgress = await DataService.getProgress(student.id)
          return studentProgress
        }),
      )
      setProgress(progressData.filter(Boolean) as Progress[])
    } catch (error) {
      console.error("Error loading data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.subject.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter((student) => student.subject === subjectFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, statusFilter, subjectFilter])

  const getStudentProgress = (studentId: string) => {
    return progress.find((p) => p.studentId === studentId)
  }

  const getStudentEvaluationsCount = (studentId: string) => {
    const weekAgo = new Date()
    weekAgo.setDate(weekAgo.getDate() - 7)
    return evaluations.filter((e) => e.studentId === studentId && new Date(e.date) >= weekAgo).length
  }

  const getStudentUpcomingClassesCount = (studentId: string) => {
    const today = new Date()
    return classes.filter((c) => c.studentId === studentId && c.status === "scheduled" && new Date(c.date) >= today)
      .length
  }

  const uniqueSubjects = [...new Set(students.map((s) => s.subject))]

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
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-80 bg-muted rounded animate-pulse" />
              ))}
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
            <h1 className="text-3xl font-bold text-foreground mb-2">Seguimiento Personalizado</h1>
            <p className="text-muted-foreground">
              Monitorea el progreso individual de cada alumno ({filteredStudents.length} de {students.length})
            </p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre o materia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-4">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todos los estados" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los estados</SelectItem>
                  <SelectItem value="active">Activo</SelectItem>
                  <SelectItem value="paused">Pausado</SelectItem>
                  <SelectItem value="inactive">Inactivo</SelectItem>
                </SelectContent>
              </Select>

              <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Todas las materias" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las materias</SelectItem>
                  {uniqueSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Students Progress Grid */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {students.length === 0
                  ? "No tienes alumnos registrados aún"
                  : "No se encontraron alumnos con los filtros aplicados"}
              </p>
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <StudentProgressCard
                  key={student.id}
                  student={student}
                  progress={getStudentProgress(student.id)}
                  recentEvaluationsCount={getStudentEvaluationsCount(student.id)}
                  upcomingClassesCount={getStudentUpcomingClassesCount(student.id)}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
