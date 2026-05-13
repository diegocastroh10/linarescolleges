import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  registerForm: FormGroup;
  errorMessage = signal<string>('');
  successMessage = signal<string>('');
  isLoading = signal<boolean>(false);
  showPassword = signal<boolean>(false);

  posiciones = [
    { value: 'Base', label: 'Base' },
    { value: 'Escolta', label: 'Escolta' },
    { value: 'Alero', label: 'Alero' },
    { value: 'Ala-Pivot', label: 'Ala-Pivot' },
    { value: 'Pivot', label: 'Pivot' },
    { value: 'Hincha', label: 'Hincha' },
    { value: 'Cuerpo técnico', label: 'Cuerpo técnico' }
  ];

  codigosPais = [
    { value: '+56', label: '+56 (Chile)', flag: '🇨🇱' },
    { value: '+54', label: '+54 (Argentina)', flag: '🇦🇷' },
    { value: '+51', label: '+51 (Perú)', flag: '🇵🇪' },
    { value: '+1', label: '+1 (USA)', flag: '🇺🇸' },
    { value: '+34', label: '+34 (España)', flag: '🇪🇸' }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#.])[A-Za-z\d@$!%*?&#.]{6,}$/)
      ]],
      nombrePersonal: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
      ]],
      nombreUsuario: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(20),
        Validators.pattern(/^[a-zA-Z0-9_]+$/)
      ]],
      rut: ['', [
        Validators.required,
        this.rutValidator
      ]],
      codigoPais: ['+56', Validators.required],
      telefono: ['', [
        Validators.required,
        Validators.pattern(/^[0-9]{8,15}$/)
      ]],
      posicion: ['', Validators.required],
      direccion: ['', [
        Validators.required,
        Validators.minLength(10)
      ]],
      fechaNacimiento: ['', [
        Validators.required,
        this.fechaNacimientoValidator
      ]],
      nombreApoderado: [''],
      codigoPaisApoderado: ['+56'],
      telefonoApoderado: ['', [
        Validators.pattern(/^[0-9]{8,15}$/)
      ]]
    });
  }

  get email() { return this.registerForm.get('email'); }
  get password() { return this.registerForm.get('password'); }
  get nombrePersonal() { return this.registerForm.get('nombrePersonal'); }
  get nombreUsuario() { return this.registerForm.get('nombreUsuario'); }
  get rut() { return this.registerForm.get('rut'); }
  get telefono() { return this.registerForm.get('telefono'); }
  get posicion() { return this.registerForm.get('posicion'); }
  get direccion() { return this.registerForm.get('direccion'); }
  get fechaNacimiento() { return this.registerForm.get('fechaNacimiento'); }
  get nombreApoderado() { return this.registerForm.get('nombreApoderado'); }
  get telefonoApoderado() { return this.registerForm.get('telefonoApoderado'); }

  togglePasswordVisibility() {
    this.showPassword.set(!this.showPassword());
  }

  // Validador personalizado para RUT chileno
  rutValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const rut = control.value.replace(/\./g, '');
    const rutPattern = /^(\d{7,8})-([0-9kK])$/;
    
    if (!rutPattern.test(rut)) {
      return { rutInvalido: true };
    }

    const [numero, dv] = rut.split('-');
    let suma = 0;
    let multiplicador = 2;

    for (let i = numero.length - 1; i >= 0; i--) {
      suma += parseInt(numero.charAt(i)) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const dvCalculado = 11 - (suma % 11);
    const dvEsperado = dvCalculado === 11 ? '0' : dvCalculado === 10 ? 'k' : dvCalculado.toString();

    if (dv.toLowerCase() !== dvEsperado) {
      return { rutInvalido: true };
    }

    return null;
  }

  // Validador personalizado para fecha de nacimiento
  fechaNacimientoValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const fecha = new Date(control.value);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();

    if (fecha > hoy) {
      return { fechaFutura: true };
    }

    if (edad > 100) {
      return { fechaMuyAntigua: true };
    }

    return null;
  }

  formatRut(event: any) {
    let rut = event.target.value.replace(/[^0-9kK]/g, '');
    
    if (rut.length > 1) {
      const cuerpo = rut.slice(0, -1);
      const dv = rut.slice(-1);
      rut = `${cuerpo}-${dv}`;
    }
    
    this.registerForm.patchValue({ rut }, { emitEvent: false });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set('');
      this.successMessage.set('');

      const formData = this.registerForm.value;
      
      // Combinar código de país con teléfono
      const telefonoCompleto = `${formData.codigoPais} ${formData.telefono}`;
      const telefonoApoderadoCompleto = formData.telefonoApoderado 
        ? `${formData.codigoPaisApoderado} ${formData.telefonoApoderado}`
        : undefined;

      // Enviar fecha en formato ISO (YYYY-MM-DD) directamente desde el input type="date"
      // El input date ya devuelve el valor en formato ISO, no necesitamos convertirlo
      const registroData = {
        email: formData.email,
        password: formData.password,
        nombrePersonal: formData.nombrePersonal,
        nombreUsuario: formData.nombreUsuario,
        rut: formData.rut,
        telefono: telefonoCompleto,
        posicion: formData.posicion,
        direccion: formData.direccion,
        fechaNacimiento: formData.fechaNacimiento, // Ya está en formato YYYY-MM-DD
        nombreApoderado: formData.nombreApoderado || undefined,
        telefonoApoderado: telefonoApoderadoCompleto
      };

      this.authService.register(registroData).subscribe({
        next: (response) => {
          this.isLoading.set(false);
          this.successMessage.set('¡Registro exitoso! Redirigiendo al inicio...');
          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 2000);
        },
        error: (error) => {
          this.isLoading.set(false);
          if (error.error?.message) {
            this.errorMessage.set(error.error.message);
          } else if (error.error?.error) {
            this.errorMessage.set(error.error.error);
          } else {
            this.errorMessage.set('Error al registrar. Por favor verifica los datos e intenta nuevamente.');
          }
        }
      });
    } else {
      this.markFormGroupTouched(this.registerForm);
      this.errorMessage.set('Por favor completa todos los campos requeridos correctamente.');
    }
  }

  private markFormGroupTouched(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
}

