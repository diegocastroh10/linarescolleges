import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { NoticiasService } from '../../core/services/noticias.service';
import { Noticia } from '../../core/models/noticia.model';

@Component({
  selector: 'app-noticias',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './noticias.component.html',
  styleUrl: './noticias.component.scss'
})
export class NoticiasComponent implements OnInit {
  private noticiasService = inject(NoticiasService);
  private router = inject(Router);

  noticias = signal<Noticia[]>([]);
  noticiasRecientes = signal<Noticia[]>([]);
  cargando = signal<boolean>(false);
  noticiaSeleccionada = signal<Noticia | null>(null);

  ngOnInit() {
    this.cargarNoticias();
    this.cargarNoticiasRecientes();
  }

  cargarNoticias() {
    this.cargando.set(true);
    this.noticiasService.obtenerPublicadas().subscribe({
      next: (response) => {
        this.noticias.set(response.noticias);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('Error al cargar noticias:', err);
        this.cargando.set(false);
      }
    });
  }

  cargarNoticiasRecientes() {
    this.noticiasService.obtenerUltimas(3).subscribe({
      next: (response) => {
        this.noticiasRecientes.set(response.noticias);
      },
      error: (err) => {
        console.error('Error al cargar noticias recientes:', err);
      }
    });
  }

  verNoticia(noticia: Noticia) {
    this.noticiaSeleccionada.set(noticia);
    // Incrementar visitas
    if (noticia._id) {
      this.noticiasService.obtenerNoticiaPublica(noticia._id).subscribe();
    }
  }

  cerrarDetalleNoticia() {
    this.noticiaSeleccionada.set(null);
  }

  formatearFecha(fecha: Date): string {
    const meses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    const dias = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const f = new Date(fecha);
    return `${dias[f.getDay()]} ${f.getDate()} ${meses[f.getMonth()]} del ${f.getFullYear()}`;
  }

  extraerTexto(html: string, maxLength: number = 150): string {
    const temp = document.createElement('div');
    temp.innerHTML = html;
    const texto = temp.textContent || temp.innerText || '';
    return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
  }
}
