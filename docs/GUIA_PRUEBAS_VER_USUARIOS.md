# GUÍA DE PRUEBAS: VER USUARIOS (ADMINISTRADOR)

## Descripción

El componente **Ver Usuarios** permite a los **administradores** buscar y visualizar información de usuarios del sistema sin poder editarlos. Es la versión de solo lectura del CRUD de usuarios.

## Diferencias con CRUD Usuarios (Superadmin)

| Característica | Ver Usuarios (Admin) | CRUD Usuarios (Superadmin) |
|----------------|---------------------|----------------------------|
| Búsqueda | ✅ Sí | ✅ Sí |
| Visualización | ✅ Sí | ✅ Sí |
| Editar | ❌ No | ✅ Sí |
| Asignar Rol | ❌ No | ✅ Sí |
| Desactivar | ❌ No | ✅ Sí |
| Acceso | Administrador + Superadmin | Solo Superadmin |

## Acceso al Componente

### Como Administrador:
1. Login con cuenta de administrador:
   - Email: `clublinarescolleges@gmail.com`
   - Password: `Admin2024#`

2. Click en **"Panel Admin"** (botón morado en navbar)

3. En el sidebar, click en **"Ver Usuarios"**
   - ✅ Visible para administradores
   - ✅ Visible para superadmins

### Como Superadmin:
1. Login: `diegocastroh10@hotmail.com` / `D1eg0#`
2. Panel Admin → Ver Usuarios

## Funcionalidad de Búsqueda

### Métodos de búsqueda:
- ✅ Por RUT con guión: `19133754-9`
- ✅ Por RUT sin guión: `19133754`
- ✅ Por email: `persona@test.com`

### Proceso:
1. Escribir RUT o email en el campo de búsqueda
2. Presionar **Enter** o click en **"Buscar"**
3. Sistema muestra tarjeta con información del usuario

### Información mostrada:
- Avatar con inicial del nombre
- Nombre completo
- Email
- Badge de rol (persona/administrador/superadmin)
- RUT
- Nombre de usuario
- Teléfono
- Posición
- Dirección
- Nombre del apoderado (si existe)
- Teléfono del apoderado (si existe)
- Fecha de nacimiento (si existe)
- Fecha de registro

### Mensaje informativo:
Al final de la tarjeta aparece:
> ℹ️ Solo el superadmin puede editar o modificar usuarios

## Pruebas Manuales

### Preparación:
1. Verificar servidores activos:
   - Backend: http://localhost:3000 ✅
   - Frontend: http://localhost:4200 ✅

### Prueba 1: Acceso como Administrador
**Login**: `clublinarescolleges@gmail.com` / `Admin2024#`

**Pasos**:
1. Login exitoso
2. Click en "Panel Admin"
3. Verificar que aparece "Ver Usuarios" en sidebar
4. Click en "Ver Usuarios"

**Resultado esperado**:
- ✅ Carga la página de Ver Usuarios
- ✅ Header con gradiente cyan/morado
- ✅ Campo de búsqueda visible
- ✅ Placeholder: "Buscar por RUT (ej: 19133754-9) o email..."

### Prueba 2: Búsqueda por RUT con guión
**Input**: `19133754-9`

**Resultado esperado**:
- ✅ Spinner de carga aparece
- ✅ Tarjeta muestra "Diego Castro Herrera"
- ✅ Avatar con "D"
- ✅ Badge verde: superadmin
- ✅ Todos los detalles visibles
- ✅ Mensaje informativo al final
- ✅ NO hay botones de acción (editar, rol, desactivar)

### Prueba 3: Búsqueda por email
**Input**: `persona@test.com`

**Resultado esperado**:
- ✅ Muestra "Usuario Persona"
- ✅ Badge gris: persona
- ✅ RUT: 11111111-1
- ✅ Información completa visible

### Prueba 4: Usuario no encontrado
**Input**: `99999999-9`

**Resultado esperado**:
- ✅ Alerta roja: "Usuario no encontrado"
- ✅ No muestra tarjeta

### Prueba 5: Campo vacío
**Acción**: Click en "Buscar" sin escribir nada

**Resultado esperado**:
- ✅ Alerta roja: "Ingresa un RUT o email para buscar"

### Prueba 6: Botón Limpiar
1. Buscar usuario válido: `12345678-9`
2. Click en **"Limpiar"**

**Resultado esperado**:
- ✅ Campo se vacía
- ✅ Tarjeta desaparece
- ✅ No hay errores visibles

### Prueba 7: Búsqueda con Enter
**Input**: `11111111-1` + **Enter**

**Resultado esperado**:
- ✅ Ejecuta búsqueda sin click en botón
- ✅ Muestra resultados

### Prueba 8: Información de apoderado
**Input**: `12345678-9` (Juan José Pérez tiene apoderado)

**Resultado esperado**:
- ✅ Si tiene apoderado, muestra nombre y teléfono
- ✅ Si no tiene, no muestra esas filas

### Prueba 9: Fecha de nacimiento
**Input**: Usuario con fecha de nacimiento registrada

**Resultado esperado**:
- ✅ Muestra fecha en formato: dd/MM/yyyy
- ✅ Si no tiene, no muestra la fila

### Prueba 10: Fecha de registro
**Input**: Cualquier usuario

**Resultado esperado**:
- ✅ Siempre muestra fecha de creación
- ✅ Formato: dd/MM/yyyy HH:mm

## RUTs para Pruebas

