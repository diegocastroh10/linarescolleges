# 📰 Sistema de Noticias - Documentación Completa

## Resumen del Sistema

Se ha implementado un **sistema completo de gestión de noticias** con las siguientes características:

- ✅ CRUD completo para administradores
- ✅ Vista pública de noticias
- ✅ Soporte para imágenes en orientación horizontal y vertical
- ✅ Editor de contenido con HTML
- ✅ Integración con Instagram (URL opcional)
- ✅ Sección de auspiciadores
- ✅ Sistema de publicación/borrador
- ✅ Contador de visitas
- ✅ Endpoints públicos y protegidos

---

## Backend (NestJS)

### 1. Modelo de Datos (`backend/src/models/noticia.model.ts`)

```typescript
{
  titulo: string (requerido, mínimo 10 caracteres)
  contenido: string (requerido, HTML permitido)
  imagenPortada: string (URL de la imagen)
  orientacionImagen: 'horizontal' | 'vertical'
  autor: string (nombre del autor)
  fechaPublicacion: Date
  urlInstagram?: string (opcional)
  auspiciadores: string[] (array de URLs de logos)
  publicada: boolean (true/false)
  visitas: number (contador automático)
  createdAt: Date (automático)
  updatedAt: Date (automático)
}
```

### 2. Endpoints API

#### Endpoints Públicos (sin autenticación)
- **GET** `/api/noticias/publicas` - Obtener todas las noticias publicadas
- **GET** `/api/noticias/ultimas/:limite` - Obtener las últimas N noticias
- **GET** `/api/noticias/publica/:id` - Ver una noticia (incrementa contador de visitas)

#### Endpoints Protegidos (requieren token de administrador/superadmin)
- **GET** `/api/noticias` - Obtener todas las noticias (incluye borradores)
- **GET** `/api/noticias/:id` - Obtener una noticia por ID
- **POST** `/api/noticias` - Crear nueva noticia
- **PUT** `/api/noticias/:id` - Actualizar noticia existente
- **DELETE** `/api/noticias/:id` - Eliminar noticia
- **PUT** `/api/noticias/:id/publicar` - Alternar estado de publicación

### 3. Formato de Respuesta

Todas las respuestas siguen el formato:
```json
{
  "mensaje": "Descripción de la operación",
  "noticia": { ... },  // o "noticias": [ ... ]
  "cantidad": 10       // solo en listados
}
```

---

## Frontend (Angular)

### 1. Componente Admin CRUD (`frontend/src/app/pages/admin/crud-noticias/`)

**Características:**
- ✅ Formulario completo con validaciones
- ✅ Vista en grid con tarjetas
- ✅ Modal para crear/editar noticias
- ✅ **Carga de imágenes desde archivo local** (PC/móvil)
- ✅ **Conversión automática a base64**
- ✅ Preview instantáneo de imagen de portada
- ✅ Selector de orientación (horizontal/vertical)
- ✅ Campo de contenido HTML (textarea con soporte básico)
- ✅ Campo opcional de Instagram
- ✅ **Carga múltiple de logos de auspiciadores**
- ✅ **Preview y gestión de logos** (eliminar individual)
- ✅ Toggle de publicación
- ✅ Botones de editar, publicar/despublicar, eliminar
- ✅ Contador de visitas visible
- ✅ **Validación de tipo y tamaño de archivos**

**Acceso:**
- Ruta: `/admin/noticias`
- Requiere: Rol de administrador o superadmin

### 2. Componente Vista Pública (`frontend/src/app/pages/noticias/`)

**Características:**
- ✅ Grid de tarjetas de noticias
- ✅ Hover effects atractivos
- ✅ Vista de detalle en modal
- ✅ Renderizado de HTML en contenido
- ✅ Sección de Instagram (si existe URL)
- ✅ Galería de auspiciadores
- ✅ Sidebar con noticias relacionadas
- ✅ Botón "volver" para cerrar detalle
- ✅ Diseño responsive
- ✅ Contador de visitas incrementado al ver

