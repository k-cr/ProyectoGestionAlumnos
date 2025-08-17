"use client"

import { useEffect, useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { ClassForm } from "@/components/class-form"
import { ClassCard } from "@/components/class-card"
import { ClassFilters } from "@/components/class-filters"
import { ClassCalendar } from "@/components/class-calendar"
import { Button } from "@/components/ui/button"
import { DataService } from "@/lib/data-service"
import type { Class, Student } from "@/lib/types"
import { Calendar, List } from "lucide-react"

export default function ClassesPage() {
  const [classes, setClasses] = useState<Class[]>([])
  const [students, setStudents] = useState<Student[]>([])
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState<"list" | "calendar">("calendar") // Changed default view mode from "list" to "calendar"
  const [searchTerm, setSearchTerm] = useState("")
  const [studentFilter, setStudentFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [dateFilter, setDateFilter] = useState("")

  const loadData = async () => {
    try {
      const [classesData, studentsData] = await Promise.all([DataService.getClasses(), DataService.getStudents()])
      setClasses(classesData)
      setStudents(studentsData)
      setFilteredClasses(classesData)
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
    let filtered = classes

    if (searchTerm) {
      filtered = filtered.filter(
        (cls) =>
          cls.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cls.notes?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (studentFilter) {
      filtered = filtered.filter((cls) => cls.studentId === studentFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter((cls) => cls.status === statusFilter)
    }

    if (dateFilter) {
      const today = new Date()
      const todayString = today.toISOString().split("T")[0]

      switch (dateFilter) {
        case "today":
          filtered = filtered.filter((cls) => cls.date === todayString)
          break
        case "tomorrow":
          const tomorrow = new Date(today)
          tomorrow.setDate(tomorrow.getDate() + 1)
          const tomorrowString = tomorrow.toISOString().split("T")[0]
          filtered = filtered.filter((cls) => cls.date === tomorrowString)
          break
        case "week":
          const weekFromNow = new Date(today)
          weekFromNow.setDate(weekFromNow.getDate() + 7)
          filtered = filtered.filter((cls) => {
            const classDate = new Date(cls.date)
            return classDate >= today && classDate <= weekFromNow
          })
          break
        case "month":
          const monthFromNow = new Date(today)
          monthFromNow.setMonth(monthFromNow.getMonth() + 1)
          filtered = filtered.filter((cls) => {
            const classDate = new Date(cls.date)
            return classDate >= today && classDate <= monthFromNow
          })
          break
      }
    }

    // Sort by date and time
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`)
      const dateB = new Date(`${b.date}T${b.time}`)
      return dateA.getTime() - dateB.getTime()
    })

    setFilteredClasses(filtered)
  }, [classes, searchTerm, studentFilter, statusFilter, dateFilter])

  const handleClearFilters = () => {
    setSearchTerm("")
    setStudentFilter("")
    setStatusFilter("")
    setDateFilter("")
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
              <h1 className="text-3xl font-bold text-foreground mb-2">Clases</h1>
              <p className="text-muted-foreground">
                Gestiona tu calendario de clases ({filteredClasses.length} de {classes.length})
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center border rounded-md">
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-none"
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === "calendar" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("calendar")}
                  className="rounded-l-none"
                >
                  <Calendar className="h-4 w-4" />
                </Button>
              </div>
              <ClassForm onSuccess={loadData} />
            </div>
          </div>

          {viewMode === "calendar" ? (
            <ClassCalendar classes={classes} onUpdate={loadData} />
          ) : (
            <>
              {/* Filters */}
              <div className="mb-6">
                <ClassFilters
                  searchTerm={searchTerm}
                  onSearchChange={setSearchTerm}
                  studentFilter={studentFilter}
                  onStudentFilterChange={setStudentFilter}
                  statusFilter={statusFilter}
                  onStatusFilterChange={setStatusFilter}
                  dateFilter={dateFilter}
                  onDateFilterChange={setDateFilter}
                  onClearFilters={handleClearFilters}
                  students={students.map((s) => ({ id: s.id, name: s.name }))}
                />
              </div>

              {/* Classes Grid */}
              {filteredClasses.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">
                    {classes.length === 0
                      ? "No tienes clases programadas aún"
                      : "No se encontraron clases con los filtros aplicados"}
                  </p>
                  {classes.length === 0 && <ClassForm onSuccess={loadData} />}
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {filteredClasses.map((classData) => (
                    <ClassCard key={classData.id} classData={classData} onUpdate={loadData} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}
