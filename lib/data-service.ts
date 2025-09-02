import type { Student, Class, Evaluation, Progress, Configuration } from "./types"
import { mockStudents, mockClasses, mockEvaluations, mockProgress, mockConfiguration } from "./mock-data"

// Simulamos operaciones asíncronas para hacer más realista la experiencia
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export class DataService {
  // Students
  static async getStudents(): Promise<Student[]> {
    await delay(300)
    return [...mockStudents]
  }

  static async getStudent(id: string): Promise<Student | undefined> {
    await delay(200)
    return mockStudents.find((student) => student.id === id)
  }

  static async addStudent(student: Omit<Student, "id">): Promise<Student> {
    await delay(400)
    const newStudent = { ...student, id: Date.now().toString() }
    mockStudents.push(newStudent)
    return newStudent
  }

  static async updateStudent(id: string, updates: Partial<Student>): Promise<Student | undefined> {
    await delay(300)
    const index = mockStudents.findIndex((student) => student.id === id)
    if (index !== -1) {
      mockStudents[index] = { ...mockStudents[index], ...updates }
      return mockStudents[index]
    }
    return undefined
  }

  // Classes
  static async getClasses(): Promise<Class[]> {
    await delay(300)
    return [...mockClasses]
  }

  static async getClassesByStudent(studentId: string): Promise<Class[]> {
    await delay(200)
    return mockClasses.filter((cls) => cls.studentId === studentId)
  }

  static async addClass(classData: Omit<Class, "id">): Promise<Class> {
    await delay(400)
    const newClass = { ...classData, id: Date.now().toString() }
    mockClasses.push(newClass)
    return newClass
  }

  // Evaluations
  static async getEvaluations(): Promise<Evaluation[]> {
    await delay(300)
    return [...mockEvaluations]
  }

  static async getEvaluationsByStudent(studentId: string): Promise<Evaluation[]> {
    await delay(200)
    return mockEvaluations.filter((evaluation) => evaluation.studentId === studentId)
  }

  static async addEvaluation(evaluation: Omit<Evaluation, "id">): Promise<Evaluation> {
    await delay(400)
    const newEvaluation = { ...evaluation, id: Date.now().toString() }
    mockEvaluations.push(newEvaluation)
    return newEvaluation
  }

  // Progress
  static async getProgress(studentId: string): Promise<Progress | undefined> {
    await delay(200)
    return mockProgress.find((progress) => progress.studentId === studentId)
  }

  static async updateProgress(studentId: string, updates: Partial<Progress>): Promise<Progress | undefined> {
    await delay(300)
    const index = mockProgress.findIndex((progress) => progress.studentId === studentId)
    if (index !== -1) {
      mockProgress[index] = { ...mockProgress[index], ...updates }
      return mockProgress[index]
    }
    return undefined
  }

  // Dashboard stats
  static async getDashboardStats() {
    await delay(200)
    const totalStudents = mockStudents.length
    const activeStudents = mockStudents.filter((s) => s.status === "active").length
    const todayClasses = mockClasses.filter((c) => c.date === new Date().toISOString().split("T")[0]).length
    const recentEvaluations = mockEvaluations.filter((e) => {
      const evalDate = new Date(e.date)
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

  // Configuration
  static async getConfiguration(): Promise<Configuration> {
    await delay(200)
    return { ...mockConfiguration }
  }

  static async updateConfiguration(updates: Partial<Configuration>): Promise<Configuration> {
    await delay(300)
    Object.assign(mockConfiguration, { ...updates, lastUpdated: new Date().toISOString().split("T")[0] })
    return { ...mockConfiguration }
  }

  static async addLevel(level: string): Promise<Configuration> {
    await delay(200)
    if (!mockConfiguration.levels.includes(level)) {
      mockConfiguration.levels.push(level)
      mockConfiguration.lastUpdated = new Date().toISOString().split("T")[0]
    }
    return { ...mockConfiguration }
  }

  static async removeLevel(level: string): Promise<Configuration> {
    await delay(200)
    mockConfiguration.levels = mockConfiguration.levels.filter((l) => l !== level)
    mockConfiguration.lastUpdated = new Date().toISOString().split("T")[0]
    return { ...mockConfiguration }
  }

  static async addSubject(subject: string): Promise<Configuration> {
    await delay(200)
    if (!mockConfiguration.subjects.includes(subject)) {
      mockConfiguration.subjects.push(subject)
      mockConfiguration.lastUpdated = new Date().toISOString().split("T")[0]
    }
    return { ...mockConfiguration }
  }

  static async removeSubject(subject: string): Promise<Configuration> {
    await delay(200)
    mockConfiguration.subjects = mockConfiguration.subjects.filter((s) => s !== subject)
    mockConfiguration.lastUpdated = new Date().toISOString().split("T")[0]
    return { ...mockConfiguration }
  }
}
