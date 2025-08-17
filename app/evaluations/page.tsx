"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { SimpleEvaluationForm } from "@/components/simple-evaluation-form"
import { EvaluationCard } from "@/components/evaluation-card"
import { DataService } from "@/lib/data-service"
import type { Evaluation, Student } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Star, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [filteredEvaluations, setFilteredEvaluations] = useState<Evaluation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [studentFilter, setStudentFilter] = useState("")
  const [gradeFilter, setGradeFilter] = useState("")
  const [selectedStudent, setSelectedStudent] = useState<string>("")
  const [viewMode, setViewMode] = useState<"by-student" | "all-evaluations">("by-student")

  const loadData = async () => {
    try {
      const [evaluationsData, studentsData] = await Promise.all([
        DataService.getEvaluations(),
        DataService.getStudents(),
      ])
      setEvaluations(evaluationsData)
      setStudents(studentsData)
      setFilteredEvaluations(evaluationsData)
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
    let filtered = evaluations

    if (searchTerm) {
      filtered = filtered.filter(
        (evaluation) =>
          evaluation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          evaluation.studentName.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (studentFilter) {
      filtered = filtered.filter((evaluation) => evaluation.studentId === studentFilter)
    }

    if (gradeFilter) {
      filtered = filtered.filter((evaluation) => {
        const percentage = (evaluation.score / evaluation.maxScore) * 100
        switch (gradeFilter) {
          case "excellent":
            return percentage >= 90
          case "good":
            return percentage >= 70 && percentage < 90
          case "needs-improvement":
            return percentage < 70
          default:
            return true
        }
      })
    }

    // Sort by date (most recent first)
    filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    setFilteredEvaluations(filtered)
  }, [evaluations, searchTerm, studentFilter, gradeFilter])

  const getStats = () => {
    const total = filteredEvaluations.length
    const excellent = filteredEvaluations.filter((e) => e.score / e.maxScore >= 0.9).length
    const good = filteredEvaluations.filter((e) => e.score / e.maxScore >= 0.7 && e.score / e.maxScore < 0.9).length
    const average = total > 0 ? filteredEvaluations.reduce((sum, e) => sum + e.score / e.maxScore, 0) / total : 0

    return { total, excellent, good, average }
  }

  const stats = getStats()

  const evaluationsByStudent = students
    .map((student) => ({
      ...student,
      evaluations: filteredEvaluations.filter((evaluation) => evaluation.studentId === student.id),
      average: filteredEvaluations
        .filter((evaluation) => evaluation.studentId === student.id)
        .reduce(
          (sum, evaluation, _, arr) =>
            arr.length > 0 ? sum + ((evaluation.score / evaluation.maxScore) * 100) / arr.length : 0,
          0,
        ),
    }))
    .filter((student) => student.evaluations.length > 0 || viewMode === "by-student")

  if (loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 md:ml-64">
          <div className="p-6 md:p-8">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-64" />
              <div className="grid gap-4 md:grid-cols-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-24 bg-muted rounded" />
                ))}
              </div>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-64 bg-muted rounded" />
                ))}
              </div>
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Evaluaciones</h1>
              <p className="text-muted-foreground">
                Gestiona las calificaciones por alumno ({filteredEvaluations.length} evaluaciones)
              </p>
            </div>
            <div className="flex items-center gap-2">
              {/* View mode toggle */}
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "by-student" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("by-student")}
                  className="rounded-r-none"
                >
                  Por Alumno
                </Button>
                <Button
                  variant={viewMode === "all-evaluations" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("all-evaluations")}
                  className="rounded-l-none"
                >
                  Todas
                </Button>
              </div>
              <SimpleEvaluationForm onSuccess={loadData} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid gap-4 md:grid-cols-3 mb-8">
            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Star className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Evaluaciones</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{stats.excellent}</p>
                  <p className="text-sm text-muted-foreground">Excelentes (9-10)</p>
                </div>
              </div>
            </div>

            <div className="bg-card p-6 rounded-lg border">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Star className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{(stats.average * 10).toFixed(1)}</p>
                  <p className="text-sm text-muted-foreground">Promedio General</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-6 p-4 bg-card rounded-lg border">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar evaluaciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={studentFilter} onValueChange={setStudentFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Todos los alumnos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los alumnos</SelectItem>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Todas las notas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las notas</SelectItem>
                <SelectItem value="excellent">Excelente (9-10)</SelectItem>
                <SelectItem value="good">Bueno (7-8)</SelectItem>
                <SelectItem value="needs-improvement">Necesita mejorar (&lt;7)</SelectItem>
              </SelectContent>
            </Select>

            {(searchTerm !== "" || studentFilter !== "" || gradeFilter !== "all") && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm("")
                  setStudentFilter("")
                  setGradeFilter("all")
                }}
              >
                Limpiar filtros
              </Button>
            )}
          </div>

          {/* Evaluations Grid */}
          {viewMode === "by-student" ? (
            <div className="space-y-6">
              {evaluationsByStudent.map((student) => (
                <Card key={student.id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          {student.name}
                          <Badge variant="outline">{student.subject}</Badge>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                          {student.evaluations.length} evaluaciones • Promedio: {student.average.toFixed(1)}%
                        </p>
                      </div>
                      <div className={`text-2xl font-bold ${getScoreColor(student.average)}`}>
                        {student.average.toFixed(1)}%
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {student.evaluations.length > 0 ? (
                      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {student.evaluations.map((evaluation) => (
                          <EvaluationCard key={evaluation.id} evaluation={evaluation} onUpdate={loadData} />
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-4">No hay evaluaciones para este alumno</p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : /* All Evaluations View */
          filteredEvaluations.length === 0 ? (
            <div className="text-center py-12">
              <Star className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {evaluations.length === 0
                  ? "No tienes evaluaciones registradas aún"
                  : "No se encontraron evaluaciones con los filtros aplicados"}
              </p>
              {evaluations.length === 0 && <SimpleEvaluationForm onSuccess={loadData} />}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredEvaluations.map((evaluation) => (
                <EvaluationCard key={evaluation.id} evaluation={evaluation} onUpdate={loadData} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )

  function getScoreColor(score: number) {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    if (score >= 60) return "text-orange-600"
    return "text-red-600"
  }
}
