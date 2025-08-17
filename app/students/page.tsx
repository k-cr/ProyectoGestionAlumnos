"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { StudentForm } from "@/components/student-form"
import { StudentCard } from "@/components/student-card"
import { StudentFilters } from "@/components/student-filters"
import { DataService } from "@/lib/data-service"
import type { Student } from "@/lib/types"

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([])
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [subjectFilter, setSubjectFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [levelFilter, setLevelFilter] = useState("")

  const loadStudents = async () => {
    try {
      const data = await DataService.getStudents()
      setStudents(data)
      setFilteredStudents(data)
    } catch (error) {
      console.error("Error loading students:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadStudents()
  }, [])

  useEffect(() => {
    let filtered = students

    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm),
      )
    }

    if (subjectFilter) {
      filtered = filtered.filter((student) => student.subject === subjectFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((student) => student.status === statusFilter)
    }

    if (levelFilter) {
      filtered = filtered.filter((student) => student.level === levelFilter)
    }

    setFilteredStudents(filtered)
  }, [students, searchTerm, subjectFilter, statusFilter, levelFilter])

  const handleClearFilters = () => {
    setSearchTerm("")
    setSubjectFilter("")
    setStatusFilter("")
    setLevelFilter("")
  }

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
                <div key={i} className="h-64 bg-muted rounded animate-pulse" />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Alumnos</h1>
              <p className="text-muted-foreground">
                Gestiona tu lista de alumnos ({filteredStudents.length} de {students.length})
              </p>
            </div>
            <StudentForm onSuccess={loadStudents} />
          </div>

          {/* Filters */}
          <div className="mb-6">
            <StudentFilters
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              subjectFilter={subjectFilter}
              onSubjectFilterChange={setSubjectFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
              levelFilter={levelFilter}
              onLevelFilterChange={setLevelFilter}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Students Grid */}
          {filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                {students.length === 0
                  ? "No tienes alumnos registrados aún"
                  : "No se encontraron alumnos con los filtros aplicados"}
              </p>
              {students.length === 0 && <StudentForm onSuccess={loadStudents} />}
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {filteredStudents.map((student) => (
                <StudentCard key={student.id} student={student} onUpdate={loadStudents} />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
