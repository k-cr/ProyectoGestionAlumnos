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
import type { Evaluation, Student } from "@/lib/types"
import { Plus, Edit, ClipboardCheck } from "lucide-react"

interface EvaluationFormProps {
  evaluation?: Evaluation
  onSuccess: () => void
  trigger?: React.ReactNode
}

export function EvaluationForm({ evaluation, onSuccess, trigger }: EvaluationFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: evaluation?.studentId || "",
    studentName: evaluation?.studentName || "",
    subject: evaluation?.subject || "",
    type: evaluation?.type || "exam",
    title: evaluation?.title || "",
    date: evaluation?.date || new Date().toISOString().split("T")[0],
    score: evaluation?.score || 0,
    maxScore: evaluation?.maxScore || 10,
    notes: evaluation?.notes || "",
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
      if (evaluation) {
        // Update existing evaluation - would need update method in DataService
        console.log("Update evaluation:", formData)
      } else {
        await DataService.addEvaluation(formData)
      }
      setOpen(false)
      onSuccess()
      if (!evaluation) {
        setFormData({
          studentId: "",
          studentName: "",
          subject: "",
          type: "exam",
          title: "",
          date: new Date().toISOString().split("T")[0],
          score: 0,
          maxScore: 10,
          notes: "",
        })
      }
    } catch (error) {
      console.error("Error saving evaluation:", error)
    } finally {
      setLoading(false)
    }
  }

  const getPercentage = () => {
    if (formData.maxScore === 0) return 0
    return Math.round((formData.score / formData.maxScore) * 100)
  }

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    if (percentage >= 60) return "text-orange-600"
    return "text-red-600"
  }

  const defaultTrigger = evaluation ? (
    <Button variant="ghost" size="sm">
      <Edit className="h-4 w-4" />
    </Button>
  ) : (
    <Button>
      <Plus className="h-4 w-4 mr-2" />
      Agregar Evaluación
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger || defaultTrigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ClipboardCheck className="h-5 w-5" />
            {evaluation ? "Editar Evaluación" : "Agregar Nueva Evaluación"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Alumno</Label>
            <Select value={formData.studentId} onValueChange={handleStudentChange} disabled={!!evaluation}>
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
              <Label htmlFor="type">Tipo de Evaluación</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value as any })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="exam">Examen</SelectItem>
                  <SelectItem value="homework">Tarea</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="project">Proyecto</SelectItem>
                </SelectContent>
              </Select>
            </div>
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título de la Evaluación</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Ej: Examen de Álgebra, Tarea Capítulo 5..."
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="score">Puntuación</Label>
              <Input
                id="score"
                type="number"
                step="0.1"
                min="0"
                max={formData.maxScore}
                value={formData.score}
                onChange={(e) => setFormData({ ...formData, score: Number.parseFloat(e.target.value) || 0 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxScore">Puntuación Máxima</Label>
              <Input
                id="maxScore"
                type="number"
                step="0.1"
                min="0.1"
                value={formData.maxScore}
                onChange={(e) => setFormData({ ...formData, maxScore: Number.parseFloat(e.target.value) || 10 })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Porcentaje</Label>
              <div
                className={`text-2xl font-bold ${getGradeColor(getPercentage())} flex items-center justify-center h-10`}
              >
                {getPercentage()}%
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notas y Comentarios</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Comentarios sobre el rendimiento, áreas de mejora..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : evaluation ? "Actualizar" : "Agregar"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
