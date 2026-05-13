import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario, UserRole } from '../../../core/models/usuario.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crud-usuarios.component.html',
  styleUrl: './crud-usuarios.component.scss'
})
export class CrudUsuariosComponent {
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  // Estado
  busqueda = signal<string>('');
  usuarioEncontrado = signal<Usuario | null>(null);
  cargando = signal<boolean>(false);
  error = signal<string>('');
  
  // Modales
  mostrarModalRol = signal<boolean>(false);
  mostrarModalDesactivar = signal<boolean>(false);
  
  // Datos para modales
  rolSeleccionado = signal<UserRole>(UserRole.PERSONA);
  roles = [UserRole.PERSONA, UserRole.ADMINISTRADOR, UserRole.SUPERADMIN];

  buscarUsuario() {
    const termino = this.busqueda().trim();
    
    if (!termino) {
      this.error.set('Ingresa un RUT o email para buscar');
      return;
    }

    this.cargando.set(true);
    this.error.set('');
    this.usuarioEncontrado.set(null);

    // Determinar si es RUT (7-8 dígitos, guión opcional, dígito verificador o K) o email
    const esRut = /^\d{7,8}(-?[0-9kK])?$/.test(termino);

    // Si es RUT, normalizarlo agregando guión si no lo tiene
    let terminoBusqueda = termino;
    if (esRut && !termino.includes('-') && termino.length >= 8) {
      // Agregar guión antes del último dígito: 191337549 -> 19133754-9
      terminoBusqueda = termino.slice(0, -1) + '-' + termino.slice(-1);
    }

    const observable = esRut 
      ? this.usuariosService.buscarPorRut(terminoBusqueda)
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

  // Navegación a editar
  editarUsuario() {
    const usuario = this.usuarioEncontrado();
    if (usuario) {
      this.router.navigate(['/admin/usuarios/editar', usuario._id]);
    }
  }

  // Modal de asignar rol
  abrirModalRol() {
    const usuario = this.usuarioEncontrado();
    if (usuario) {
      this.rolSeleccionado.set(usuario.rol);
      this.mostrarModalRol.set(true);
    }
  }

  cerrarModalRol() {
    this.mostrarModalRol.set(false);
  }

  guardarRol() {
    const usuario = this.usuarioEncontrado();
    if (!usuario) return;

    this.cargando.set(true);
    
    this.usuariosService.editarPorId(usuario._id, { 
      rol: this.rolSeleccionado() 
    }).subscribe({
      next: (response) => {
        this.usuarioEncontrado.set(response.usuario);
        this.cerrarModalRol();
        this.cargando.set(false);
        alert('Rol actualizado exitosamente');
      },
      error: (err) => {
        this.cargando.set(false);
        alert('Error al actualizar el rol');
      }
    });
  }

  // Modal de desactivar
  abrirModalDesactivar() {
    this.mostrarModalDesactivar.set(true);
  }

  cerrarModalDesactivar() {
    this.mostrarModalDesactivar.set(false);
  }

  confirmarDesactivar() {
    const usuario = this.usuarioEncontrado();
    if (!usuario) return;

    this.cargando.set(true);
    
    this.usuariosService.desactivarCuenta(usuario.rut).subscribe({
      next: (response) => {
        alert('Usuario desactivado exitosamente');
        this.cerrarModalDesactivar();
        this.limpiarBusqueda();
        this.cargando.set(false);
      },
      error: (err) => {
        this.cargando.set(false);
        alert('Error al desactivar el usuario');
      }
    });
  }
}