```
19133754-9  → Diego Castro Herrera (superadmin)
12345678-9  → Juan José Pérez (persona)
65082894-1  → Club Deportivo Linares Colleges (administrador)
11111111-1  → Usuario Persona (persona)
22222222-2  → Administrador General (persona)
```

## Emails para Pruebas

```
diegocastroh10@hotmail.com      → Diego Castro Herrera
jugador@test.cl                 → Juan José Pérez
clublinarescolleges@gmail.com   → Club Deportivo Linares Colleges
persona@test.com                → Usuario Persona
admin@linarescolleges.cl        → Administrador General
```

## Diseño Visual

### Colores:
- **Header**: Gradiente cyan a morado (#30cfd0 → #330867)
- **Avatar**: Fondo semi-transparente blanco con borde
- **Badges**:
  - Superadmin: Verde (bg-success)
  - Administrador: Azul (bg-primary)
  - Persona: Gris (bg-secondary)
- **Footer**: Fondo gris claro (#f8f9fa)
- **Mensaje info**: Icono cyan (#0dcaf0)

### Animaciones:
- ✅ fadeIn al mostrar tarjeta (0.3s)
- ✅ Spinner de carga en botón

### Responsive:
- ✅ Desktop: Grid de 2 columnas para detalles
- ✅ Móvil: Columna única, avatar centrado

## Comparación Visual

### Ver Usuarios (Admin):
```
┌─────────────────────────────────┐
│  Header Cyan/Morado             │
├─────────────────────────────────┤
│  [Input de búsqueda] [Buscar]   │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ Avatar | Nombre           │  │
│  │        | Email            │  │
│  │        | Badge Rol        │  │
│  ├───────────────────────────┤  │
│  │ RUT: ...                  │  │
│  │ Usuario: ...              │  │
│  │ Teléfono: ...             │  │
│  │ ... más detalles ...      │  │
│  ├───────────────────────────┤  │
│  │ ℹ️ Solo superadmin puede  │  │
│  │   editar usuarios         │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

### CRUD Usuarios (Superadmin):
```
┌─────────────────────────────────┐
│  Header Morado                  │
├─────────────────────────────────┤
│  [Input de búsqueda] [Buscar]   │
├─────────────────────────────────┤
│  ┌───────────────────────────┐  │
│  │ Avatar | Nombre           │  │
│  │        | Email            │  │
│  │        | Badge Rol        │  │
│  ├───────────────────────────┤  │
│  │ ... detalles ...          │  │
│  ├───────────────────────────┤  │
│  │ [Editar] [Asignar Rol]    │  │
│  │          [Desactivar]     │  │
│  └───────────────────────────┘  │
└─────────────────────────────────┘
```

## Restricciones de Seguridad

### Administrador NO puede:
- ❌ Editar información de usuarios
- ❌ Cambiar roles de usuarios
- ❌ Desactivar usuarios
- ❌ Acceder a CRUD Usuarios (solo Ver Usuarios)

### Administrador SÍ puede:
- ✅ Buscar usuarios por RUT o email
- ✅ Ver información completa de usuarios
- ✅ Ver roles de otros usuarios
- ✅ Gestionar noticias, imágenes, entrenamientos

## Tecnología

### Frontend:
- Angular 18.2.21
- Signals para estado reactivo
- FormsModule para ngModel
- CommonModule para directivas
- Bootstrap 5 + Bootstrap Icons

### Lógica:
```typescript
// Detección de RUT vs Email
const esRut = /^\d+(-\d)?$/.test(termino);

// Búsqueda condicional
const observable = esRut 
  ? this.usuariosService.buscarPorRut(termino)
  : this.usuariosService.buscarPorEmail(termino);
```

## Archivos Modificados

```
frontend/src/app/pages/admin/ver-usuarios/
├── ver-usuarios.component.ts    (Lógica de búsqueda)
├── ver-usuarios.component.html  (Template con búsqueda y tarjeta)
└── ver-usuarios.component.scss  (Estilos cyan/morado)
```

## Checklist de Validación

- [ ] Login como administrador funciona
- [ ] Botón "Ver Usuarios" visible en sidebar
- [ ] Página carga correctamente
- [ ] Búsqueda por RUT con guión funciona
- [ ] Búsqueda por email funciona
- [ ] Usuario no encontrado muestra error
- [ ] Campo vacío muestra error
- [ ] Botón Limpiar funciona
- [ ] Búsqueda con Enter funciona
- [ ] Tarjeta muestra toda la información
- [ ] Avatar con inicial correcta
- [ ] Badges con colores correctos
- [ ] Mensaje informativo visible
- [ ] NO hay botones de acción
- [ ] Responsive funciona en móvil
- [ ] Fechas se formatean correctamente
- [ ] Campos opcionales solo aparecen si existen

## Comandos Útiles

### Verificar servidores:
```powershell
Test-NetConnection localhost -Port 3000
Test-NetConnection localhost -Port 4200
```

### Ver errores del frontend:
```powershell
# En la consola del navegador (F12)
# Revisar tab "Console" y "Network"
```

## Estado

✅ **Implementación**: COMPLETADA  
✅ **Backend**: FUNCIONAL (usa mismos endpoints que CRUD)  
✅ **Frontend**: LISTO PARA PROBAR  
📝 **Pendiente**: Pruebas manuales en navegador

---

**Fecha**: 10 de enero de 2026  
**Componente**: Ver Usuarios (solo lectura)  
**Acceso**: Administrador + Superadmin  
**Funcionalidad**: Búsqueda y visualización de usuarios
