export interface Student {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  level: string
  startDate: string
  status: "active" | "inactive" | "paused"
  avatar?: string
  notes?: string
}

export interface Class {
  id: string
  studentId: string
  studentName: string
  subject: string
  date: string
  time: string
  duration: number // in minutes
  status: "scheduled" | "completed" | "cancelled"
  notes?: string
  homework?: string
}

export interface Evaluation {
  id: string
  studentId: string
  studentName: string
  subject: string
  type: "exam" | "homework" | "quiz" | "project"
  title: string
  date: string
  score: number
  maxScore: number
  notes?: string
}

export interface Progress {
  studentId: string
  subject: string
  currentLevel: string
  completedTopics: string[]
  strengths: string[]
  areasToImprove: string[]
  overallProgress: number // percentage
  lastUpdated: string
}

export interface Configuration {
  id: string
  levels: string[]
  subjects: string[]
  lastUpdated: string
}

export interface ConfigItem {
  id: string
  name: string
  type: "level" | "subject"
}
