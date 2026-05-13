# PRUEBAS DE BÚSQUEDA DE USUARIOS - PANEL SUPERADMIN

## Problema Corregido

**Problema original**: La búsqueda de usuarios no funcionaba porque:
- La regex solo detectaba números sin guión: `/^\d+$/`
- Los RUTs en la base de datos tienen formato completo: `19133754-9`
- Al buscar con guión, el sistema lo interpretaba como email (no encontrado)

**Solución implementada**:
- Nueva regex: `/^\d+(-\d)?$/` que detecta RUT con o sin guión
- Búsqueda acepta formatos: `19133754-9` o `19133754`
- Actualizado placeholder con ejemplo claro

## Pruebas Backend (Automáticas)

✅ **Script ejecutado**: `test-busqueda-usuarios.ps1`

**Resultados**:
```
✅ RUT 19133754-9 → Diego Castro Herrera (superadmin)
✅ RUT 12345678-9 → Juan José Pérez (persona)
✅ RUT 11111111-1 → Usuario Persona (persona)
✅ Email clublinarescolleges@gmail.com → Club Deportivo Linares Colleges (administrador)
✅ Email persona@test.com → Usuario Persona (persona)

TODAS LAS BÚSQUEDAS FUNCIONAN CORRECTAMENTE ✅
```

## Pruebas Frontend (Manual)

### Preparación:
1. Asegurar que ambos servidores estén corriendo:
   - Backend: http://localhost:3000
   - Frontend: http://localhost:4200

2. Abrir navegador en: http://localhost:4200

3. Login como superadmin:
   - Email: `diegocastroh10@hotmail.com`
   - Password: `D1eg0#`

4. Click en botón **"Panel Admin"** (morado)

5. Click en **"CRUD Usuarios"** en el sidebar

### Prueba 1: Búsqueda por RUT con guión
**Input**: `19133754-9`

**Resultado esperado**:
- ✅ Muestra tarjeta con avatar "D"
- ✅ Nombre: Diego Castro Herrera
- ✅ Email: diegocastroh10@hotmail.com
- ✅ Badge verde: superadmin
- ✅ RUT: 19133754-9
- ✅ Botones de acción visibles

### Prueba 2: Búsqueda por RUT (otro usuario)
**Input**: `12345678-9`

**Resultado esperado**:
- ✅ Muestra tarjeta con avatar "J"
- ✅ Nombre: Juan José Pérez
- ✅ Email: jugador@test.cl
- ✅ Badge gris: persona
- ✅ RUT: 12345678-9

### Prueba 3: Búsqueda por RUT (tercer usuario)
**Input**: `11111111-1`

**Resultado esperado**:
- ✅ Muestra tarjeta con avatar "U"
- ✅ Nombre: Usuario Persona
- ✅ Email: persona@test.com
- ✅ Badge gris: persona
- ✅ RUT: 11111111-1

### Prueba 4: Búsqueda por email
**Input**: `clublinarescolleges@gmail.com`

**Resultado esperado**:
- ✅ Muestra tarjeta con avatar "C"
- ✅ Nombre: Club Deportivo Linares Colleges
- ✅ Email: clublinarescolleges@gmail.com
- ✅ Badge azul: administrador
- ✅ RUT: 65082894-1

### Prueba 5: Búsqueda por email (otro)
**Input**: `persona@test.com`

**Resultado esperado**:
- ✅ Muestra tarjeta con avatar "U"
- ✅ Nombre: Usuario Persona
- ✅ Badge gris: persona

### Prueba 6: Búsqueda inválida
**Input**: `99999999-9` (RUT que no existe)

**Resultado esperado**:
- ✅ Alerta roja: "Usuario no encontrado"
- ✅ No muestra tarjeta de usuario

### Prueba 7: Email inexistente
**Input**: `noexiste@test.com`

**Resultado esperado**:
- ✅ Alerta roja: "Usuario no encontrado"

### Prueba 8: Campo vacío
**Input**: (dejar vacío y presionar buscar)

**Resultado esperado**:
- ✅ Alerta roja: "Ingresa un RUT o email para buscar"

### Prueba 9: Botón Limpiar
1. Buscar cualquier usuario válido
2. Click en botón **"Limpiar"**

**Resultado esperado**:
- ✅ Campo de búsqueda se vacía
- ✅ Tarjeta de usuario desaparece
- ✅ No hay alertas de error

### Prueba 10: Búsqueda con Enter
**Input**: `19133754-9` y presionar **Enter**

