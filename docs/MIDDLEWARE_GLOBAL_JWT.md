# Middleware Global JWT - Implementación Completa

## 📋 Descripción

Se ha implementado un **middleware global de autenticación JWT** que protege TODOS los endpoints de la API por defecto, excepto aquellos explícitamente marcados como públicos.

## 🔒 Arquitectura de Seguridad

### Principio: "Deny by Default"

- **Por defecto**: Todos los endpoints requieren un Bearer token JWT válido
- **Excepciones**: Solo los endpoints marcados con `@Public()` son accesibles sin autenticación

### Ventajas de este enfoque:

1. ✅ **Mayor seguridad**: No se pueden olvidar proteger endpoints nuevos
2. ✅ **Código más limpio**: No es necesario agregar `@UseGuards()` en cada método
3. ✅ **Fácil mantenimiento**: Las excepciones son explícitas y visibles
4. ✅ **Cumplimiento de estándares**: Sigue las mejores prácticas de seguridad

## 🛠️ Componentes Implementados

### 1. Decorador `@Public()`

**Archivo**: `backend/src/decorators/public.decorator.ts`

```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

**Uso**: Marcar endpoints que NO requieren autenticación

### 2. Guard Global JWT

**Archivo**: `backend/src/guards/jwt-auth.guard.ts`

```typescript
import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
}
```

**Características**:
- Verifica si el endpoint tiene el decorador `@Public()`
- Si es público, permite el acceso sin token
- Si no es público, valida el token JWT usando Passport

### 3. Configuración en AppModule

**Archivo**: `backend/src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri),
    AuthModule,
    UsuariosModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
```

**Efecto**: Aplica `JwtAuthGuard` de forma global a TODOS los endpoints

## 📝 Endpoints Públicos Configurados

Los siguientes endpoints están marcados con `@Public()` y NO requieren token:

### Autenticación
- `POST /api/usuarios/login` - Inicio de sesión
- `POST /api/usuarios/register` - Registro de usuarios
- `POST /api/usuarios/refresh` - Renovación de token

### Recuperación de Contraseña
- `POST /api/usuarios/recuperar-password` - Solicitar recuperación
- `GET /api/usuarios/verificar-token/:token` - Verificar token de recuperación
- `POST /api/usuarios/restablecer-password` - Restablecer contraseña

## 🔐 Endpoints Protegidos

Todos los demás endpoints requieren autenticación JWT automáticamente:

### Perfil de Usuario
- `GET /api/usuarios/perfil` - Obtener perfil del usuario autenticado

### Búsqueda (requieren token)
- `GET /api/usuarios/id/:id`
- `GET /api/usuarios/rut/:rut`
- `GET /api/usuarios/email/:email`

### Modificación (requieren token)
- `PUT /api/usuarios/id/:id`
- `PUT /api/usuarios/rut/:rut`
- `PUT /api/usuarios/email/:email`

### Administración (requieren token + rol admin)
- `GET /api/usuarios` - Listar todos los usuarios (AdminGuard)
- `DELETE /api/usuarios/id/:id` - Eliminar usuario (AdminGuard)
- `DELETE /api/usuarios/desactivar/:rut` - Desactivar cuenta (AdminGuard)

## 🧪 Pruebas Realizadas

### Test 1: Endpoint protegido sin token
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/perfil" -Method GET
```
**Resultado**: ✅ Status 401 Unauthorized (Rechazado correctamente)

### Test 2: Login público sin token
```powershell
$loginData = @{ email = "test@example.com"; password = "password" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" -Method POST -Body $loginData -ContentType "application/json"
```
**Resultado**: ✅ Retorna tokens JWT (Acceso permitido)

### Test 3: Endpoint protegido con token válido
```powershell
$headers = @{ Authorization = "Bearer $token" }
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/perfil" -Method GET -Headers $headers
```
**Resultado**: ✅ Retorna datos del usuario (Acceso permitido)

### Test 4: Register público sin token
```powershell
$registerData = @{ email = "new@example.com"; password = "Pass123#"; ... } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/register" -Method POST -Body $registerData -ContentType "application/json"
```
**Resultado**: ✅ Crea usuario o indica duplicado (Acceso permitido)

### Test 5: Recuperar password público sin token
```powershell
$data = @{ email = "test@example.com"; frontendUrl = "http://localhost:4200" } | ConvertTo-Json
Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/recuperar-password" -Method POST -Body $data -ContentType "application/json"
```
**Resultado**: ✅ Envía email de recuperación (Acceso permitido)

