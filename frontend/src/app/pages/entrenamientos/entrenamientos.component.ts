import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenamientosService } from '../../core/services/entrenamientos.service';
import { Entrenamiento, DiaSemana, NivelEntrenamiento, CategoriaEntrenamiento } from '../../core/models/entrenamiento.model';

@Component({
  selector: 'app-entrenamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './entrenamientos.component.html',
  styleUrl: './entrenamientos.component.scss'
})
export class EntrenamientosComponent implements OnInit {
  private entrenamientosService = inject(EntrenamientosService);

  // Estados
  entrenamientos = signal<Entrenamiento[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string>('');
  categoriaSeleccionada = signal<string>('todas');

  // Categorías disponibles
  readonly CATEGORIAS = [
    { valor: 'todas', label: 'Todas las categorías' },
    { valor: CategoriaEntrenamiento.U11_MIXTOS, label: CategoriaEntrenamiento.U11_MIXTOS },
    { valor: CategoriaEntrenamiento.U13_DAMAS, label: CategoriaEntrenamiento.U13_DAMAS },
    { valor: CategoriaEntrenamiento.U13_VARONES, label: CategoriaEntrenamiento.U13_VARONES },
    { valor: CategoriaEntrenamiento.U15_DAMAS, label: CategoriaEntrenamiento.U15_DAMAS },
    { valor: CategoriaEntrenamiento.U15_VARONES, label: CategoriaEntrenamiento.U15_VARONES },
    { valor: CategoriaEntrenamiento.U17_DAMAS, label: CategoriaEntrenamiento.U17_DAMAS },
    { valor: CategoriaEntrenamiento.U17_VARONES, label: CategoriaEntrenamiento.U17_VARONES },
    { valor: CategoriaEntrenamiento.U21_VARONES, label: CategoriaEntrenamiento.U21_VARONES },
    { valor: CategoriaEntrenamiento.ADULTAS_DAMAS, label: CategoriaEntrenamiento.ADULTAS_DAMAS },
    { valor: CategoriaEntrenamiento.ADULTOS_VARONES, label: CategoriaEntrenamiento.ADULTOS_VARONES }
  ];

  // Días de la semana en orden
  readonly DIAS_SEMANA = [
    DiaSemana.LUNES,
    DiaSemana.MARTES,
    DiaSemana.MIERCOLES,
    DiaSemana.JUEVES,
    DiaSemana.VIERNES,
    DiaSemana.SABADO,
    DiaSemana.DOMINGO
  ];

  ngOnInit() {
    this.cargarEntrenamientos();
  }

  cargarEntrenamientos() {
    this.cargando.set(true);
    this.error.set('');

    this.entrenamientosService.obtenerTodosPublico().subscribe({
      next: (response) => {
        this.entrenamientos.set(response.entrenamientos);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar los entrenamientos. Por favor, intenta más tarde.');
        this.cargando.set(false);
      }
    });
  }

  // Obtener entrenamientos por día ordenados por horario (con filtro de categoría)
  obtenerEntrenamientosPorDia(dia: DiaSemana): Entrenamiento[] {
    const categoria = this.categoriaSeleccionada();
    
    return this.entrenamientos()
      .filter(e => {
        // Filtrar por día
        const esMismoDia = e.dia === dia;
        
        // Filtrar por categoría si hay una seleccionada
        if (categoria === 'todas') {
          return esMismoDia;
        } else {
          // Verificar si el entrenamiento incluye la categoría seleccionada
          return esMismoDia && e.categorias.includes(categoria as CategoriaEntrenamiento);
        }
      })
      .sort((a, b) => {
        // Extraer la hora de inicio del formato "HH:MM" o "HH:MM-HH:MM"
        const horaA = a.horario.split('-')[0].split(':')[0];
        const horaB = b.horario.split('-')[0].split(':')[0];
        return parseInt(horaA) - parseInt(horaB);
      });
  }

  // Cambiar categoría seleccionada
  cambiarCategoria(categoria: string) {
    this.categoriaSeleccionada.set(categoria);
  }

  // Limpiar filtro
  limpiarFiltro() {
    this.categoriaSeleccionada.set('todas');
  }

  // Verificar si un día tiene entrenamientos (para mostrar/ocultar el contenedor del día)
  diaTieneEntrenamientos(dia: DiaSemana): boolean {
    return this.obtenerEntrenamientosPorDia(dia).length > 0;
  }

  // Verificar si hay algún día con entrenamientos (para mensaje cuando no hay resultados)
  hayEntrenamientosConFiltro(): boolean {
    return this.DIAS_SEMANA.some(dia => this.diaTieneEntrenamientos(dia));
  }

  // Obtener clase CSS para el badge de nivel
  getNivelBadgeClass(nivel: NivelEntrenamiento): string {
    switch(nivel) {
      case NivelEntrenamiento.PRINCIPIANTE:
        return 'nivel-principiante';
      case NivelEntrenamiento.INTERMEDIO:
        return 'nivel-intermedio';
      case NivelEntrenamiento.AVANZADO:
        return 'nivel-avanzado';
      default:
        return 'nivel-default';
    }
  }

  // Obtener icono según el nivel
  getNivelIcon(nivel: NivelEntrenamiento): string {
    switch(nivel) {
      case NivelEntrenamiento.PRINCIPIANTE:
        return 'bi-star';
      case NivelEntrenamiento.INTERMEDIO:
        return 'bi-star-fill';
      case NivelEntrenamiento.AVANZADO:
        return 'bi-trophy-fill';
      default:
        return 'bi-star';
    }
  }

  // Obtener color del día para el header
  getDiaColor(index: number): string {
    const colores = [
      'dia-lunes',
      'dia-martes', 
      'dia-miercoles',
      'dia-jueves',
      'dia-viernes',
      'dia-sabado',
      'dia-domingo'
    ];
    return colores[index] || 'dia-default';
  }
}
