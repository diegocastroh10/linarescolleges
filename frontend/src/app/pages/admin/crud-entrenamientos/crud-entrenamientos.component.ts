import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EntrenamientosService } from '../../../core/services/entrenamientos.service';
import { Entrenamiento, EntrenamientoFormData, DiaSemana, CategoriaEntrenamiento, NivelEntrenamiento } from '../../../core/models/entrenamiento.model';

@Component({
  selector: 'app-crud-entrenamientos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-entrenamientos.component.html',
  styleUrl: './crud-entrenamientos.component.scss'
})
export class CrudEntrenamientosComponent implements OnInit {
  private entrenamientosService = inject(EntrenamientosService);

  // Estados
  entrenamientos = signal<Entrenamiento[]>([]);
  cargando = signal<boolean>(false);
  error = signal<string>('');

  // Modal
  mostrarModal = signal<boolean>(false);
  modoEdicion = signal<boolean>(false);
  entrenamientoSeleccionado = signal<Entrenamiento | null>(null);

  // Modal de eliminación
  mostrarModalEliminar = signal<boolean>(false);
  entrenamientoAEliminar = signal<Entrenamiento | null>(null);

  // Formulario
  formulario: EntrenamientoFormData = {
    dia: DiaSemana.LUNES,
    categorias: [],
    horario: '',
    lugar: '',
    profesorACargo: '',
    nivel: NivelEntrenamiento.PRINCIPIANTE,
    observaciones: ''
  };

  // Enums para el template
  readonly DIAS_SEMANA = Object.values(DiaSemana);
  readonly CATEGORIAS = Object.values(CategoriaEntrenamiento);
  readonly NIVELES = Object.values(NivelEntrenamiento);

  ngOnInit() {
    this.cargarEntrenamientos();
  }

  cargarEntrenamientos() {
    this.cargando.set(true);
    this.error.set('');

    this.entrenamientosService.obtenerTodos().subscribe({
      next: (response) => {
        this.entrenamientos.set(response.entrenamientos);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar entrenamientos');
        this.cargando.set(false);
      }
    });
  }

  // Obtener entrenamientos por día
  obtenerEntrenamientosPorDia(dia: DiaSemana): Entrenamiento[] {
    return this.entrenamientos().filter(e => e.dia === dia);
  }

  // Abrir modal para crear
  abrirModalCrear() {
    this.modoEdicion.set(false);
    this.entrenamientoSeleccionado.set(null);
    this.resetFormulario();
    this.mostrarModal.set(true);
  }

  // Abrir modal para editar
  abrirModalEditar(entrenamiento: Entrenamiento) {
    this.modoEdicion.set(true);
    this.entrenamientoSeleccionado.set(entrenamiento);
    this.formulario = {
      dia: entrenamiento.dia,
      categorias: [...entrenamiento.categorias],
      horario: entrenamiento.horario,
      lugar: entrenamiento.lugar,
      profesorACargo: entrenamiento.profesorACargo,
      nivel: entrenamiento.nivel,
      observaciones: entrenamiento.observaciones || ''
    };
    this.mostrarModal.set(true);
  }

  // Cerrar modal
  cerrarModal() {
    this.mostrarModal.set(false);
    this.resetFormulario();
  }

  // Reset formulario
  resetFormulario() {
    this.formulario = {
      dia: DiaSemana.LUNES,
      categorias: [],
      horario: '',
      lugar: '',
      profesorACargo: '',
      nivel: NivelEntrenamiento.PRINCIPIANTE,
      observaciones: ''
    };
  }

  // Toggle categoría (selección múltiple)
  toggleCategoria(categoria: CategoriaEntrenamiento) {
    const index = this.formulario.categorias.indexOf(categoria);
    if (index > -1) {
      this.formulario.categorias.splice(index, 1);
    } else {
      this.formulario.categorias.push(categoria);
    }
  }

  // Verificar si categoría está seleccionada
  isCategoriaSeleccionada(categoria: CategoriaEntrenamiento): boolean {
    return this.formulario.categorias.includes(categoria);
  }

  // Guardar (crear o editar)
  guardar() {
    // Validaciones
    if (this.formulario.categorias.length === 0) {
      alert('Debes seleccionar al menos una categoría');
      return;
    }

    if (!this.formulario.horario || !this.formulario.lugar || !this.formulario.profesorACargo) {
      alert('Debes completar todos los campos obligatorios');
      return;
    }

    this.cargando.set(true);

    if (this.modoEdicion()) {
      // Editar
      const id = this.entrenamientoSeleccionado()?._id;
      if (!id) return;

      this.entrenamientosService.actualizar(id, this.formulario).subscribe({
        next: (response) => {
          this.cargarEntrenamientos();
          this.cerrarModal();
          this.cargando.set(false);
          alert('Entrenamiento actualizado exitosamente');
        },
        error: (err) => {
          this.cargando.set(false);
          alert('Error al actualizar el entrenamiento');
        }
      });
    } else {
      // Crear
      this.entrenamientosService.crear(this.formulario).subscribe({
        next: (response) => {
          this.cargarEntrenamientos();
          this.cerrarModal();
          this.cargando.set(false);
          alert('Entrenamiento creado exitosamente');
        },
        error: (err) => {
          this.cargando.set(false);
          alert('Error al crear el entrenamiento');
        }
      });
    }
  }

  // Abrir modal de confirmación para eliminar
  abrirModalEliminar(entrenamiento: Entrenamiento) {
    this.entrenamientoAEliminar.set(entrenamiento);
    this.mostrarModalEliminar.set(true);
  }

  // Cerrar modal de eliminación
  cerrarModalEliminar() {
    this.mostrarModalEliminar.set(false);
    this.entrenamientoAEliminar.set(null);
  }

  // Confirmar eliminación
  confirmarEliminar() {
    const entrenamiento = this.entrenamientoAEliminar();
    if (!entrenamiento) return;

    this.cargando.set(true);

    this.entrenamientosService.eliminar(entrenamiento._id).subscribe({
      next: (response) => {
        this.cargarEntrenamientos();
        this.cerrarModalEliminar();
        this.cargando.set(false);
        alert('Entrenamiento eliminado exitosamente');
      },
      error: (err) => {
        this.cargando.set(false);
        alert('Error al eliminar el entrenamiento');
      }
    });
  }

  // Formatear categorías para mostrar
  formatearCategorias(categorias: CategoriaEntrenamiento[]): string {
    return categorias.join(', ');
  }

  // Obtener clase CSS para el badge de nivel
  getNivelBadgeClass(nivel: NivelEntrenamiento): string {
    switch(nivel) {
      case NivelEntrenamiento.PRINCIPIANTE:
        return 'badge bg-success';
      case NivelEntrenamiento.INTERMEDIO:
        return 'badge bg-warning text-dark';
      case NivelEntrenamiento.AVANZADO:
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  }
}
