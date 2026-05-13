# GUÍA: CRUD DE USUARIOS (SUPERADMIN)

## Descripción General

El panel de gestión de usuarios permite al **superadmin** buscar, editar, asignar roles y desactivar usuarios del sistema.

## Acceso al Panel

1. Iniciar sesión con una cuenta de **superadmin**
   - Email: `diegocastroh10@hotmail.com`
   - Password: `D1eg0#`

2. Click en el botón **"Panel Admin"** en la navbar (botón morado)

3. En el sidebar lateral, click en **"CRUD Usuarios"**
   - ⚠️ Este botón solo es visible para usuarios con rol **superadmin**

## Funcionalidades

### 1. Búsqueda de Usuarios

**Métodos de búsqueda:**
- Por RUT (sin dígito verificador): `11111111` o `11111111-1`
- Por Email: `persona@test.com`

**Cómo buscar:**
1. Escribe el RUT o email en el campo de búsqueda
2. Presiona Enter o click en el botón **"Buscar"**
3. El sistema mostrará el usuario encontrado con toda su información

**Información mostrada:**
- Avatar con inicial del nombre
- Nombre completo
- Email
- Rol actual (badge con color)
- RUT
- Nombre de usuario
- Teléfono
- Posición
- Dirección

### 2. Editar Usuario

**Pasos:**
1. Buscar el usuario
2. Click en el botón **"Editar"** (icono de lápiz, color morado)
3. Se abrirá la página de edición con formulario completo

**Campos editables:**
- Nombre Completo *
- Nombre de Usuario *
- RUT *
- Fecha de Nacimiento
- Email *
- Teléfono *
- Dirección *
- Posición *
- Nombre del Apoderado
- Teléfono del Apoderado

**Notas:**
- Los campos marcados con * son obligatorios
- El rol NO se edita desde esta página (usar "Asignar Rol")
- Los cambios se guardan en la base de datos
- Después de guardar, regresa al panel de usuarios

### 3. Asignar Rol

**Pasos:**
1. Buscar el usuario
2. Click en el botón **"Asignar Rol"** (icono de persona con badge, color rosa)
3. Se abre un modal con un dropdown de roles

**Roles disponibles:**
- `persona` - Usuario regular del club
- `administrador` - Puede administrar contenido (noticias, imágenes, entrenamientos)
- `superadmin` - Acceso total al sistema incluyendo gestión de usuarios

**Cómo asignar:**
1. Seleccionar el nuevo rol del dropdown
2. Click en **"Guardar"**
3. El sistema actualiza el rol inmediatamente
4. La tarjeta del usuario se actualiza con el nuevo rol

**Permisos por rol:**
- **persona**: Solo puede ver su perfil y contenido público
- **administrador**: Puede ver/editar noticias, imágenes, entrenamientos y ver listado de usuarios
- **superadmin**: Acceso total + gestión de usuarios (editar, cambiar rol, desactivar)

### 4. Desactivar Usuario

⚠️ **ACCIÓN IRREVERSIBLE**

**Pasos:**
1. Buscar el usuario
2. Click en el botón **"Desactivar"** (icono de persona con X, color naranja/amarillo)
3. Se abre un modal de confirmación

**Confirmación:**
- El modal muestra el nombre del usuario
- Advertencia: "Esta acción no se puede deshacer"
- Opciones: **"No"** (cancelar) o **"Sí, Desactivar"** (confirmar)

**Efecto:**
- El usuario queda desactivado en la base de datos
- No podrá iniciar sesión
- Sus datos permanecen en el sistema

### 5. Limpiar Búsqueda

Después de buscar un usuario, aparece un botón **"Limpiar"** que permite:
- Borrar el término de búsqueda
- Ocultar la tarjeta del usuario
- Realizar una nueva búsqueda

## Interfaz de Usuario

### Colores y Diseño

**Botones de acción:**
- **Editar**: Gradiente morado (667eea → 764ba2)
- **Asignar Rol**: Gradiente rosa (f093fb → f5576c)
- **Desactivar**: Gradiente naranja/amarillo (fa709a → fee140)

**Badges de roles:**
- **superadmin**: Verde (bg-success)
- **administrador**: Azul (bg-primary)
- **persona**: Gris (bg-secondary)

**Encabezado de tarjeta:**
- Gradiente morado con avatar circular
- Información del usuario en blanco

### Modales

**Características:**
- Fondo oscuro semi-transparente
- Animaciones de entrada (fade in + slide up)
- Botón de cerrar en esquina superior derecha
- Acciones en pie del modal (Cancelar/Guardar)

## Endpoints del Backend

### Búsqueda
- `GET /api/usuarios/rut/:rut` - Buscar por RUT
- `GET /api/usuarios/email/:email` - Buscar por email
- `GET /api/usuarios/id/:id` - Buscar por ID

### Actualización
- `PUT /api/usuarios/id/:id` - Actualizar datos y/o rol

### Desactivación
- `DELETE /api/usuarios/desactivar/:rut` - Desactivar cuenta