**Acceso:**
- Ruta: `/noticias`
- Público (sin autenticación)

### 3. Servicio de Noticias (`frontend/src/app/core/services/noticias.service.ts`)

Métodos disponibles:
```typescript
// Públicos
obtenerPublicadas()
obtenerUltimas(limite: number)
obtenerNoticiaPublica(id: string)

// Protegidos (admin)
obtenerTodas()
obtenerPorId(id: string)
crear(noticia: Partial<Noticia>)
actualizar(id: string, noticia: Partial<Noticia>)
eliminar(id: string)
alternarPublicacion(id: string)
```

---

## Scripts de Prueba

### 1. `test-noticias-crear.ps1`
Prueba la creación de noticias como administrador:
- Login de administrador
- Crear noticia publicada con todos los campos
- Crear noticia en borrador
- Listar todas las noticias

**Ejecutar:**
```powershell
.\test-noticias-crear.ps1
```

### 2. `test-noticias-publicas.ps1`
Prueba endpoints públicos sin autenticación:
- Obtener noticias publicadas
- Obtener últimas 2 noticias
- Ver noticia específica (incrementa visitas)
- Verificar que endpoints protegidos requieren autenticación

**Ejecutar:**
```powershell
.\test-noticias-publicas.ps1
```

### 3. `test-noticias-admin.ps1`
Prueba completa del CRUD de administrador:
- Crear noticia
- Obtener por ID
- Actualizar contenido
- Publicar noticia
- Verificar en endpoint público
- Despublicar noticia
- Verificar que ya no aparece en público
- Eliminar noticia
- Verificar eliminación (404)

**Ejecutar:**
```powershell
.\test-noticias-admin.ps1
```

---

## Guía de Uso

### Para Administradores

#### Crear una Noticia:
1. Ir a `/admin/noticias`
2. Clic en "➕ Nueva Noticia"
3. Completar formulario:
   - **Título**: Mínimo 10 caracteres
   - **Autor**: Nombre del escritor
   - **Fecha**: Fecha de publicación
   - **Imagen de Portada**: Clic en "📁 Seleccionar imagen" y elegir archivo (máx. 5MB)
   - **Orientación**: Horizontal (16:9) o Vertical (9:16)
   - **Contenido**: Texto con HTML básico (`<strong>`, `<em>`, `<p>`, `<ul>`, etc.)
   - **Instagram** (opcional): URL del post
   - **Auspiciadores** (opcional): Clic en "📁 Seleccionar logos" y elegir múltiples imágenes (máx. 2MB c/u)
   - **Publicar**: Marcar si se publica inmediatamente
4. Clic en "💾 Guardar"

**Nota**: Las imágenes se convierten automáticamente a base64 y se almacenan en la base de datos.

#### Editar una Noticia:
1. En la lista de noticias, clic en "✏️ Editar"
2. Modificar campos necesarios
3. Clic en "💾 Actualizar"

#### Publicar/Despublicar:
- Clic en botón "✅ Publicar" o "🚫 Despublicar"
- Las noticias despublicadas no aparecen en la vista pública

#### Eliminar:
- Clic en "🗑️ Eliminar"
- Confirmar en el diálogo

### Para Usuarios Públicos

#### Ver Noticias:
1. Ir a `/noticias`
2. Navegar por el grid de noticias
3. Clic en cualquier tarjeta para ver detalle completo
4. Usar botón "← Volver" para regresar al listado

---

## Formato HTML Soportado

En el campo "Contenido" puedes usar estas etiquetas HTML:

