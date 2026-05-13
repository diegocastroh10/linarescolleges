import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Noticia } from '../models/noticia.model';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {
  private http = inject(HttpClient);
  private readonly API_URL = 'http://localhost:3000/api/noticias';

  // Endpoints públicos
  obtenerPublicadas(): Observable<{ mensaje: string; cantidad: number; noticias: Noticia[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; noticias: Noticia[] }>(`${this.API_URL}/publicas`);
  }

  obtenerUltimas(limite: number): Observable<{ mensaje: string; cantidad: number; noticias: Noticia[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; noticias: Noticia[] }>(`${this.API_URL}/ultimas/${limite}`);
  }

  obtenerNoticiaPublica(id: string): Observable<{ mensaje: string; noticia: Noticia }> {
    return this.http.get<{ mensaje: string; noticia: Noticia }>(`${this.API_URL}/publica/${id}`);
  }

  // Endpoints protegidos (admin/superadmin)
  obtenerTodas(): Observable<{ mensaje: string; cantidad: number; noticias: Noticia[] }> {
    return this.http.get<{ mensaje: string; cantidad: number; noticias: Noticia[] }>(this.API_URL);
  }

  obtenerPorId(id: string): Observable<{ mensaje: string; noticia: Noticia }> {
    return this.http.get<{ mensaje: string; noticia: Noticia }>(`${this.API_URL}/${id}`);
  }

  crear(noticia: Partial<Noticia>): Observable<{ mensaje: string; noticia: Noticia }> {
    return this.http.post<{ mensaje: string; noticia: Noticia }>(this.API_URL, noticia);
  }

  actualizar(id: string, noticia: Partial<Noticia>): Observable<{ mensaje: string; noticia: Noticia }> {
    return this.http.put<{ mensaje: string; noticia: Noticia }>(`${this.API_URL}/${id}`, noticia);
  }

  eliminar(id: string): Observable<{ mensaje: string }> {
    return this.http.delete<{ mensaje: string }>(`${this.API_URL}/${id}`);
  }

  alternarPublicacion(id: string): Observable<{ mensaje: string; noticia: Noticia }> {
    return this.http.put<{ mensaje: string; noticia: Noticia }>(`${this.API_URL}/${id}/publicar`, {});
  }
}
