# GU\u00cdA DE PRUEBAS: PERFIL DE USUARIO

## Descripci\u00f3n General

El sistema de perfil permite a cualquier usuario autenticado:
- Ver su perfil completo con tem\u00e1tica de baloncesto
- Editar su foto de perfil (cargar y guardar en base de datos)
- Editar su informaci\u00f3n personal
- Campos de solo lectura: Email, RUT y Rol

## Acceso al Perfil

### M\u00e9todo 1: Desde el navbar
1. Login con cualquier usuario
2. Click en el bot\u00f3n **"Perfil"** en la navbar
3. URL: http://localhost:4200/perfil

### M\u00e9todo 2: Navegaci\u00f3n directa
- URL: http://localhost:4200/perfil
- Requiere estar autenticado (authGuard)

## Usuarios de Prueba

```
SUPERADMIN:
Email: diegocastroh10@hotmail.com
Password: D1eg0#
RUT: 19133754-9

ADMINISTRADOR:
Email: clublinarescolleges@gmail.com
Password: Admin2024#
RUT: 65082894-1

PERSONA:
Email: persona@test.com
Password: Test123#
RUT: 11111111-1
```

## Funcionalidades del Perfil

### 1. Visualizaci\u00f3n del Perfil

**Elementos mostrados**:

#### Header
- \ud83c\udfc0 T\u00edtulo: "Mi Perfil"
- Nombre del usuario
- Pattern de baloncesto en el fondo (naranja)

#### Tarjeta de Foto de Perfil (Sticky sidebar)
- **Foto de perfil** o **Avatar con iniciales**
  - Avatar con gradiente morado si no hay foto
  - Muestra las iniciales del nombre