```html
<!-- Texto -->
<p>Párrafo normal</p>
<strong>Texto en negrita</strong>
<em>Texto en cursiva</em>

<!-- Títulos -->
<h2>Título nivel 2</h2>
<h3>Título nivel 3</h3>

<!-- Listas -->
<ul>
  <li>Elemento de lista</li>
  <li>Otro elemento</li>
</ul>

<ol>
  <li>Elemento numerado</li>
  <li>Otro elemento</li>
</ol>

<!-- Enlaces -->
<a href="https://ejemplo.com">Enlace externo</a>

<!-- Citas -->
<blockquote>Texto citado</blockquote>

<!-- Saltos de línea -->
<br>
```

---

## Ejemplos de Imágenes

### Sistema de Carga de Archivos:
El sistema ahora permite **cargar imágenes directamente desde tu dispositivo**:

1. **Imagen de Portada**:
   - Formato: JPG, PNG, GIF, WebP
   - Tamaño máximo: 5 MB
   - Se convierte automáticamente a base64
   - Preview instantáneo antes de guardar

2. **Logos de Auspiciadores**:
   - Formato: JPG, PNG, GIF, WebP
   - Tamaño máximo: 2 MB por archivo
   - Selección múltiple permitida
   - Preview de todos los logos
   - Posibilidad de eliminar individualmente

### Cómo Funciona:
```
Usuario selecciona archivo → FileReader lo lee → 
Convierte a base64 → Se almacena en MongoDB →
Se muestra usando <img src="data:image/png;base64,..." />
```

### Ventajas del Sistema Base64:
- ✅ No requiere servidor de archivos externo
- ✅ No requiere configurar AWS S3, Cloudinary, etc.
- ✅ Las imágenes siempre están disponibles
- ✅ Funciona desde cualquier dispositivo
- ✅ Sin problemas de CORS
- ✅ Backup simple (todo en la base de datos)

### Limitaciones:
- ⚠️ El tamaño base64 es ~33% mayor que el archivo original
- ⚠️ No recomendado para imágenes muy grandes (>5MB)
- ⚠️ Aumenta el tamaño de la base de datos

---

## Validaciones

### Backend:
- ✅ Título: Mínimo 10 caracteres
- ✅ Contenido: Mínimo 50 caracteres
- ✅ Todos los campos requeridos presentes
- ✅ Solo administradores/superadmin pueden crear/editar/eliminar
- ✅ Verificación de existencia antes de actualizar/eliminar

### Frontend:
- ✅ Formulario con ReactiveFormsModule
- ✅ Validación en tiempo real
- ✅ Mensajes de error claros
- ✅ Preview de imagen de portada
- ✅ Confirmación antes de eliminar
- ✅ **Validación de tipo de archivo** (solo imágenes)
- ✅ **Validación de tamaño** (5MB portada, 2MB auspiciadores)
- ✅ **Preview de todas las imágenes antes de guardar**

---

## Estructura de Archivos

```
backend/
  src/
    models/
      noticia.model.ts          ✅
    services/
      noticias.service.ts       ✅
    controllers/
      noticias.controller.ts    ✅
    modules/
      noticias.module.ts        ✅
    app.module.ts              ✅ (NoticiasModule registrado)

frontend/
  src/app/
    core/
      models/
        noticia.model.ts        ✅
      services/
        noticias.service.ts     ✅
    pages/
      admin/
        crud-noticias/
          crud-noticias.component.ts    ✅
          crud-noticias.component.html  ✅
          crud-noticias.component.scss  ✅
      noticias/
        noticias.component.ts          ✅
        noticias.component.html        ✅
        noticias.component.scss        ✅
    app.routes.ts              ✅ (rutas configuradas)

Scripts de prueba:
  test-noticias-crear.ps1      ✅
  test-noticias-publicas.ps1   ✅
  test-noticias-admin.ps1      ✅
```

---

## Estado del Sistema

