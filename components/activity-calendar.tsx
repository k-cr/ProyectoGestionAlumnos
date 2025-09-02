"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react"
import { DataService } from "@/lib/data-service"
import type { Class } from "@/lib/types"

export function ActivityCalendar() {
  const [classes, setClasses] = useState<Class[]>([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadClasses = async () => {
      try {
        const classesData = await DataService.getClasses()
        setClasses(classesData)
      } catch (error) {
        console.error("Error loading classes:", error)
      } finally {
        setLoading(false)
      }
    }
    loadClasses()
  }, [])

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day))
    }

    return days
  }

  const getClassesForDate = (date: Date) => {
    if (!date) return []
    const dateStr = date.toISOString().split("T")[0]
    return classes.filter((cls) => cls.date.startsWith(dateStr))
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ]

  const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"]

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Actividades
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse">
            <div className="h-8 bg-muted rounded mb-4" />
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 35 }).map((_, i) => (
                <div key={i} className="h-16 bg-muted rounded" />
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const days = getDaysInMonth(currentDate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Calendario de Actividades
          </CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => navigateMonth("prev")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="font-medium min-w-[140px] text-center">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </span>
            <Button variant="outline" size="sm" onClick={() => navigateMonth("next")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            if (!day) {
              return <div key={index} className="h-16" />
            }

            const dayClasses = getClassesForDate(day)
            const isToday = day.toDateString() === new Date().toDateString()
            const isPast = day < new Date(new Date().setHours(0, 0, 0, 0))

            return (
              <div
                key={index}
                className={`h-16 p-1 border rounded-md relative ${
                  isToday ? "bg-primary/10 border-primary" : "border-border"
                } ${isPast ? "opacity-60" : ""}`}
              >
                <div className="text-xs font-medium mb-1">{day.getDate()}</div>
                <div className="space-y-1">
                  {dayClasses.slice(0, 2).map((cls, i) => (
                    <div
                      key={i}
                      className={`text-xs px-1 py-0.5 rounded text-white truncate ${
                        cls.status === "completed"
                          ? "bg-green-500"
                          : cls.status === "cancelled"
                            ? "bg-red-500"
                            : "bg-primary"
                      }`}
                      title={`${cls.studentName} - ${cls.subject}`}
                    >
                      {cls.studentName.split(" ")[0]}
                    </div>
                  ))}
                  {dayClasses.length > 2 && (
                    <div className="text-xs text-muted-foreground">+{dayClasses.length - 2} más</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