### Test 6: Otros endpoints GET sin token
```powershell
Invoke-WebRequest -Uri "http://localhost:3000/api/usuarios/id/123" -Method GET
```
**Resultado**: ✅ Status 401 Unauthorized (Rechazado correctamente)

## 📊 Resumen de Implementación

| Componente | Estado | Descripción |
|------------|--------|-------------|
| @Public() Decorator | ✅ Implementado | Marca rutas públicas |
| JwtAuthGuard Global | ✅ Implementado | Guard global con Reflector |
| APP_GUARD Provider | ✅ Configurado | Aplica guard a todos los endpoints |
| Endpoints Públicos | ✅ Marcados | Login, register, recovery |
| Endpoints Protegidos | ✅ Automático | Todos los demás requieren token |
| AdminGuard | ✅ Funcionando | Rutas de administración protegidas |
| Pruebas Completas | ✅ Pasadas | Todos los tests exitosos |

## 🎯 Flujo de Autenticación

```
┌─────────────────┐
│  Cliente hace   │
│   petición HTTP │
└────────┬────────┘
         │
         ▼
┌─────────────────────────┐
│  APP_GUARD (Global)     │
│  JwtAuthGuard ejecuta   │
└────────┬────────────────┘
         │
         ▼
    ¿Tiene @Public()?
         │
    ┌────┴────┐
    │         │
   SÍ        NO
    │         │
    │         ▼
    │    ¿Tiene Bearer token?
    │         │
    │    ┌────┴────┐
    │    │         │
    │   SÍ        NO
    │    │         │
    │    ▼         ▼
    │  ¿Token     401
    │  válido?    Unauthorized
    │    │
    │   SÍ
    │    │
    ▼────▼────────┐
│  ACCESO       │
│  PERMITIDO    │
└───────────────┘
```

## 🔑 Variables de Entorno Requeridas

```env
JWT_SECRET=tu_clave_secreta_muy_segura
JWT_EXPIRES_IN=1h
JWT_REFRESH_SECRET=tu_clave_refresh_muy_segura
JWT_REFRESH_EXPIRES_IN=7d
```

## 💡 Cómo Agregar Nuevos Endpoints

### Endpoint Protegido (Por defecto)
```typescript
@Get('mi-endpoint')
async miMetodo() {
  // Requiere token automáticamente
  return { mensaje: 'Protegido por JWT' };
}
```

### Endpoint Público
```typescript
@Public()
@Post('mi-endpoint-publico')
async miMetodoPublico() {
  // No requiere token
  return { mensaje: 'Acceso público' };
}
```

### Endpoint Solo Administradores
```typescript
@UseGuards(AdminGuard)
@Delete('mi-endpoint-admin')
async miMetodoAdmin() {
  // Requiere token + isAdmin: true
  return { mensaje: 'Solo administradores' };
}
```

## 🚀 Beneficios Implementados

1. **Seguridad por diseño**: Todos los nuevos endpoints son seguros por defecto
2. **Código más limpio**: Menos decoradores `@UseGuards()` repetidos
3. **Mantenimiento simplificado**: Las excepciones son explícitas
4. **Cumplimiento**: Sigue las mejores prácticas de NestJS
5. **Flexibilidad**: Fácil marcar excepciones con `@Public()`

## 📌 Notas Importantes

- ⚠️ **Nunca** olvides marcar con `@Public()` los endpoints que deben ser accesibles sin autenticación
- ⚠️ Los endpoints de administración siguen requiriendo `@UseGuards(AdminGuard)` además del JWT global
- ⚠️ El token JWT debe enviarse en el header: `Authorization: Bearer <token>`
- ⚠️ Los tokens expiran según la configuración en `.env`

## 🔄 Frontend Integration

El frontend ya tiene configurado un interceptor HTTP que automáticamente agrega el Bearer token a todas las peticiones (excepto las rutas públicas configuradas).

**Archivo**: `frontend/src/app/core/interceptors/auth.interceptor.ts`

Las rutas públicas en el frontend están sincronizadas con el backend:
- `/api/usuarios/login`
- `/api/usuarios/register`
- `/api/usuarios/recuperar-password`
- `/api/usuarios/verificar-token`
- `/api/usuarios/restablecer-password`

## ✅ Estado Final

**Middleware Global JWT**: ✅ Implementado y probado
**Seguridad**: ✅ Máxima - Deny by default
**Endpoints Públicos**: ✅ 6 endpoints marcados correctamente
**Endpoints Protegidos**: ✅ Todos los demás protegidos automáticamente
**Tests**: ✅ 6/6 pruebas pasadas exitosamente

---

**Fecha de implementación**: 10 de enero de 2026
**Versión NestJS**: 10.x
**Versión JWT**: 10.x
