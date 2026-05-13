# 🏀 Linares Colleges - Sistema de Gestión Deportiva

## 📋 Descripción

Sistema web completo para la gestión del Club Deportivo Linares Colleges, incluyendo administración de usuarios, entrenamientos, noticias, galerías e historia del club. Desarrollado con Angular 18 (frontend) y NestJS (backend).

## 🚀 Tecnologías Utilizadas

### Backend
- **Framework**: NestJS 10.x
- **Runtime**: Node.js v20+
- **Base de Datos**: MongoDB 7.x (containerizada con Docker)
- **ORM**: Mongoose
- **Lenguaje**: TypeScript
- **Autenticación**: JWT + Bcrypt
- **Email**: Nodemailer

### Frontend
- **Framework**: Angular 18.2.21
- **Lenguaje**: TypeScript
- **Estilos**: SCSS
- **SSR**: Angular Universal
- **Arquitectura**: Standalone Components + Signals

## 📁 Estructura del Proyecto

```
linarescolleges/
├── backend/                          # API REST con NestJS
│   ├── src/
│   │   ├── config/                   # Configuraciones (DB, Email)
│   │   ├── controllers/              # Controladores REST
│   │   ├── decorators/               # Decoradores personalizados
│   │   ├── enums/                    # Enumeraciones
│   │   ├── guards/                   # Guards de autenticación
│   │   ├── models/                   # Modelos de Mongoose
│   │   ├── modules/                  # Módulos de NestJS
│   │   ├── services/                 # Lógica de negocio
│   │   ├── strategies/               # Estrategias de autenticación
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── scripts/                      # Scripts de utilidad
│   ├── docs/                         # Documentación API
│   ├── .env.example                  # Variables de entorno ejemplo
│   └── package.json
│
├── frontend/                         # Aplicación Angular
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/                 # Guards, interceptors, servicios core
│   │   │   ├── pages/                # Componentes de páginas
│   │   │   │   ├── admin/            # Panel administrativo
│   │   │   │   ├── inicio/           # Página principal
│   │   │   │   ├── historia/         # Historia del club
│   │   │   │   ├── noticias/         # Noticias públicas
│   │   │   │   ├── entrenamientos/   # Horarios
│   │   │   │   ├── galerias/         # Galerías de fotos
│   │   │   │   ├── perfil/           # Perfil de usuario
│   │   │   │   └── ...
│   │   │   ├── shared/               # Componentes compartidos
│   │   │   ├── app.component.ts
│   │   │   └── app.routes.ts
│   │   ├── assets/                   # Recursos estáticos
│   │   ├── styles.scss               # Estilos globales
│   │   └── index.html
│   ├── scripts/                      # Scripts de utilidad
│   ├── docs/                         # Documentación frontend
│   └── package.json
│
├── docs/                             # Documentación general
│   ├── GUIA_CRUD_USUARIOS.md
│   ├── SISTEMA_NOTICIAS.md
│   ├── MIDDLEWARE_GLOBAL_JWT.md
│   └── ...
│
├── scripts/                          # Scripts de prueba
│   ├── test-crud-usuarios.ps1
│   ├── test-noticias-admin.ps1
│   ├── verificar-sistema.ps1
│   └── ...
│
├── .gitignore
└── README.md
```

## 🐳 Configuración de Docker y MongoDB

### 1. Crear y Ejecutar Contenedor MongoDB
```powershell
# Descargar imagen de MongoDB
docker pull mongo:latest

# Crear y ejecutar el contenedor
docker run -d --name mongodb-linarescolleges -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD="Linare$2026" \
  -e MONGO_INITDB_DATABASE=db-linarescolleges \
  mongo:latest

# Verificar que el contenedor esté corriendo
docker ps
```

### 2. Datos de Conexión
- **Host**: localhost
- **Puerto**: 27017
- **Base de datos**: db-linarescolleges
- **Usuario**: admin
- **Contraseña**: Linare$2026
- **Colecciones**: usuarios, entrenamientos, noticias

## 📦 Instalación y Configuración

### Backend

1. **Navegar a la carpeta backend**
   ```powershell
   cd backend
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Configurar variables de entorno**
   ```powershell
   cp .env.example .env
   # Editar .env con tus configuraciones
   ```

4. **Compilar el proyecto**
   ```powershell
   npm run build
   ```

5. **Ejecutar el servidor**
   ```powershell
   npm run start
   # o en modo desarrollo:
   npm run start:dev
   ```

   El servidor estará disponible en: `http://localhost:3000`

