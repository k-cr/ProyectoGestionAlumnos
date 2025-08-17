"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Plus, Star } from "lucide-react"
import { DataService } from "@/lib/data-service"
import type { Student } from "@/lib/types"

interface SimpleEvaluationFormProps {
  onSuccess: () => void
}

export function SimpleEvaluationForm({ onSuccess }: SimpleEvaluationFormProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [students, setStudents] = useState<Student[]>([])
  const [formData, setFormData] = useState({
    studentId: "",
    title: "",
    score: "",
    notes: "",
  })

  const loadStudents = async () => {
    if (students.length === 0) {
      try {
        const studentsData = await DataService.getStudents()
        setStudents(studentsData)
      } catch (error) {
        console.error("Error loading students:", error)
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.studentId || !formData.title || !formData.score) return

    setLoading(true)
    try {
      const student = students.find((s) => s.id === formData.studentId)
      if (!student) return

      const evaluation = {
        id: Date.now().toString(),
        studentId: formData.studentId,
        studentName: student.name,
        title: formData.title,
        type: "Evaluación" as const,
        score: Number.parseInt(formData.score),
        maxScore: 10,
        date: new Date().toISOString(),
        notes: formData.notes || undefined,
      }

      await DataService.addEvaluation(evaluation)

      setFormData({
        studentId: "",
        title: "",
        score: "",
        notes: "",
      })
      setOpen(false)
      onSuccess()
    } catch (error) {
      console.error("Error adding evaluation:", error)
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: string) => {
    const num = Number.parseInt(score)
    if (num >= 9) return "text-green-600"
    if (num >= 7) return "text-yellow-600"
    if (num >= 5) return "text-orange-600"
    return "text-red-600"
  }

  const getScoreLabel = (score: string) => {
    const num = Number.parseInt(score)
    if (num >= 9) return "Excelente"
    if (num >= 7) return "Bueno"
    if (num >= 5) return "Regular"
    return "Necesita mejorar"
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button onClick={loadStudents} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva Evaluación
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Registrar Evaluación
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="student">Alumno</Label>
            <Select
              value={formData.studentId}
              onValueChange={(value) => setFormData((prev) => ({ ...prev, studentId: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un alumno" />
              </SelectTrigger>
              <SelectContent>
                {students.map((student) => (
                  <SelectItem key={student.id} value={student.id}>
                    {student.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Título de la evaluación</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              placeholder="ej. Examen de matemáticas"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="score">Calificación (1-10)</Label>
            <div className="flex items-center gap-3">
              <Input
                id="score"
                type="number"
                min="1"
                max="10"
                value={formData.score}
                onChange={(e) => setFormData((prev) => ({ ...prev, score: e.target.value }))}
                placeholder="10"
                className="w-20"
                required
              />
              {formData.score && (
                <span className={`text-sm font-medium ${getScoreColor(formData.score)}`}>
                  {getScoreLabel(formData.score)}
                </span>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Observaciones (opcional)</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Comentarios sobre el desempeño..."
              rows={3}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Guardando..." : "Guardar Evaluación"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
