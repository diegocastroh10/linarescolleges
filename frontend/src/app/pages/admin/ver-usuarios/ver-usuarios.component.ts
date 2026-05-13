import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-ver-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ver-usuarios.component.html',
  styleUrl: './ver-usuarios.component.scss'
})
export class VerUsuariosComponent {
  private usuariosService = inject(UsuariosService);

  // Estado
  busqueda = signal<string>('');
  usuarioEncontrado = signal<Usuario | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string>('');

  buscarUsuario() {
    const termino = this.busqueda().trim();
    
    if (!termino) {
      this.error.set('Ingresa un RUT o email para buscar');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.usuarioEncontrado.set(null);

    // Determinar si es RUT (números con o sin guión) o email
    const esRut = /^\d+(-\d)?$/.test(termino);

    const observable = esRut 
      ? this.usuariosService.buscarPorRut(termino)
      : this.usuariosService.buscarPorEmail(termino);

    observable.subscribe({
      next: (response) => {
        this.usuarioEncontrado.set(response.usuario);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Usuario no encontrado');
        this.cargando.set(false);
      }
    });
  }

  limpiarBusqueda() {
    this.busqueda.set('');
    this.usuarioEncontrado.set(null);
    this.error.set('');
  }
}