**Autenticación:**
Todos los endpoints requieren:
- Header: `Authorization: Bearer <access_token>`
- Rol: **superadmin**

## Validaciones

### Frontend
- Campos obligatorios marcados con asterisco
- Validación de formato de email
- Feedback visual con clases `is-invalid`
- Spinners de carga durante operaciones

### Backend
- JWT válido requerido
- Verificación de rol superadmin
- Validación de datos de entrada
- Manejo de errores con HttpException

## Pruebas

### Script de Pruebas
Ubicación: `test-crud-usuarios.ps1`

**Ejecutar:**
```powershell
.\test-crud-usuarios.ps1
```

**Pruebas incluidas:**
1. Login como superadmin
2. Búsqueda por RUT
3. Búsqueda por email
4. Actualización de rol (persona → administrador)
5. Verificación del cambio
6. Reversión del rol (administrador → persona)
7. Actualización de datos personales

**Resultado esperado:**
```
OK Busqueda por RUT funcional
OK Busqueda por Email funcional
OK Actualizacion de rol funcional
OK Actualizacion de datos funcional
TODAS LAS PRUEBAS COMPLETADAS
```

## Flujo de Trabajo Típico

### Asignar un usuario como administrador:
1. Login como superadmin
2. Ir a "Panel Admin" → "CRUD Usuarios"
3. Buscar usuario por email: `usuario@example.com`
4. Click en "Asignar Rol"
5. Seleccionar "administrador"
6. Guardar
7. Usuario ahora puede administrar contenido

### Actualizar información de un jugador:
1. Login como superadmin
2. Ir a "Panel Admin" → "CRUD Usuarios"
3. Buscar usuario por RUT: `12345678`
4. Click en "Editar"
5. Actualizar campos (teléfono, dirección, posición, etc.)
6. Guardar cambios
7. Usuario actualizado en el sistema

### Desactivar un usuario inactivo:
1. Login como superadmin
2. Ir a "Panel Admin" → "CRUD Usuarios"
3. Buscar usuario por email
4. Click en "Desactivar"
5. Confirmar acción en modal
6. Usuario desactivado (no puede hacer login)

## Tecnologías Utilizadas

### Frontend
- Angular 18.2.21
- Angular Signals para estado reactivo
- Reactive Forms para validación
- Bootstrap 5 para estilos
- Bootstrap Icons para iconografía

### Backend
- NestJS
- MongoDB con Mongoose
- JWT para autenticación
- Guards para autorización por rol

## Seguridad

✅ **Medidas implementadas:**
- Autenticación JWT obligatoria
- Guard de rol superadmin en todos los endpoints
- Validación de datos en frontend y backend
- Confirmación para acciones destructivas
- Tokens con expiración (1 hora access token)

❌ **No permitido:**
- Administradores NO pueden acceder al CRUD de usuarios
- Personas NO ven el botón "Panel Admin"
- Usuarios sin token válido reciben 401 Unauthorized
- Usuarios sin rol correcto reciben 403 Forbidden

## Troubleshooting

### Usuario no encontrado
**Causa**: RUT o email incorrecto
**Solución**: Verificar que el dato sea exacto (con o sin guión en RUT)

### Error 401 Unauthorized
**Causa**: Token expirado o inválido
**Solución**: Hacer logout y login nuevamente

### Error 403 Forbidden
**Causa**: Usuario no tiene rol superadmin
**Solución**: Solo superadmins pueden acceder a este panel

### Botón "CRUD Usuarios" no visible
**Causa**: Usuario no es superadmin
**Solución**: Verificar rol del usuario en base de datos

### Modal no se cierra
**Causa**: JavaScript bloqueado o error de rendering
**Solución**: Refrescar página (F5) o verificar consola del navegador

## Archivos Relacionados

### Frontend
- `frontend/src/app/pages/admin/crud-usuarios/crud-usuarios.component.ts`
- `frontend/src/app/pages/admin/crud-usuarios/crud-usuarios.component.html`
- `frontend/src/app/pages/admin/crud-usuarios/crud-usuarios.component.scss`
- `frontend/src/app/pages/admin/editar-usuario/editar-usuario.component.ts`
- `frontend/src/app/pages/admin/editar-usuario/editar-usuario.component.html`
- `frontend/src/app/pages/admin/editar-usuario/editar-usuario.component.scss`
- `frontend/src/app/core/services/usuarios.service.ts`
- `frontend/src/app/core/guards/superadmin.guard.ts`

### Backend
- `backend/src/controllers/usuarios.controller.ts`
- `backend/src/services/usuarios.service.ts`
- `backend/src/guards/roles.guard.ts`
- `backend/src/decorators/roles.decorator.ts`
- `backend/src/enums/roles.enum.ts`

### Configuración
- `frontend/src/app/app.routes.ts` - Rutas con guards
- `frontend/src/index.html` - Bootstrap Icons CDN

---

**Última actualización**: Implementación completada y probada
**Versión**: 1.0.0
**Estado**: ✅ Funcional y probado
