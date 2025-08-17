"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DataService } from "@/lib/data-service"
import type { Class, Student } from "@/lib/types"
import { Plus, Edit, Calendar } from "lucide-react"

interface ClassFormProps {
  classData?: Class
  onSuccess: () => void
  trigger?: React.ReactNode
  preselectedDate?: string
}

export function ClassForm({ classData, onSuccess, trigger, preselectedDate }: ClassFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: classData?.studentId || "",
    studentName: classData?.studentName || "",
    subject: classData?.subject || "",
    date: classData?.date || preselectedDate || "",
    time: classData?.time || "",
    duration: classData?.duration || 60,
    status: classData?.status || "scheduled",
    notes: classData?.notes || "",
    homework: classData?.homework || "",
  })

  useEffect(() => {
    const loadStudents = async () => {
      try {
        const data = await DataService.getStudents()
        setStudents(data.filter((s) => s.status === "active"))
      } catch (error) {
        console.error("Error loading students:", error)
      }
    }
    loadStudents()
  }, [])

  const handleStudentChange = (studentId: string) => {
    const student = students.find((s) => s.id === studentId)
    if (student) {
      setFormData({
        ...formData,
        studentId,
        studentName: student.name,
        subject: student.subject,
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (classData) {
        // Update existing class - would need update method in DataService
        console.log("Update class:", formData)
      } else {
        await DataService.addClass(formData)
      }
      setOpen(false)
      onSuccess()
      if (!classData) {
        setFormData({
          studentId: "",
          studentName: "",
          subject: "",
          date: preselectedDate || "",
          time: "",
          duration: 60,
          status: "scheduled",
          notes: "",
          homework: "",
        })
      }
    } catch (error) {
      console.error("Error saving class:", error)
    } finally {
      setLoading(false)
    }
  }

  const defaultTrigger = classData ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Programar Clase
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {classData ? "Editar Clase" : "Programar Nueva Clase"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Alumno</Label>
            <Select value={formData.studentId} onValueChange={handleStudentChange} disabled={!!classData}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar alumno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name} - {student.subject}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Fecha</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Hora</Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duración (minutos)</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => setFormData({ ...formData, duration: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="30">30 minutos</SelectItem>
                  <SelectItem value="45">45 minutos</SelectItem>
                  <SelectItem value="60">1 hora</SelectItem>
                  <SelectItem value="90">1.5 horas</SelectItem>
                  <SelectItem value="120">2 horas</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Estado</Label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Programada</SelectItem>
                  <SelectItem value="completed">Completada</SelectItem>
                  <SelectItem value="cancelled">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas de la clase</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Temas a tratar, objetivos de la clase..."
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="homework">Tarea asignada</Label>
            <Textarea
              id="homework"
              value={formData.homework}
              onChange={(e) => setFormData({ ...formData, homework: e.target.value })}
              placeholder="Ejercicios, lecturas, tareas para casa..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : classData ? "Actualizar" : "Programar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