### Frontend

1. **Navegar a la carpeta frontend**
   ```powershell
   cd frontend
   ```

2. **Instalar dependencias**
   ```powershell
   npm install
   ```

3. **Ejecutar en modo desarrollo**
   ```powershell
   npm start
   ```

   La aplicación estará disponible en: `http://localhost:4200`

4. **Compilar para producción**
   ```powershell
   npm run build
   ```

## 🎯 Funcionalidades Principales

### Públicas
- ✅ Página de inicio con carrusel
- ✅ Historia del club con timeline interactivo
- ✅ Noticias públicas con imágenes
- ✅ Horarios de entrenamientos por categoría
- ✅ Galerías de fotos
- ✅ Registro de nuevos usuarios
- ✅ Login y recuperación de contraseña

### Área de Usuario
- ✅ Perfil personal editable
- ✅ Ver entrenamientos asignados
- ✅ Actualizar información personal

### Panel Administrativo
- ✅ CRUD completo de usuarios
- ✅ CRUD completo de noticias (con imágenes base64)
- ✅ CRUD completo de entrenamientos
- ✅ Gestión de galerías
- ✅ Búsqueda y filtros avanzados

## 🔐 Autenticación y Roles

El sistema implementa 3 roles:
- **Usuario**: Acceso básico (perfil, ver entrenamientos)
- **Administrador**: Gestión de contenido (noticias, entrenamientos, galerías)
- **Superadministrador**: Acceso total (gestión de usuarios + todo lo de admin)

## 📝 Modelos de Datos

### Usuario
- Email, password (encriptado), nombrePersonal, nombreUsuario, RUT
- Fecha de nacimiento, posición, teléfono, dirección
- Datos del apoderado (opcional)
- Rol (usuario/admin/superadmin)

### Entrenamiento
- Título, descripción, categoría
- Días de la semana, horario inicio/fin
- Nivel (principiante/intermedio/avanzado)

### Noticia
- Título, contenido, categoría
- Imagen de portada (base64)
- Auspiciadores (array de imágenes base64)
- Fecha de publicación, visitas, autor

## 🧪 Pruebas

Los scripts de prueba están disponibles en la carpeta `/scripts`:
- `test-crud-usuarios.ps1`: Pruebas de CRUD de usuarios
- `test-noticias-admin.ps1`: Pruebas de noticias
- `test-entrenamientos.ps1`: Pruebas de entrenamientos
- `verificar-sistema.ps1`: Verificación general del sistema

## 📚 Documentación Adicional

- **Backend**: Ver `/backend/docs/` para documentación de API
- **Frontend**: Ver `/frontend/docs/` para guías de desarrollo
- **General**: Ver `/docs/` para documentación técnica general

## 🤝 Contribución

Este es un proyecto educativo desarrollado para el Club Deportivo Linares Colleges.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

## 👥 Autor

Desarrollado con ❤️ para Linares Colleges
- `fechaCreacion`: Fecha de creación (automática)
- `fechaActualizacion`: Fecha de última edición (automática)
- `activo`: Estado de la cuenta (boolean)
- `isAdmin`: Permisos de administrador (boolean)

## 🔌 Endpoints de la API

### Base URL
```
http://localhost:3000/api/usuarios
```

### 1. Registrar Usuario
**POST** `/api/usuarios/register`

**Body:**
```json
{
  "email": "jugador@linarescolleges.cl",
  "password": "password123",
  "nombrePersonal": "Juan Pérez López",
  "nombreUsuario": "juanp",
  "rut": "12345678-9",
  "fechaNacimiento": "1995-05-15",
  "posicion": "Base",
  "telefono": "+56912345678",
  "direccion": "Av. Libertad 123",
  "nombreApoderado": "María López",
  "telefonoApoderado": "+56987654321"
}
```

### 2. Login
**POST** `/api/usuarios/login`

**Body:**
```json
{
  "email": "jugador@linarescolleges.cl",
  "password": "password123"
}
```

### 3. Obtener Todos los Usuarios
**GET** `/api/usuarios`

### 4. Buscar Usuario por RUT
**GET** `/api/usuarios/rut/:rut`

**Ejemplo:** `/api/usuarios/rut/12345678-9`

### 5. Buscar Usuario por Email
**GET** `/api/usuarios/email/:email`

