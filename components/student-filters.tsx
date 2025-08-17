"use client"

import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

interface StudentFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  subjectFilter: string
  onSubjectFilterChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  levelFilter: string
  onLevelFilterChange: (value: string) => void
  onClearFilters: () => void
}

export function StudentFilters({
  searchTerm,
  onSearchChange,
  subjectFilter,
  onSubjectFilterChange,
  statusFilter,
  onStatusFilterChange,
  levelFilter,
  onLevelFilterChange,
  onClearFilters,
}: StudentFiltersProps) {
  const hasActiveFilters = searchTerm || subjectFilter || statusFilter || levelFilter

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por nombre, email o teléfono..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <Select value={subjectFilter} onValueChange={onSubjectFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todas las materias" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las materias</SelectItem>
            <SelectItem value="Matemáticas">Matemáticas</SelectItem>
            <SelectItem value="Física">Física</SelectItem>
            <SelectItem value="Química">Química</SelectItem>
            <SelectItem value="Inglés">Inglés</SelectItem>
            <SelectItem value="Lengua">Lengua</SelectItem>
            <SelectItem value="Historia">Historia</SelectItem>
            <SelectItem value="Biología">Biología</SelectItem>
            <SelectItem value="Economía">Economía</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={onLevelFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los niveles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="Primaria">Primaria</SelectItem>
            <SelectItem value="ESO">ESO</SelectItem>
            <SelectItem value="Bachillerato">Bachillerato</SelectItem>
            <SelectItem value="Universidad">Universidad</SelectItem>
            <SelectItem value="Adultos">Adultos</SelectItem>
            <SelectItem value="Básico">Básico</SelectItem>
            <SelectItem value="Intermedio">Intermedio</SelectItem>
            <SelectItem value="Avanzado">Avanzado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusFilterChange}>
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