**Resultado esperado**:
- ✅ Ejecuta búsqueda sin necesidad de click en botón
- ✅ Muestra resultados correctamente

## Pruebas de Funcionalidades

### Editar Usuario
1. Buscar: `11111111-1`
2. Click en botón **"Editar"** (morado)

**Resultado esperado**:
- ✅ Navega a: `/admin/usuarios/editar/[id]`
- ✅ Formulario cargado con datos del usuario
- ✅ Todos los campos editables
- ✅ Rol mostrado en sección especial (solo lectura)

### Asignar Rol
1. Buscar: `11111111-1`
2. Click en botón **"Asignar Rol"** (rosa)

**Resultado esperado**:
- ✅ Modal se abre con overlay
- ✅ Dropdown muestra rol actual pre-seleccionado: "persona"
- ✅ Opciones disponibles: persona, administrador, superadmin
- ✅ Cambiar a "administrador" y guardar
- ✅ Modal se cierra
- ✅ Alert: "Rol actualizado exitosamente"
- ✅ Badge en tarjeta cambia a azul: administrador

**Revertir**:
- Click nuevamente en "Asignar Rol"
- Cambiar a "persona"
- Guardar

### Desactivar Usuario
1. Buscar: `22222222-2` (Administrador General)
2. Click en botón **"Desactivar"** (naranja/amarillo)

**Resultado esperado**:
- ✅ Modal de confirmación se abre
- ✅ Mensaje: "¿Estás seguro de que deseas desactivar a Administrador General?"
- ✅ Advertencia roja: "Esta acción no se puede deshacer"
- ✅ Botones: "No" (gris) y "Sí, Desactivar" (rojo)

**Si click en "No"**:
- ✅ Modal se cierra
- ✅ Usuario sigue activo
- ✅ Tarjeta permanece visible

**Si click en "Sí, Desactivar"**:
- ✅ Alert: "Usuario desactivado exitosamente"
- ✅ Búsqueda se limpia automáticamente
- ✅ Usuario no podrá hacer login

## RUTs Disponibles para Pruebas

```
19133754-9  → Diego Castro Herrera (superadmin)
12345678-9  → Juan José Pérez (persona)
65082894-1  → Club Deportivo Linares Colleges (administrador)
11111111-1  → Usuario Persona (persona)
22222222-2  → Administrador General (persona)
```

## Emails Disponibles para Pruebas

```
diegocastroh10@hotmail.com      → Diego Castro Herrera
jugador@test.cl                 → Juan José Pérez
clublinarescolleges@gmail.com   → Club Deportivo Linares Colleges
persona@test.com                → Usuario Persona
admin@linarescolleges.cl        → Administrador General
```

## Cambios Realizados

### Archivo: `crud-usuarios.component.ts`

**Antes**:
```typescript
const esRut = /^\d+$/.test(termino);  // Solo detectaba números sin guión
```

**Después**:
```typescript
const esRut = /^\d+(-\d)?$/.test(termino);  // Detecta números con o sin guión
```

### Archivo: `crud-usuarios.component.html`

**Antes**:
```html
placeholder="Buscar por RUT (sin dígito verificador) o email..."
```

**Después**:
```html
placeholder="Buscar por RUT (ej: 19133754-9) o email..."
```

## Checklist de Validación

Marca cada prueba al completarla:

- [ ] Búsqueda por RUT con guión funciona
- [ ] Búsqueda por email funciona
- [ ] Usuario no encontrado muestra error
- [ ] Campo vacío muestra error
- [ ] Botón Limpiar funciona
- [ ] Búsqueda con Enter funciona
- [ ] Botón Editar navega correctamente
- [ ] Modal Asignar Rol abre y guarda
- [ ] Modal Desactivar muestra confirmación
- [ ] Botón "No" cancela desactivación
- [ ] Avatar muestra inicial correcta
- [ ] Badges muestran colores correctos
- [ ] Spinners de carga aparecen
- [ ] Responsive en móvil funciona

## Estado

✅ **Backend**: PROBADO Y FUNCIONAL  
✅ **Frontend**: CORREGIDO Y LISTO PARA PROBAR  
📝 **Pendiente**: Pruebas manuales en navegador

---

**Fecha de corrección**: 10 de enero de 2026  
**Archivos modificados**: 3
- crud-usuarios.component.ts (regex corregida)
- crud-usuarios.component.html (placeholder actualizado)
- test-busqueda-usuarios.ps1 (nuevo script de pruebas)
