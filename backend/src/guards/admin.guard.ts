import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('No se encontró información del usuario');
    }

    if (!user.isAdmin) {
      throw new ForbiddenException('Acceso denegado. Se requieren permisos de administrador');
    }

    return true;
  }
}
