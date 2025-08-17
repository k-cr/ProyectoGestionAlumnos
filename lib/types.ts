export interface Materia {
  ID_MATERIA: number
  nombreMateria: string
}

export interface Nivel {
  ID_NIVEL: number
  nombreNivel: string
}

export interface Alumno {
  ID_ALUMNO: number,
  FK_ID_MATERIA: number,
  FK_ID_NIVEL: number,
  nombreCompleto: string
  email: string
  telefono: string
  estado: number
  observaciones: string
  fechaInicio: string
}

export interface Clase {
  ID_CLASE: number
  FK_ID_ALUMNO: number
  fechaClase: string
  horaClase: string
  duracion: number
  estado: number
  notas?: string
  tareas?: string
}

export interface Evaluacion {
  ID_EVALUACION: number
  FK_ID_ALUMNO: number
  tituloEvaluacion: string
  notaEvaluacion: number
  notaMaxima: number
  observaciones?: string
  fechaEvaluacion:  string
}
