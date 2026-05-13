import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuariosService } from '../../core/services/usuarios.service';
import { Usuario } from '../../core/models/usuario.model';

@Component({
  selector: 'app-editar-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-perfil.component.html',
  styleUrl: './editar-perfil.component.scss'
})
export class EditarPerfilComponent implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private authService = inject(AuthService);
  private usuariosService = inject(UsuariosService);

  usuario = signal<Usuario | null>(null);
  cargando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  error = signal<string>('');
  
  formulario!: FormGroup;

  posiciones = [
    { value: 'Base', label: 'Base' },
    { value: 'Escolta', label: 'Escolta' },
    { value: 'Alero', label: 'Alero' },
    { value: 'Ala-Pivot', label: 'Ala-Pivot' },
    { value: 'Pivot', label: 'Pivot' },
    { value: 'Hincha', label: 'Hincha' },
    { value: 'Cuerpo técnico', label: 'Cuerpo técnico' }
  ];

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarUsuario();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      nombrePersonal: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      telefono: ['', Validators.required],
      posicion: ['', Validators.required],
      direccion: ['', Validators.required],
      nombreApoderado: [''],
      telefonoApoderado: [''],
      fechaNacimiento: ['']
    });
  }

  cargarUsuario() {
    const usuarioActual = this.authService.currentUser();
    if (!usuarioActual) {
      this.error.set('No se pudo cargar el usuario');
      return;
    }

    this.usuario.set(usuarioActual);
    this.cargarDatosEnFormulario(usuarioActual);
  }

  cargarDatosEnFormulario(usuario: Usuario) {
    this.formulario.patchValue({
      nombrePersonal: usuario.nombrePersonal,
      nombreUsuario: usuario.nombreUsuario,
      telefono: usuario.telefono,
      posicion: usuario.posicion,
      direccion: usuario.direccion,
      nombreApoderado: usuario.nombreApoderado || '',
      telefonoApoderado: usuario.telefonoApoderado || '',
      fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().split('T')[0] : ''
    });
  }

  guardarCambios() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    this.error.set(''); // Limpiar error anterior
    const datos = this.formulario.value;

    console.log('Enviando datos:', datos);
    
    // Verificar token antes de enviar
    const token = this.authService.getToken();
    console.log('Token disponible:', token ? 'SÍ' : 'NO');
    if (token) {
      console.log('Primeros 50 caracteres del token:', token.substring(0, 50));
    } else {
      console.error('NO HAY TOKEN - Usuario debe iniciar sesión');
      this.error.set('No hay token de autenticación. Por favor, inicia sesión nuevamente.');
      this.guardando.set(false);
      return;
    }

    this.usuariosService.editarMiPerfil(datos).subscribe({
      next: (response) => {
        console.log('Respuesta exitosa:', response);
        // Actualizar usuario en el servicio de autenticación
        this.authService.setUser(response.usuario);
        this.guardando.set(false);
        alert('Perfil actualizado exitosamente');
        this.router.navigate(['/perfil']);
      },
      error: (err) => {
        console.error('Error completo:', err);
        console.error('Estado:', err.status);
        console.error('Mensaje:', err.message);
        console.error('Error body:', err.error);
        this.guardando.set(false);
        
        let mensajeError = 'Error al actualizar el perfil';
        if (err.status === 401) {
          mensajeError = 'No autorizado. Por favor, inicia sesión nuevamente.';
          // Limpiar token y redirigir al login
          setTimeout(() => {
            this.authService.logout();
            this.router.navigate(['/login']);
          }, 2000);
        } else if (err.status === 204) {
          mensajeError = 'El servidor respondió sin contenido (204)';
        } else if (err.error?.message) {
          mensajeError = err.error.message;
        }
        
        this.error.set(mensajeError);
        console.error('Mensaje de error mostrado:', mensajeError);
      }
    });
  }

  cancelar() {
    this.router.navigate(['/perfil']);
  }

  get campoInvalido() {
    return (campo: string) => {
      return this.formulario.get(campo)?.invalid && this.formulario.get(campo)?.touched;
    };
  }
}
