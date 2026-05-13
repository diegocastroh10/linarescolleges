import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Entrenamiento, EntrenamientoFormData, DiaSemana } from '../models/entrenamiento.model';

@Injectable({
  providedIn: 'root'
})
export class EntrenamientosService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/entrenamientos';

  // ==================== MÉTODOS PÚBLICOS (sin autenticación) ====================
  
  obtenerTodosPublico(): Observable<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }>(`${this.API_URL}/publico`);
  }

  obtenerPorDiaPublico(dia: DiaSemana): Observable<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }>(`${this.API_URL}/publico/dia/${dia}`);
  }

  // ==================== MÉTODOS PROTEGIDOS (requieren autenticación) ====================

  obtenerTodos(): Observable<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }>(this.API_URL);
  }

  obtenerPorDia(dia: DiaSemana): Observable<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; entrenamientos: Entrenamiento[] }>(`${this.API_URL}/dia/${dia}`);
  }

  obtenerPorId(id: string): Observable<{ mensaje: string; entrenamiento: Entrenamiento }> {
    return this.http.get<{ mensaje: string; entrenamiento: Entrenamiento }>(`${this.API_URL}/${id}`);
  }

  crear(datos: EntrenamientoFormData): Observable<{ mensaje: string; entrenamiento: Entrenamiento }> {
    return this.http.post<{ mensaje: string; entrenamiento: Entrenamiento }>(this.API_URL, datos);
  }

  actualizar(id: string, datos: Partial<EntrenamientoFormData>): Observable<{ mensaje: string; entrenamiento: Entrenamiento }> {
    return this.http.put<{ mensaje: string; entrenamiento: Entrenamiento }>(`${this.API_URL}/${id}`, datos);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_URL}/${id}`);
  }
}
