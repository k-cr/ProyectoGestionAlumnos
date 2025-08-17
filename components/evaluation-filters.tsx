"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface EvaluationFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  studentFilter: string
  onStudentFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  gradeFilter: string
  onGradeFilterChange: (value: string) => void
  onClearFilters: () => void
  students: Array<{ id: string; name: string }>
}

export function EvaluationFilters({
  searchTerm,
  onSearchChange,
  studentFilter,
  onStudentFilterChange,
  typeFilter,
  onTypeFilterChange,
  dateFilter,
  onDateFilterChange,
  gradeFilter,
  onGradeFilterChange,
  onClearFilters,
  students,
}: EvaluationFiltersProps) {
  const hasActiveFilters = searchTerm || studentFilter || typeFilter || dateFilter || gradeFilter

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por título, alumno o comentarios..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={studentFilter} onValueChange={onStudentFilterChange}>
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

        <Select value={typeFilter} onValueChange={onTypeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los tipos" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los tipos</SelectItem>
            <SelectItem value="exam">Exámenes</SelectItem>
            <SelectItem value="homework">Tareas</SelectItem>
            <SelectItem value="quiz">Quizzes</SelectItem>
            <SelectItem value="project">Proyectos</SelectItem>
          </SelectContent>
        </Select>

        <Select value={gradeFilter} onValueChange={onGradeFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las notas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las notas</SelectItem>
            <SelectItem value="excellent">Excelente (90-100%)</SelectItem>
            <SelectItem value="good">Bueno (80-89%)</SelectItem>
            <SelectItem value="average">Regular (70-79%)</SelectItem>
            <SelectItem value="below">Bajo (60-69%)</SelectItem>
            <SelectItem value="failing">Insuficiente (&lt;60%)</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las fechas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las fechas</SelectItem>
            <SelectItem value="week">Esta semana</SelectItem>
            <SelectItem value="month">Este mes</SelectItem>
            <SelectItem value="quarter">Este trimestre</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button variant="outline" onClick={onClearFilters} className="flex items-center gap-2 bg-transparent">
            <X className="h-4 w-4" />
            Limpiar filtros
          </Button>
        )}
      </div>
    </div>
  )
}
