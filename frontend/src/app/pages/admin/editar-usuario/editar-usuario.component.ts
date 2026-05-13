import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuariosService } from '../../../core/services/usuarios.service';
import { Usuario, UserRole } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './editar-usuario.component.html',
  styleUrl: './editar-usuario.component.scss'
})
export class EditarUsuarioComponent implements OnInit {
  private fb = inject(FormBuilder);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private usuariosService = inject(UsuariosService);

  usuarioId = signal<string>('');
  usuario = signal<Usuario | null>(null);
  cargando = signal<boolean>(false);
  guardando = signal<boolean>(false);
  error = signal<string>('');
  
  formulario!: FormGroup;

  ngOnInit() {
    this.inicializarFormulario();
    this.cargarUsuario();
  }

  inicializarFormulario() {
    this.formulario = this.fb.group({
      nombrePersonal: ['', Validators.required],
      nombreUsuario: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      rut: ['', Validators.required],
      telefono: ['', Validators.required],
      posicion: ['', Validators.required],
      direccion: ['', Validators.required],
      nombreApoderado: [''],
      telefonoApoderado: [''],
      fechaNacimiento: ['']
    });
  }

  cargarUsuario() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('ID de usuario no válido');
      return;
    }

    this.usuarioId.set(id);
    this.cargando.set(true);

    this.usuariosService.buscarPorId(id).subscribe({
      next: (response) => {
        this.usuario.set(response.usuario);
        this.cargarDatosEnFormulario(response.usuario);
        this.cargando.set(false);
      },
      error: (err) => {
        this.error.set('Error al cargar el usuario');
        this.cargando.set(false);
      }
    });
  }

  cargarDatosEnFormulario(usuario: Usuario) {
    this.formulario.patchValue({
      nombrePersonal: usuario.nombrePersonal,
      nombreUsuario: usuario.nombreUsuario,
      email: usuario.email,
      rut: usuario.rut,
      telefono: usuario.telefono,
      posicion: usuario.posicion,
      direccion: usuario.direccion,
      nombreApoderado: usuario.nombreApoderado,
      telefonoApoderado: usuario.telefonoApoderado,
      fechaNacimiento: usuario.fechaNacimiento ? new Date(usuario.fechaNacimiento).toISOString().split('T')[0] : ''
    });
  }

  guardarCambios() {
    if (this.formulario.invalid) {
      this.formulario.markAllAsTouched();
      return;
    }

    this.guardando.set(true);
    const datos = this.formulario.value;

    this.usuariosService.editarPorId(this.usuarioId(), datos).subscribe({
      next: (response) => {
        this.guardando.set(false);
        alert('Usuario actualizado exitosamente');
        this.router.navigate(['/admin/usuarios']);
      },
      error: (err) => {
        this.guardando.set(false);
        alert('Error al actualizar el usuario');
      }
    });
  }

  cancelar() {
    this.router.navigate(['/admin/usuarios']);
  }

  get campoInvalido() {
    return (campo: string) => {
      return this.formulario.get(campo)?.invalid && this.formulario.get(campo)?.touched;
    };
  }
}

