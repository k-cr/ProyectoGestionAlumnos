"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface ClassFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  studentFilter: string
  onStudentFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  dateFilter: string
  onDateFilterChange: (value: string) => void
  onClearFilters: () => void
  students: Array<{ id: string; name: string }>
}

export function ClassFilters({
  searchTerm,
  onSearchChange,
  studentFilter,
  onStudentFilterChange,
  statusFilter,
  onStatusFilterChange,
  dateFilter,
  onDateFilterChange,
  onClearFilters,
  students,
}: ClassFiltersProps) {
  const hasActiveFilters = searchTerm || studentFilter || statusFilter || dateFilter

  const getDateFilterOptions = () => {
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date(today)
    nextWeek.setDate(nextWeek.getDate() + 7)

    return [
      { value: "all", label: "Todas las fechas" },
      { value: "today", label: "Hoy" },
      { value: "tomorrow", label: "Mañana" },
      { value: "week", label: "Esta semana" },
      { value: "month", label: "Este mes" },
    ]
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por alumno, materia o notas..."
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

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los estados" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            <SelectItem value="scheduled">Programadas</SelectItem>
            <SelectItem value="completed">Completadas</SelectItem>
            <SelectItem value="cancelled">Canceladas</SelectItem>
          </SelectContent>
        </Select>

        <Select value={dateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las fechas" />
          </SelectTrigger>
          <SelectContent>
            {getDateFilterOptions().map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
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
