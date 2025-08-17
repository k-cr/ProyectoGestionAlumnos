import type { Alumno, Materia, Nivel, Clase, Evaluacion } from "./types"

// Simulamos operaciones asíncronas para hacer más realista la experiencia
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const alumnos: Alumno[] = []
const materias: Materia[] = []
const niveles: Nivel[] = []
const clases: Clase[] = []
const evaluaciones: Evaluacion[] = []

export class DataService {
  // Students
  static async getStudents(): Promise<Alumno[]> {
    await delay(300)
    // GET DE LA BASE DE DATOS
    return alumnos;
  }

  static async getStudent(id: number): Promise<Alumno | undefined> {
    await delay(200)
  return alumnos.find((alumno) => alumno.ID_ALUMNO === id);
  }

  static async addStudent(estudiante: Omit<Alumno, "id">): Promise<Alumno> {
    await delay(400)
    const nuevoEstudiante = { ...estudiante}
    alumnos.push(nuevoEstudiante)
    return nuevoEstudiante
  }

  static async updateStudent(id: number, updates: Partial<Alumno>): Promise<Alumno | undefined> {
    await delay(300)
    const index = alumnos.findIndex((student) => student.ID_ALUMNO === id)
    if (index !== -1) {
      alumnos[index] = { ...alumnos[index], ...updates }
      return alumnos[index]
    }
    return undefined
  }

  // Classes
  static async getClasses(): Promise<Clase[]> {
    await delay(300)
    return clases
  }

  static async getClassesByStudent(ID_ALUMNO: number): Promise<Clase[]> {
    await delay(200)
    return clases.filter((cls) => cls.FK_ID_ALUMNO === ID_ALUMNO)
  }

  static async addClass(classData: Omit<Clase, "id">): Promise<Clase> {
    await delay(400)
    const newClass = { ...classData, id: Date.now().toString() }
    clases.push(newClass)
    return newClass
  }

  // Evaluations
  static async getEvaluations(): Promise<Evaluacion[]> {
    await delay(300)
    return evaluaciones
  }

  static async getEvaluationsByStudent(studentId: number): Promise<Evaluacion[]> {
    await delay(200)
    return evaluaciones.filter((evaluation) => evaluation.FK_ID_ALUMNO === studentId)
  }

  static async addEvaluation(evaluation: Omit<Evaluacion, "id">): Promise<Evaluacion> {
    await delay(400)
    const newEvaluation = { ...evaluation, id: Date.now().toString() }
    evaluaciones.push(newEvaluation)
    return newEvaluation
  }

  // Dashboard stats
  static async getDashboardStats() {
    await delay(200)
    const totalStudents = alumnos.length
    const activeStudents = alumnos.filter((s) => s.estado === 1).length
    const todayClasses = clases.filter((c) => c.fechaClase === new Date().toISOString().split("T")[0]).length
    const recentEvaluations = evaluaciones.filter((e) => {
      const evalDate = new Date(e.fechaEvaluacion)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return evalDate >= weekAgo
    }).length

    return {
      totalStudents,
      activeStudents,
      todayClasses,
      recentEvaluations,
    }
  }
}
