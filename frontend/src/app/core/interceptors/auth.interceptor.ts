import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const token = authService.getToken();

  console.log('=== AUTH INTERCEPTOR ===');
  console.log('URL:', req.url);
  console.log('Token disponible:', token ? 'SÍ' : 'NO');

  // No agregar token a las rutas públicas
  const publicRoutes = ['/login', '/register', '/recuperar-password', '/restablecer-password', '/verificar-token'];
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));

  console.log('Es ruta pública:', isPublicRoute);

  if (token && !isPublicRoute) {
    console.log('Agregando token al header Authorization');
    const clonedRequest = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    return next(clonedRequest);
  }

  console.log('NO se agregó token al request');
  return next(req);
};
