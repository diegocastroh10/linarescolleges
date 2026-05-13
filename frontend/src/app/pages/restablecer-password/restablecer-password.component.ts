import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { UsuariosService } from '../../core/services/usuarios.service';

@Component({
  selector: 'app-restablecer-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './restablecer-password.component.html',
  styleUrl: './restablecer-password.component.scss'
})
export class RestablecerPasswordComponent implements OnInit {
  restablecerForm: FormGroup;
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  tokenValido = signal<boolean>(false);
  verificandoToken = signal<boolean>(true);
  showPassword = signal<boolean>(false);
  showConfirmPassword = signal<boolean>(false);
  private token: string = '';

  constructor(
    private fb: FormBuilder,
    private usuariosService: UsuariosService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.restablecerForm = this.fb.group({
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        this.passwordValidator
      ]],
      confirmPassword: ['', [Validators.required]]
    }, {
      validators: this.passwordMatchValidator
    });
  }

  ngOnInit() {
    // Obtener token de la URL
    this.token = this.route.snapshot.paramMap.get('token') || '';
    
    if (!this.token) {
      this.errorMessage.set('Token de recuperación no válido.');
      this.verificandoToken.set(false);
      return;
    }

    // Verificar validez del token
    this.usuariosService.verificarTokenRecuperacion(this.token).subscribe({
      next: (response) => {
        this.tokenValido.set(response.valido);
        this.verificandoToken.set(false);
      },
      error: (error) => {
        this.errorMessage.set('El enlace de recuperación ha expirado o no es válido.');
        this.tokenValido.set(false);
        this.verificandoToken.set(false);
      }
    });
  }

  passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

    const passwordValid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;

    return !passwordValid ? {
      passwordStrength: {
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar
      }
    } : null;
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    if (!password || !confirmPassword) return null;

    return password.value === confirmPassword.value ? null : { passwordMismatch: true };
  }

  get password() {
    return this.restablecerForm.get('password');
  }

  get confirmPassword() {
    return this.restablecerForm.get('confirmPassword');
  }

  togglePasswordVisibility() {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPasswordVisibility() {
    this.showConfirmPassword.update(value => !value);
  }

  onSubmit() {
    if (this.restablecerForm.valid && this.tokenValido()) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');
      
      const password = this.restablecerForm.value.password;
      
      this.usuariosService.restablecerPassword(this.token, password).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.successMessage.set('¡Contraseña actualizada correctamente! Redirigiendo al login...');
          
          // Redirigir al login después de 3 segundos
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 3000);
        },
        error: (error) => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al restablecer la contraseña. El enlace puede haber expirado.');
        }
      });
    } else {
      Object.keys(this.restablecerForm.controls).forEach(key => {
        this.restablecerForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel() {
    this.router.navigate(['/login']);
  }
}
