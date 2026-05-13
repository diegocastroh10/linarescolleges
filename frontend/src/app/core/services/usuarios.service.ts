import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/usuarios';

  obtenerTodos(): Observable<{ mensaje: string; cantidad: number; usuarios: Usuario[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; usuarios: Usuario[] }>(this.API_URL);
  }

  buscarPorId(id: string): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.get<{ mensaje: string; usuario: Usuario }>(`${this.API_URL}/id/${id}`);
  }

  buscarPorRut(rut: string): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.get<{ mensaje: string; usuario: Usuario }>(`${this.API_URL}/rut/${rut}`);
  }

  buscarPorEmail(email: string): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.get<{ mensaje: string; usuario: Usuario }>(`${this.API_URL}/email/${email}`);
  }

  // Editar mi propio perfil (no requiere ID)
  editarMiPerfil(datos: Partial<Usuario>): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.put<{ mensaje: string; usuario: Usuario }>(`${this.API_URL}/mi-perfil`, datos);
  }

  editarPorId(id: string, datos: Partial<Usuario>): Observable<{ mensaje: string; usuario: Usuario }> {
    return this.http.put<{ mensaje: string; usuario: Usuario }>(`${this.API_URL}/id/${id}`, datos);
  }

  eliminarPorId(id: string, isAdmin: boolean): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_URL}/id/${id}`, {
      body: { isAdmin }
    });
  }

  // Solicitar recuperación de contraseña
  solicitarRecuperacionPassword(email: string): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.API_URL}/recuperar-password`, {
      email,
      frontendUrl: window.location.origin
    });
  }

  // Verificar token de recuperación
  verificarTokenRecuperacion(token: string): Observable<{ mensaje: string; valido: boolean }> {
    return this.http.get<{ mensaje: string; valido: boolean }>(`${this.API_URL}/verificar-token/${token}`);
  }

  // Restablecer contraseña con token
  restablecerPassword(token: string, password: string): Observable<{ mensaje: string }> {
    return this.http.post<{ mensaje: string }>(`${this.API_URL}/restablecer-password`, {
      token,
      password
    });
  }

  // Desactivar cuenta de usuario (solo superadmin)
  desactivarCuenta(rut: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_URL}/desactivar/${rut}`);
  }
}