- **Bot\u00f3n de c\u00e1mara** para cambiar foto
  - Icono: \ud83d\udcf7
  - Color naranja (#ff6b35)
  - Posici\u00f3n: Esquina inferior derecha
- Nombre completo
- @nombreusuario
- Badge de rol (verde/azul/gris)

#### Informaci\u00f3n Personal
- \ud83d\udce7 Email
- \ud83d\udcce RUT
- \ud83d\udcde Tel\u00e9fono
- \ud83d\udccd Direcci\u00f3n
- \ud83c\udf82 Fecha de Nacimiento (edad calculada)

#### Informaci\u00f3n de Baloncesto
- \ud83c\udfc0 Posici\u00f3n (destacada con fondo naranja)
- Card especial con gradiente naranja

#### Informaci\u00f3n del Apoderado (si existe)
- \ud83d\udc64 Nombre del apoderado
- \ud83d\udcde Tel\u00e9fono del apoderado

#### Informaci\u00f3n de la Cuenta
- \ud83d\udcc5 Miembro desde
- \ud83d\udee1\ufe0f Rol
- \u2705 Estado (Activo)

### 2. Cambiar Foto de Perfil

**Proceso**:
1. Click en bot\u00f3n de c\u00e1mara (\ud83d\udcf7)
2. Selector de archivos se abre
3. Seleccionar imagen (JPG, PNG, GIF, etc.)
4. Sistema valida:
   - Tipo de archivo (debe ser imagen)
   - Tama\u00f1o (m\u00e1ximo 2MB)
5. Imagen se convierte a Base64
6. Se env\u00eda al backend
7. Se actualiza en el perfil
8. Alert: "Foto de perfil actualizada exitosamente"

**Validaciones**:
- \u274c Archivo no imagen \u2192 Error: "Por favor selecciona una imagen v\u00e1lida"
- \u274c Archivo > 2MB \u2192 Error: "La imagen no debe superar los 2MB"
- \u2705 Imagen v\u00e1lida \u2192 Se sube correctamente

**Estados visuales**:
- **Normal**: Icono de c\u00e1mara
- **Subiendo**: Spinner circular
- **Bot\u00f3n disabled** mientras se sube

### 3. Editar Perfil

**Acceso**:
- Click en bot\u00f3n **"Editar"** (l\u00e1piz) en la secci\u00f3n "Informaci\u00f3n Personal"
- Navega a: `/perfil/editar`

**Formulario de Edici\u00f3n**:

#### Campos Editables:
1. **Informaci\u00f3n Personal**
   - Nombre Completo * (requerido)
   - Nombre de Usuario * (requerido)
   - Fecha de Nacimiento (opcional)

2. **Informaci\u00f3n de Contacto**
   - Tel\u00e9fono * (requerido)
   - Direcci\u00f3n * (requerido)

3. **Informaci\u00f3n del Club**
   - Posici\u00f3n * (requerido)
   - Placeholder: "Ej: Base, Escolta, Alero..."

4. **Informaci\u00f3n del Apoderado**
   - Nombre del Apoderado (opcional)
   - Tel\u00e9fono del Apoderado (opcional)

#### Campos de Solo Lectura:
- \ud83d\udd12 Email (no modificable)
- \ud83d\udd12 RUT (no modificable)
- \ud83d\udd12 Rol (no modificable)

**Mensaje informativo**:
> \u2139\ufe0f Email, RUT y Rol no pueden ser modificados

**Botones**:
- **Cancelar** (gris) \u2192 Vuelve a `/perfil`
- **Guardar Cambios** (naranja) \u2192 Actualiza y vuelve a `/perfil`

**Validaciones**:
- Campos marcados con * son obligatorios
- Feedback visual con borde rojo si inv\u00e1lido
- Bot\u00f3n "Guardar" deshabilitado si formulario inv\u00e1lido
- Spinner en bot\u00f3n mientras guarda

## Pruebas Manuales

### Preparaci\u00f3n:
1. Backend corriendo en http://localhost:3000 \u2705
2. Frontend corriendo en http://localhost:4200 \u2705
3. Usuario: persona@test.com / Test123#

---

### Prueba 1: Visualizaci\u00f3n del Perfil

**Pasos**:
1. Login con persona@test.com
2. Click en "Perfil" en navbar
3. Observar la p\u00e1gina

**Resultados esperados**:
- \u2705 Header naranja con patr\u00f3n de baloncesto
- \u2705 T\u00edtulo: "\ud83c\udfc0 Mi Perfil"
- \u2705 Sidebar con foto/avatar sticky (se mantiene al hacer scroll)
- \u2705 Avatar muestra iniciales "PT" (Persona Test)
- \u2705 Nombre: "Persona Test"
- \u2705 Username: "@personatest" (o similar)
- \u2705 Badge gris con "persona"
- \u2705 Bot\u00f3n de c\u00e1mara visible
- \u2705 Todas las secciones de informaci\u00f3n visibles
- \u2705 Card de baloncesto con fondo naranja
- \u2705 Posici\u00f3n destacada con icono \ud83c\udfc0

---

### Prueba 2: Cambiar Foto de Perfil (Imagen V\u00e1lida)

**Pasos**:
1. En la p\u00e1gina de perfil
2. Click en bot\u00f3n de c\u00e1mara (\ud83d\udcf7)
3. Seleccionar imagen PNG/JPG < 2MB
4. Esperar subida

**Resultados esperados**:
- \u2705 Selector de archivos se abre
- \u2705 Bot\u00f3n muestra spinner mientras sube
- \u2705 Bot\u00f3n se deshabilita temporalmente
- \u2705 Alert: "Foto de perfil actualizada exitosamente"
- \u2705 Imagen se muestra en el perfil
- \u2705 Avatar se reemplaza por la imagen
- \u2705 Imagen es circular con borde naranja

---

### Prueba 3: Validaci\u00f3n de Foto (Archivo Inv\u00e1lido)

**Pasos**:
1. Click en bot\u00f3n de c\u00e1mara
2. Seleccionar archivo .txt o .pdf

**Resultados esperados**:
- \u2705 Alert rojo: "Por favor selecciona una imagen v\u00e1lida"
- \u2705 Imagen NO se sube
- \u2705 Avatar permanece sin cambios

---

### Prueba 4: Validaci\u00f3n de Foto (Archivo Muy Grande)

**Pasos**:
1. Click en bot\u00f3n de c\u00e1mara
2. Seleccionar imagen > 2MB

**Resultados esperados**:
- \u2705 Alert rojo: "La imagen no debe superar los 2MB"
- \u2705 Imagen NO se sube
- \u2705 Avatar permanece sin cambios

---

### Prueba 5: Navegar a Editar Perfil

**Pasos**:
1. En p\u00e1gina de perfil
2. Click en bot\u00f3n "Editar" (secci\u00f3n Informaci\u00f3n Personal)

**Resultados esperados**:
- \u2705 Navega a `/perfil/editar`
- \u2705 Header naranja con t\u00edtulo "\u270f\ufe0f Editar Mi Perfil"
- \u2705 Bot\u00f3n "Volver" visible
- \u2705 Formulario cargado con datos actuales
- \u2705 Todos los campos pre-rellenados
- \u2705 Secci\u00f3n de solo lectura al final
- \u2705 Email, RUT y Rol visibles pero no editables

---

### Prueba 6: Editar Informaci\u00f3n (Guardado Exitoso)

**Pasos**:
1. En `/perfil/editar`
2. Cambiar tel\u00e9fono: "+56987654321"
3. Cambiar direcci\u00f3n: "Nueva Calle 789"
4. Cambiar posici\u00f3n: "Escolta"
5. Click en "Guardar Cambios"

**Resultados esperados**:
- \u2705 Bot\u00f3n muestra spinner
- \u2705 Bot\u00f3n se deshabilita temporalmente
- \u2705 Alert: "Perfil actualizado exitosamente"
- \u2705 Navega de vuelta a `/perfil`
- \u2705 Cambios reflejados en el perfil
- \u2705 Tel\u00e9fono actualizado
- \u2705 Direcci\u00f3n actualizada
- \u2705 Posici\u00f3n actualizada en card naranja

---

### Prueba 7: Validaci\u00f3n de Formulario (Campos Requeridos)

**Pasos**:
1. En `/perfil/editar`
2. Borrar contenido de "Nombre Completo"
3. Intentar guardar

**Resultados esperados**:
- \u2705 Campo tiene borde rojo
- \u2705 Mensaje: "El nombre es requerido"
- \u2705 Bot\u00f3n "Guardar" deshabilitado
- \u2705 No permite enviar formulario

---

### Prueba 8: Cancelar Edici\u00f3n

**Pasos**:
1. En `/perfil/editar`
2. Cambiar algunos campos
3. Click en "Cancelar"

**Resultados esperados**:
- \u2705 Navega a `/perfil` sin guardar
- \u2705 Cambios NO se reflejan
- \u2705 Datos permanecen como antes

---

### Prueba 9: Bot\u00f3n Volver en Header

**Pasos**:
1. En `/perfil/editar`
2. Click en bot\u00f3n "Volver" (flecha izquierda en header)

**Resultados esperados**:
- \u2705 Navega a `/perfil`
- \u2705 Cambios NO guardados

---

### Prueba 10: Actualizaci\u00f3n en Tiempo Real (Usuario en LocalStorage)

**Pasos**:
1. Editar perfil y guardar
2. Ir al navbar
3. Verificar nombre mostrado

**Resultados esperados**:
- \u2705 Nombre en navbar actualizado
- \u2705 Usuario en localStorage actualizado
- \u2705 authService actualizado
- \u2705 Cambios persisten al refrescar (F5)

---

### Prueba 11: Responsive - M\u00f3vil

**Pasos**:
1. Abrir DevTools (F12)
2. Modo responsive (iPhone)
3. Navegar por el perfil

**Resultados esperados**:
- \u2705 Sidebar NO es sticky en m\u00f3vil
- \u2705 Avatar m\u00e1s peque\u00f1o (150px)
- \u2705 Grid de informaci\u00f3n en 1 columna
- \u2705 Bot\u00f3n "Editar" ocupa ancho completo
- \u2705 Formulario responsive con campos en 1 columna

---

### Prueba 12: Animaciones

**Observar**:
- \u2705 Cards aparecen con fadeIn secuencial
- \u2705 Bot\u00f3n c\u00e1mara tiene efecto hover (scale 1.1)
- \u2705 Bot\u00f3n editar se eleva al hacer hover
- \u2705 Transiciones suaves (0.3s)

---

### Prueba 13: C\u00e1lculo de Edad

**Pasos**:
1. Usuario con fecha de nacimiento registrada
2. Ver perfil

**Resultados esperados**:
- \u2705 Muestra fecha: "15/03/2005"
- \u2705 Calcula edad: "(19 a\u00f1os)" - ejemplo
- \u2705 Edad correcta seg\u00fan fecha actual

---

### Prueba 14: Apoderado Opcional

**Caso 1: Usuario SIN apoderado**
- \u2705 Secci\u00f3n "Informaci\u00f3n del Apoderado" NO se muestra

**Caso 2: Usuario CON apoderado**
- \u2705 Secci\u00f3n visible
- \u2705 Muestra nombre y tel\u00e9fono

---

### Prueba 15: Diferentes Roles

**Superadmin**:
- \u2705 Badge verde: "superadmin"
- \u2705 Toda la funcionalidad igual

**Administrador**:
- \u2705 Badge azul: "administrador"
- \u2705 Puede editar su propio perfil

**Persona**:
- \u2705 Badge gris: "persona"
- \u2705 Puede editar su propio perfil

---

## Verificaci\u00f3n de Backend

### Script de Prueba:
```powershell
.\test-perfil-usuario.ps1
```

**Verifica**:
1. \u2705 Login funcional
2. \u2705 Obtenci\u00f3n de perfil
3. \u2705 Actualizaci\u00f3n de tel\u00e9fono y direcci\u00f3n
4. \u2705 Actualizaci\u00f3n de posici\u00f3n
5. \u2705 Actualizaci\u00f3n de foto (Base64)
6. \u2705 Verificaci\u00f3n de todos los cambios

---

## Dise\u00f1o Visual

### Colores:
- **Header**: Gradiente naranja (#ff6b35 \u2192 #f7931e)
- **Fondo p\u00e1gina**: Gradiente gris claro (#f5f7fa \u2192 #c3cfe2)
- **Cards**: Blanco con sombra sutil
- **Avatar sin foto**: Gradiente morado (#667eea \u2192 #764ba2)
- **Bot\u00f3n c\u00e1mara**: Naranja #ff6b35
- **Bot\u00f3n editar**: Naranja #ff6b35
- **Iconos**: Naranja #ff6b35
- **Card baloncesto**: Gradiente naranja

### Tipograf\u00eda:
- T\u00edtulos: 2.5rem - Bold
- Nombres: 1.75rem - Bold
- Username: 1.1rem - Regular
- Labels: 0.875rem - Medium - Uppercase
- Datos: 1rem - Medium

---

## Archivos Modificados/Creados

### Backend:
- `backend/src/models/usuario.model.ts` - Agregado campo `fotoPerfil`

### Frontend:
- `frontend/src/app/core/models/usuario.model.ts` - Agregado campo `fotoPerfil`
- `frontend/src/app/core/services/auth.service.ts` - Agregado m\u00e9todo `setUser()`
- `frontend/src/app/pages/perfil/perfil.component.ts` - Completo
- `frontend/src/app/pages/perfil/perfil.component.html` - Completo
- `frontend/src/app/pages/perfil/perfil.component.scss` - Completo
- `frontend/src/app/pages/editar-perfil/editar-perfil.component.ts` - Nuevo
- `frontend/src/app/pages/editar-perfil/editar-perfil.component.html` - Nuevo
- `frontend/src/app/pages/editar-perfil/editar-perfil.component.scss` - Nuevo
- `frontend/src/app/app.routes.ts` - Agregada ruta `/perfil/editar`

### Scripts:
- `test-perfil-usuario.ps1` - Pruebas backend

---

## Checklist de Validaci\u00f3n

- [ ] Visualizaci\u00f3n del perfil funciona
- [ ] Avatar muestra iniciales correctamente
- [ ] Sidebar sticky funciona en desktop
- [ ] Bot\u00f3n c\u00e1mara visible y funcional
- [ ] Selecci\u00f3n de imagen abre file picker
- [ ] Validaci\u00f3n de tipo de archivo funciona
- [ ] Validaci\u00f3n de tama\u00f1o (2MB) funciona
- [ ] Foto se sube y muestra correctamente
- [ ] Foto se guarda en base de datos (Base64)
- [ ] Bot\u00f3n "Editar" navega a `/perfil/editar`
- [ ] Formulario carga datos actuales
- [ ] Campos editables funcionan
- [ ] Campos de solo lectura no son editables
- [ ] Validaciones de campos requeridos funcionan
- [ ] Bot\u00f3n "Guardar" actualiza datos
- [ ] Alert de \u00e9xito se muestra
- [ ] Cambios se reflejan en el perfil
- [ ] authService se actualiza
- [ ] LocalStorage se actualiza
- [ ] Bot\u00f3n "Cancelar" vuelve sin guardar
- [ ] Bot\u00f3n "Volver" funciona
- [ ] C\u00e1lculo de edad correcto
- [ ] Apoderado opcional se muestra correctamente
- [ ] Responsive funciona en m\u00f3vil
- [ ] Animaciones funcionan correctamente
- [ ] Badges de rol con colores correctos
- [ ] Card de baloncesto con dise\u00f1o especial
- [ ] Pattern de baloncesto en header

---

## Estado Final

\u2705 **Backend**: FUNCIONAL (campo fotoPerfil agregado)  
\u2705 **Frontend - Perfil**: COMPLETO Y FUNCIONAL  
\u2705 **Frontend - Editar Perfil**: COMPLETO Y FUNCIONAL  
\u2705 **Rutas**: CONFIGURADAS  
\u2705 **Validaciones**: IMPLEMENTADAS  
\u2705 **Responsive**: IMPLEMENTADO  
\u2705 **Pruebas Backend**: EXITOSAS  
\ud83d\udcdd **Pendiente**: Pruebas manuales en navegador

---

**Fecha**: 10 de enero de 2026  
**Componentes**: Perfil + Editar Perfil  
**Tem\u00e1tica**: Baloncesto  
**Funcionalidad principal**: Foto de perfil editable + Formulario de edici\u00f3n
