"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ClassForm } from "./class-form"
import type { Class } from "@/lib/types"
import { ChevronLeft, ChevronRight, Plus } from "lucide-react"

interface ClassCalendarProps {
  classes: Class[]
  onUpdate: () => void
}

export function ClassCalendar({ classes, onUpdate }: ClassCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

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

  const getClassesForDate = (date: Date | null) => {
    if (!date) return []
    const dateString = date.toISOString().split("T")[0]
    return classes.filter((cls) => cls.date === dateString)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1)
      } else {
        newDate.setMonth(newDate.getMonth() + 1)
      }
      return newDate
    })
  }

  const isToday = (date: Date | null) => {
    if (!date) return false
    const today = new Date()
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    )
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

  const days = getDaysInMonth(currentDate)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">Calendario de Clases</CardTitle>
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
        <div className="grid grid-cols-7 gap-1 mb-4">
          {dayNames.map((day) => (
            <div key={day} className="p-2 text-center text-sm font-medium text-muted-foreground">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, index) => {
            const dayClasses = getClassesForDate(date)
            const hasClasses = dayClasses.length > 0

            return (
              <div
                key={index}
                className={`min-h-[80px] p-1 border rounded-md ${
                  date ? "bg-background hover:bg-accent/50" : "bg-muted/30"
                } ${isToday(date) ? "ring-2 ring-primary" : ""} ${hasClasses ? "border-primary/50 bg-primary/5" : ""}`}
              >
                {date && (
                  <>
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-sm ${isToday(date) ? "font-bold text-primary" : ""}`}>
                        {date.getDate()}
                      </span>
                      <ClassForm
                        onSuccess={onUpdate}
                        preselectedDate={date.toISOString().split("T")[0]}
                        trigger={
                          <Button variant="ghost" size="sm" className="h-5 w-5 p-0 opacity-60 hover:opacity-100">
                            <Plus className="h-3 w-3" />
                          </Button>
                        }
                      />
                    </div>
                    <div className="space-y-1">
                      {dayClasses.slice(0, 2).map((cls) => (
                        <div
                          key={cls.id}
                          className={`text-xs p-1 rounded text-center truncate border ${
                            cls.status === "completed"
                              ? "bg-green-100 text-green-800 border-green-200"
                              : cls.status === "cancelled"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                          }`}
                          title={`${cls.studentName} - ${cls.time} - ${cls.status}`}
                        >
                          {cls.time} {cls.studentName.split(" ")[0]}
                        </div>
                      ))}
                      {dayClasses.length > 2 && (
                        <div className="text-xs text-muted-foreground text-center font-medium">
                          +{dayClasses.length - 2} más
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
