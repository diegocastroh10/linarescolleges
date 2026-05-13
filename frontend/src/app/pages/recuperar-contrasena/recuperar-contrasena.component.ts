import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-recuperar-contrasena',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './recuperar-contrasena.component.html',
  styleUrl: './recuperar-contrasena.component.scss'
})
export class RecuperarContrasenaComponent {
  recuperarForm: FormGroup;
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router
  ) {
    this.recuperarForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]]
    });
  }

  get email() {
    return this.recuperarForm.get('email');
  }

  onSubmit() {
    if (this.recuperarForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      
      const email = this.recuperarForm.value.email;
      
      // Solicitar recuperación de contraseña
      this.usuariosService.solicitarRecuperacionPassword(email).subscribe({
        next: (response: { mensaje: string }) => {
          this.isLoading.set(false);
          this.successMessage.set(
            `Si existe una cuenta con ese correo, recibirás un email con instrucciones para recuperar tu contraseña. ` +
            `Por favor revisa tu bandeja de entrada y spam.`
          );
          
          // Redirigir al login después de 5 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 5000);
        },
        error: (error: any) => {
          this.isLoading.set(false);
          this.errorMessage.set('Ocurrió un error al procesar tu solicitud. Por favor intenta nuevamente.');
        }
      });
    } else {
      this.email?.markAsTouched();
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
