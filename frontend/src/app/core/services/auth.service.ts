import { Injectable, signal, computed, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { Usuario, LoginRequest, AuthResponse, UsuarioRegistro, RefreshTokenResponse, UserRole } from '../models/usuario.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  
  private readonly API_URL = 'http://localhost:3000/api/usuarios';
  private readonly TOKEN_KEY = 'accessToken';
  private readonly REFRESH_TOKEN_KEY = 'refreshToken';
  private readonly USER_KEY = 'currentUser';

  // Signals de Angular 18
  private currentUserSignal = signal<Usuario | null>(this.getUserFromStorage());
  private isLoadingSignal = signal<boolean>(false);

  // Computed signals
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => this.currentUserSignal() !== null && !!this.getToken());
  public isAdmin = computed(() => {
    const user = this.currentUserSignal();
    return user?.rol === UserRole.ADMINISTRADOR || user?.rol === UserRole.SUPERADMIN;
  });
  public isSuperAdmin = computed(() => this.currentUserSignal()?.rol === UserRole.SUPERADMIN);
  public isPersona = computed(() => this.currentUserSignal()?.rol === UserRole.PERSONA);
  public isLoading = this.isLoadingSignal.asReadonly();

  constructor() {
    // Cargar usuario del localStorage al iniciar
    const user = this.getUserFromStorage();
    if (user) {
      this.currentUserSignal.set(user);
    }
  }

  login(credentials: LoginRequest): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      tap({
        next: (response) => {
          this.setAuthData(response.usuario, response.accessToken, response.refreshToken);
          this.isLoadingSignal.set(false);
        },
        error: () => {
          this.isLoadingSignal.set(false);
        }
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  register(userData: UsuarioRegistro): Observable<AuthResponse> {
    this.isLoadingSignal.set(true);
    return this.http.post<AuthResponse>(`${this.API_URL}/register`, userData).pipe(
      tap({
        next: (response) => {
          // El register no devuelve tokens, solo crea el usuario
          this.isLoadingSignal.set(false);
        },
        error: () => {
          this.isLoadingSignal.set(false);
        }
      }),
      catchError(error => {
        this.isLoadingSignal.set(false);
        return throwError(() => error);
      })
    );
  }

  refreshToken(): Observable<RefreshTokenResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token available'));
    }

    return this.http.post<RefreshTokenResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      tap(response => {
        this.setToken(response.accessToken);
      }),
      catchError(error => {
        this.logout();
        return throwError(() => error);
      })
    );
  }

  logout(): void {
    this.currentUserSignal.set(null);
    this.clearAuthData();
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.TOKEN_KEY);
    }
    return null;
  }

  getRefreshToken(): string | null {
    if (typeof window !== 'undefined' && localStorage) {
      return localStorage.getItem(this.REFRESH_TOKEN_KEY);
    }
    return null;
  }

  private setToken(token: string): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.TOKEN_KEY, token);
    }
  }

  private setAuthData(user: Usuario, accessToken: string, refreshToken: string): void {
    this.currentUserSignal.set(user);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
      localStorage.setItem(this.TOKEN_KEY, accessToken);
      localStorage.setItem(this.REFRESH_TOKEN_KEY, refreshToken);
    }
  }

  private clearAuthData(): void {
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.removeItem(this.USER_KEY);
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    }
  }

  private getUserFromStorage(): Usuario | null {
    if (typeof window !== 'undefined' && localStorage) {
      const userJson = localStorage.getItem(this.USER_KEY);
      if (userJson) {
        try {
          return JSON.parse(userJson);
        } catch (error) {
          console.error('Error parsing user from storage', error);
          return null;
        }
      }
    }
    return null;
  }

  updateCurrentUser(user: Usuario): void {
    this.currentUserSignal.set(user);
    if (typeof window !== 'undefined' && localStorage) {
      localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    }
  }

  // Alias para updateCurrentUser
  setUser(user: Usuario): void {
    this.updateCurrentUser(user);
  }
}