### ✅ Completado:
- [x] Modelo de datos en backend
- [x] Servicio con 9 métodos CRUD
- [x] Controlador con endpoints públicos y protegidos
- [x] Módulo registrado en AppModule
- [x] Backend compilado y funcionando
- [x] Modelo TypeScript en frontend
- [x] Servicio HTTP en frontend
- [x] Componente CRUD para administrador
- [x] **Sistema de carga de imágenes desde archivo**
- [x] **Conversión automática a base64**
- [x] **Validación de tipo y tamaño de archivos**
- [x] **Preview de imágenes antes de guardar**
- [x] **Gestión de múltiples logos de auspiciadores**
- [x] Componente vista pública
- [x] Rutas configuradas
- [x] Scripts de prueba PowerShell
- [x] Diseño responsive
- [x] Validaciones completas

### 📝 Mejoras Futuras (Opcionales):
- [ ] Integrar editor Quill para contenido rico (actualmente textarea HTML)
- [ ] Comprimir imágenes automáticamente antes de convertir a base64
- [ ] Redimensionar imágenes grandes automáticamente
- [ ] Upload a servidor/cloud para imágenes muy grandes (AWS S3, Cloudinary)
- [ ] Embed automático de Instagram (iframe)
- [ ] Paginación para listados grandes
- [ ] Filtros por fecha/autor en vista pública
- [ ] Búsqueda de noticias
- [ ] Categorías/etiquetas
- [ ] Comentarios de usuarios
- [ ] Compartir en redes sociales
- [ ] Lazy loading de imágenes en listados

---

## Credenciales de Prueba

Para probar el sistema, usar las credenciales del archivo `CREDENCIALES_LOGIN.txt`:

```
Administrador:
Email: administrador@linarescolleges.com
Password: Admin123456
```

---

## Notas Importantes

1. **Contador de Visitas**: Se incrementa automáticamente cada vez que se accede al endpoint `GET /api/noticias/publica/:id`

2. **HTML Seguro**: El contenido HTML se renderiza con `[innerHTML]`. Asegúrate de validar el contenido en producción para evitar XSS.

3. **Auspiciadores**: Se almacenan como array de URLs. En el formulario se ingresan separados por comas.

4. **Orientación de Imagen**: 
   - Horizontal (16:9): Para banners y fotos de paisaje
   - Vertical (9:16): Para stories y fotos de retrato

5. **Estados de Publicación**:
   - `publicada: true` → Visible en endpoint público
   - `publicada: false` → Solo visible para administradores

---

## Solución de Problemas

### Error 401 Unauthorized:
- Verificar que el token JWT esté presente
- Verificar que el usuario sea administrador o superadmin
- Revisar fecha de expiración del token

### Error 404 Not Found:
- Verificar que el ID de la noticia sea válido
- Verificar que la noticia no haya sido eliminada

### Noticia no aparece en vista pública:
- Verificar que `publicada: true`
- Verificar que la fecha de publicación no sea futura
- Recargar la página

### Imágenes no se ven:
- Verificar que la imagen fue cargada correctamente (ver preview)
- Verificar que el formato de imagen es soportado (JPG, PNG, GIF, WebP)
- Si la imagen es base64, verificar que comienza con `data:image/`
- Verificar el tamaño del archivo (máx. 5MB para portada, 2MB para auspiciadores)
- Si editas una noticia existente con URL antigua, la imagen se mantendrá hasta que cargues una nueva

### Error al cargar imagen:
- **"Por favor selecciona un archivo de imagen válido"**: El archivo no es una imagen
- **"La imagen es muy grande"**: Reducir el tamaño del archivo
  - Portada: máximo 5MB
  - Auspiciadores: máximo 2MB cada uno
- **Navegador lento al cargar**: La imagen es grande, esperar a que se convierta a base64
- **Error de memoria**: Imagen demasiado grande, reducir resolución/calidad

---

## Contacto y Soporte

Sistema desarrollado para **Linares Colleges Football Club**

Fecha de implementación: Enero 2026

---

**✅ Sistema completamente funcional y listo para uso en producción**
