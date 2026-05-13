import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.scss'
})
export class PerfilComponent implements OnInit {
  authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);
  private router = inject(Router);

  usuario = signal<Usuario | null>(null);
  cargando = signal<boolean>(false);
  subiendoFoto = signal<boolean>(false);
  error = signal<string>('');

  ngOnInit() {
    this.cargarPerfil();
  }

  cargarPerfil() {
    const usuarioActual = this.authService.currentUser();
    if (usuarioActual) {
      this.usuario.set(usuarioActual);
    }
  }

  obtenerIniciales(): string {
    const usuario = this.usuario();
    if (!usuario) return '?';
    const nombres = usuario.nombrePersonal.split(' ');
    if (nombres.length >= 2) {
      return nombres[0].charAt(0) + nombres[1].charAt(0);
    }
    return nombres[0].charAt(0);
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        this.error.set('Por favor selecciona una imagen válida');
        alert('Por favor selecciona una imagen válida');
        return;
      }

      // Validar tamaño (máximo 5MB para archivo original)
      if (file.size > 5 * 1024 * 1024) {
        this.error.set('La imagen no debe superar los 5MB');
        alert('La imagen no debe superar los 5MB');
        return;
      }

      this.subiendoFoto.set(true);
      this.error.set('');

      // Redimensionar y optimizar la imagen antes de convertirla a Base64
      this.redimensionarImagen(file);
    }
  }

  redimensionarImagen(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const img = new Image();
      img.onload = () => {
        // Crear canvas para redimensionar
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        // Configurar tamaño máximo (800x800 mantiene buena calidad)
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxSize) {
            height *= maxSize / width;
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width *= maxSize / height;
            height = maxSize;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a Base64 con calidad optimizada (0.8 = 80% calidad)
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        console.log('Base64 generado, tamaño:', base64.length, 'caracteres');
        console.log('Dimensiones:', width, 'x', height);
        this.actualizarFotoPerfil(base64);
      };
      img.onerror = () => {
        this.error.set('Error al procesar la imagen');
        this.subiendoFoto.set(false);
        alert('Error al procesar la imagen');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => {
      this.error.set('Error al leer el archivo');
      this.subiendoFoto.set(false);
      alert('Error al leer el archivo');
    };
    reader.readAsDataURL(file);
  }

  actualizarFotoPerfil(fotoPerfil: string) {
    const usuario = this.usuario();
    if (!usuario) {
      console.error('No hay usuario cargado');
      this.subiendoFoto.set(false);
      return;
    }

    console.log('Actualizando foto para usuario:', usuario._id);
    this.usuariosService.editarPorId(usuario._id, { fotoPerfil }).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.usuario.set(response.usuario);
        // Actualizar en el authService también
        this.authService.setUser(response.usuario);
        this.subiendoFoto.set(false);
        alert('Foto de perfil actualizada exitosamente');
      },
      error: (err) => {
        console.error('Error al actualizar foto:', err);
        this.error.set('Error al actualizar la foto de perfil: ' + (err.error?.mensaje || err.message));
        this.subiendoFoto.set(false);
        alert('Error al actualizar la foto de perfil: ' + (err.error?.mensaje || err.message || 'Error desconocido'));
      }
    });
  }

  editarPerfil() {
    this.router.navigate(['/perfil/editar']);
  }

  getRolBadgeClass(): string {
    const usuario = this.usuario();
    if (!usuario) return 'bg-secondary';
    switch (usuario.rol) {
      case 'superadmin': return 'bg-success';
      case 'administrador': return 'bg-primary';
      default: return 'bg-secondary';
    }
  }

  calcularEdad(): number {
    const usuario = this.usuario();
    if (!usuario || !usuario.fechaNacimiento) return 0;
    const hoy = new Date();
    const nacimiento = new Date(usuario.fechaNacimiento);
    let edad = hoy.getFullYear() - nacimiento.getFullYear();
    const mes = hoy.getMonth() - nacimiento.getMonth();
    if (mes < 0 || (mes === 0 && hoy.getDate() < nacimiento.getDate())) {
      edad--;
    }
    return edad;
  }
}
