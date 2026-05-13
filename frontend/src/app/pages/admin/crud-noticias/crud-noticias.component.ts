import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NoticiasService } from '../../../core/services/noticias.service';
import { Noticia } from '../../../core/models/noticia.model';

interface NoticiaForm {
  titulo: string;
  contenido: string;
  imagenPortada: string;
  orientacionImagen: 'horizontal' | 'vertical';
  autor: string;
  fechaPublicacion: string;
  urlInstagram: string;
  publicada: boolean;
}

@Component({
  selector: 'app-crud-noticias',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './crud-noticias.component.html',
  styleUrl: './crud-noticias.component.scss'
})
export class CrudNoticiasComponent implements OnInit {
  private fb = inject(FormBuilder);
  private noticiasService = inject(NoticiasService);

  noticias = signal<Noticia[]>([]);
  cargando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  mostrarModal = signal<boolean>(false);
  noticiaEditando = signal<Noticia | null>(null);
  
  formulario!: FormGroup;
  imagenPreview = signal<string>('');
  auspiciadoresPreview = signal<string[]>([]);
  archivoImagen: File | null = null;
  archivosAuspiciadores: File[] = [];

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarNoticias();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(10)]],
      contenido: ['', [Validators.required, Validators.minLength(50)]],
      imagenPortada: ['', Validators.required],
      orientacionImagen: ['horizontal', Validators.required],
      autor: ['', Validators.required],
      fechaPublicacion: ['', Validators.required],
      urlInstagram: [''],
      publicada: [false]
    });
  }

  cargarNoticias() {
    this.cargando.set(true);
    console.log('🔄 Cargando noticias...');
    
    this.noticiasService.obtenerTodas().subscribe({
      next: (response) => {
        console.log('✅ Noticias recibidas:', response);
        
        // Ordenar por fecha de publicación (más reciente primero)
        const noticiasOrdenadas = response.noticias.sort((a, b) => {
          const fechaA = new Date(a.fechaPublicacion).getTime();
          const fechaB = new Date(b.fechaPublicacion).getTime();
          return fechaB - fechaA; // Orden descendente
        });
        
        this.noticias.set(noticiasOrdenadas);
        console.log('📰 Total de noticias cargadas:', noticiasOrdenadas.length);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('❌ Error al cargar noticias:', err);
        console.error('Detalles del error:', err.message);
        if (err.status) {
          console.error('Status HTTP:', err.status);
        }
        this.cargando.set(false);
        alert(`Error al cargar las noticias: ${err.message || 'Error desconocido'}`);
      }
    });
  }

  abrirModalNueva() {
    this.noticiaEditando.set(null);
    this.formulario.reset({
      orientacionImagen: 'horizontal',
      publicada: false,
      fechaPublicacion: new Date().toISOString().split('T')[0]
    });
    this.imagenPreview.set('');
    this.auspiciadoresPreview.set([]);
    this.archivoImagen = null;
    this.archivosAuspiciadores = [];
    this.mostrarModal.set(true);
  }

  abrirModalEditar(noticia: Noticia) {
    this.noticiaEditando.set(noticia);
    this.formulario.patchValue({
      titulo: noticia.titulo,
      contenido: noticia.contenido,
      imagenPortada: noticia.imagenPortada,
      orientacionImagen: noticia.orientacionImagen,
      autor: noticia.autor,
      fechaPublicacion: new Date(noticia.fechaPublicacion).toISOString().split('T')[0],
      urlInstagram: noticia.urlInstagram || '',
      publicada: noticia.publicada
    });
    this.imagenPreview.set(noticia.imagenPortada);
    this.auspiciadoresPreview.set(noticia.auspiciadores);
    this.archivoImagen = null;
    this.archivosAuspiciadores = [];
    this.mostrarModal.set(true);
  }

  cerrarModal() {
    this.mostrarModal.set(false);
    this.noticiaEditando.set(null);
    this.formulario.reset();
    this.imagenPreview.set('');
    this.auspiciadoresPreview.set([]);
    this.archivoImagen = null;
    this.archivosAuspiciadores = [];
  }

  onImagenFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        input.value = '';
        return;
      }
      
      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen es muy grande. Tamaño máximo: 5MB');
        input.value = '';
        return;
      }
      
      this.archivoImagen = file;
      
      // Convertir a base64 para preview y almacenamiento
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        this.imagenPreview.set(base64);
        this.formulario.patchValue({ imagenPortada: base64 });
      };
      reader.readAsDataURL(file);
    }
  }

  onAuspiciadoresFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files || []);
    
    if (files.length === 0) return;
    
    // Validar cada archivo
    for (const file of files) {
      if (!file.type.startsWith('image/')) {
        alert(`El archivo ${file.name} no es una imagen válida`);
        input.value = '';
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        alert(`El archivo ${file.name} es muy grande. Tamaño máximo: 2MB`);
        input.value = '';
        return;
      }
    }
    
    this.archivosAuspiciadores = files;
    
    // Convertir todos a base64 para preview
    const previews: string[] = [];
    let procesados = 0;
    
    files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        previews[index] = e.target?.result as string;
        procesados++;
        
        if (procesados === files.length) {
          this.auspiciadoresPreview.set(previews);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  eliminarAuspiciador(index: number) {
    const previews = this.auspiciadoresPreview();
    previews.splice(index, 1);
    this.auspiciadoresPreview.set([...previews]);
    
    this.archivosAuspiciadores.splice(index, 1);
  }

  async guardar() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      alert('Por favor completa todos los campos requeridos');
      return;
    }

    this.guardando.set(true);
    const formData = this.formulario.value as NoticiaForm;
    
    // Procesar auspiciadores
    let auspiciadoresArray: string[] = [];
    
    if (this.archivosAuspiciadores.length > 0) {
      // Convertir archivos nuevos a base64
      auspiciadoresArray = await this.convertirArchivosABase64(this.archivosAuspiciadores);
    } else if (this.noticiaEditando()) {
      // Si está editando y no hay archivos nuevos, mantener los existentes
      auspiciadoresArray = this.auspiciadoresPreview();
    }

    const noticiaData: Partial<Noticia> = {
      titulo: formData.titulo,
      contenido: formData.contenido,
      imagenPortada: formData.imagenPortada, // Ya está en base64 desde onImagenFileChange
      orientacionImagen: formData.orientacionImagen,
      autor: formData.autor,
      fechaPublicacion: new Date(formData.fechaPublicacion),
      urlInstagram: formData.urlInstagram || undefined,
      auspiciadores: auspiciadoresArray,
      publicada: formData.publicada
    };

    const noticia = this.noticiaEditando();
    const operacion = noticia
      ? this.noticiasService.actualizar(noticia._id!, noticiaData)
      : this.noticiasService.crear(noticiaData);

    operacion.subscribe({
      next: () => {
        this.guardando.set(false);
        alert(noticia ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente');
        this.cerrarModal();
        this.cargarNoticias();
      },
      error: (err) => {
        console.error('Error al guardar noticia:', err);
        this.guardando.set(false);
        alert('Error al guardar la noticia');
      }
    });
  }

  private convertirArchivosABase64(archivos: File[]): Promise<string[]> {
    return Promise.all(
      archivos.map(archivo => {
        return new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(archivo);
        });
      })
    );
  }

  eliminar(noticia: Noticia) {
    if (!confirm(`¿Estás seguro de eliminar la noticia "${noticia.titulo}"?`)) {
      return;
    }

    this.noticiasService.eliminar(noticia._id!).subscribe({
      next: () => {
        alert('Noticia eliminada exitosamente');
        this.cargarNoticias();
      },
      error: (err) => {
        console.error('Error al eliminar noticia:', err);
        alert('Error al eliminar la noticia');
      }
    });
  }

  alternarPublicacion(noticia: Noticia) {
    this.noticiasService.alternarPublicacion(noticia._id!).subscribe({
      next: () => {
        alert(`Noticia ${!noticia.publicada ? 'publicada' : 'despublicada'} exitosamente`);
        this.cargarNoticias();
      },
      error: (err) => {
        console.error('Error al alternar publicación:', err);
        alert('Error al cambiar el estado de publicación');
      }
    });
  }

  formatearFecha(fecha: Date | string): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const f = new Date(fecha);
    
    // Validar fecha
    if (isNaN(f.getTime())) {
      return 'Fecha inválida';
    }
    
    return `${dias[f.getDay()]} ${f.getDate()} ${meses[f.getMonth()]} del ${f.getFullYear()}`;
  }
}
