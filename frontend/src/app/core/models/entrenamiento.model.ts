export enum DiaSemana {
  LUNES = 'Lunes',
  MARTES = 'Martes',
  MIERCOLES = 'Miércoles',
  JUEVES = 'Jueves',
  VIERNES = 'Viernes',
  SABADO = 'Sábado',
  DOMINGO = 'Domingo'
}

export enum CategoriaEntrenamiento {
  U11_MIXTOS = 'U11 mixtos',
  U13_DAMAS = 'U13 damas',
  U13_VARONES = 'U13 varones',
  U15_DAMAS = 'U15 damas',
  U15_VARONES = 'U15 varones',
  U17_DAMAS = 'U17 damas',
  U17_VARONES = 'U17 varones',
  U21_VARONES = 'U21 varones',
  ADULTAS_DAMAS = 'Adultas damas',
  ADULTOS_VARONES = 'Adultos varones'
}

export enum NivelEntrenamiento {
  PRINCIPIANTE = 'Principiante',
  INTERMEDIO = 'Intermedio',
  AVANZADO = 'Avanzado'
}

export interface Entrenamiento {
  _id: string;
  dia: DiaSemana;
  categorias: CategoriaEntrenamiento[];
  horario: string;
  lugar: string;
  profesorACargo: string;
  nivel: NivelEntrenamiento;
  observaciones?: string;
  fechaCreacion: Date;
  fechaActualizacion: Date;
}

export interface EntrenamientoFormData {
  dia: DiaSemana;
  categorias: CategoriaEntrenamiento[];
  horario: string;
  lugar: string;
  profesorACargo: string;
  nivel: NivelEntrenamiento;
  observaciones?: string;
}