**Ejemplo:** `/api/usuarios/email/jugador@linarescolleges.cl`

### 6. Buscar Usuario por ID
**GET** `/api/usuarios/id/:id`

**Ejemplo:** `/api/usuarios/id/551b1468-08b0-4290-bf26-a6b03eb2ca90`

### 7. Editar Usuario por RUT
**PUT** `/api/usuarios/rut/:rut`

**Body:**
```json
{
  "telefono": "+56987654321",
  "posicion": "Escolta"
}
```

### 8. Editar Usuario por Email
**PUT** `/api/usuarios/email/:email`

**Body:**
```json
{
  "nombrePersonal": "Juan Carlos Pérez"
}
```

### 9. Editar Usuario por ID
**PUT** `/api/usuarios/id/:id`

**Body:**
```json
{
  "telefono": "+56999888777",
  "direccion": "Nueva Calle 456"
}
```

### 10. Desactivar Cuenta de Usuario (Admin)
**DELETE** `/api/usuarios/desactivar/:rut`

**Body:**
```json
{
  "isAdmin": true
}
```

### 11. Eliminar Usuario Permanentemente (Admin)
**DELETE** `/api/usuarios/id/:id`

**Body:**
```json
{
  "isAdmin": true
}
```

**Nota:** Este endpoint elimina el usuario de forma permanente de la base de datos.

## 🧪 Pruebas de la API

### Opción 1: Usar el Script de PowerShell
```powershell
cd backend
.\test-api.ps1
```

### Opción 2: Usar el Navegador
Abrir: `http://localhost:3000/api/usuarios`

### Opción 3: Usar Postman o Insomnia
Importar las colecciones desde `API_TESTS.md`

### Opción 4: Usar curl
```bash
# Registrar usuario
curl -X POST http://localhost:3000/api/usuarios/register \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "password":"password123",
    "nombrePersonal":"Test User",
    "rut":"11111111-1",
    "fechaNacimiento":"1990-01-01",
    "posicion":"Base",
    "telefono":"+56912345678"
  }'

# Obtener todos los usuarios
curl http://localhost:3000/api/usuarios
```

## 📊 Respuestas de la API

### Respuesta Exitosa (Register)
```json
{
  "mensaje": "Usuario creado exitosamente",
  "usuario": {
    "_id": "uuid-generado",
    "email": "jugador@linarescolleges.cl",
    "nombrePersonal": "Juan Pérez López",
    "rut": "12345678-9",
    "telefono": "+56912345678",
    "posicion": "Base",
    "fechaNacimiento": "1995-05-15",
    "fechaCreacion": "2026-01-07T05:25:00.000Z"
  }
}
```

### Respuesta de Error
```json
{
  "statusCode": 409,
  "message": "Ya existe un usuario con ese email o RUT"
}
```

## 🔐 Seguridad

- Las contraseñas se encriptan con **bcrypt** antes de almacenarlas
- Los endpoints de edición requieren validación
- La desactivación de cuentas requiere permisos de administrador
- CORS configurado para permitir peticiones desde `http://localhost:4200` (Angular)

## 🚧 Comandos Útiles

### Docker
```powershell
# Ver contenedores en ejecución
docker ps

# Detener contenedor
docker stop mongodb-linarescolleges

# Iniciar contenedor
docker start mongodb-linarescolleges

# Eliminar contenedor
docker rm mongodb-linarescolleges
```

### Backend
```powershell
# Instalar dependencias
npm install

# Compilar
npm run build

# Ejecutar
npm start

# Desarrollo (compilar + ejecutar)
npm run dev
```

## 📝 Notas Importantes

1. **MongoDB debe estar corriendo** antes de iniciar el servidor backend
2. El puerto **3000** debe estar disponible para el backend
3. El puerto **27017** debe estar disponible para MongoDB
4. Las contraseñas se encriptan automáticamente, no envíes hashes
5. Los campos `_id` y `fechaCreacion` se generan automáticamente

## 🔄 Próximos Pasos

- [ ] Implementar frontend con Angular 18
- [ ] Añadir autenticación JWT
- [ ] Implementar refresh tokens
- [ ] Añadir validación de RUT chileno
- [ ] Implementar roles y permisos
- [ ] Añadir paginación a la lista de usuarios
- [ ] Implementar búsqueda avanzada
- [ ] Añadir documentación con Swagger

## 👨‍💻 Autor

Desarrollado para Linares Colleges

## 📄 Licencia

ISC
