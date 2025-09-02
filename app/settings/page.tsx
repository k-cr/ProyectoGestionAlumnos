"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ConfigListManager } from "@/components/config-list-manager"
import { DataService } from "@/lib/data-service"
import type { Configuration } from "@/lib/types"
import { Settings, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function SettingsPage() {
  const [config, setConfig] = useState<Configuration | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadConfiguration()
  }, [])

  const loadConfiguration = async () => {
    try {
      setLoading(true)
      const configuration = await DataService.getConfiguration()
      setConfig(configuration)
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleAddLevel = async (level: string) => {
    try {
      setSaving(true)
      const updatedConfig = await DataService.addLevel(level)
      setConfig(updatedConfig)
      toast({
        title: "Éxito",
        description: "Nivel agregado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar el nivel",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveLevel = async (level: string) => {
    try {
      setSaving(true)
      const updatedConfig = await DataService.removeLevel(level)
      setConfig(updatedConfig)
      toast({
        title: "Éxito",
        description: "Nivel eliminado correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el nivel",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddSubject = async (subject: string) => {
    try {
      setSaving(true)
      const updatedConfig = await DataService.addSubject(subject)
      setConfig(updatedConfig)
      toast({
        title: "Éxito",
        description: "Materia agregada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo agregar la materia",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveSubject = async (subject: string) => {
    try {
      setSaving(true)
      const updatedConfig = await DataService.removeSubject(subject)
      setConfig(updatedConfig)
      toast({
        title: "Éxito",
        description: "Materia eliminada correctamente",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la materia",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <RefreshCw className="h-8 w-8 animate-spin text-rose-600" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-rose-600" />
        <div>
          <h1 className="text-3xl font-bold text-rose-900">Configuraciones</h1>
          <p className="text-rose-700">Gestiona los niveles y materias disponibles</p>
        </div>
      </div>

      {config && (
        <div className="grid gap-6 md:grid-cols-2">
          <ConfigListManager
            title="Niveles Académicos"
            items={config.levels}
            onAdd={handleAddLevel}
            onRemove={handleRemoveLevel}
            placeholder="Ej: Primaria, Secundaria..."
          />

          <ConfigListManager
            title="Materias Disponibles"
            items={config.subjects}
            onAdd={handleAddSubject}
            onRemove={handleRemoveSubject}
            placeholder="Ej: Matemáticas, Física..."
          />
        </div>
      )}

      <Card className="bg-rose-50/30 border-rose-200">
        <CardHeader>
          <CardTitle className="text-rose-800">Información</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-rose-700 text-sm">
            Los niveles y materias configurados aquí se utilizarán en los formularios de registro de alumnos,
            planificación de clases y evaluaciones. Última actualización: {config?.lastUpdated}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
