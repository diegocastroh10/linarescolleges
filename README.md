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
docker run -d --name mongodb -p 28011:28011 \
  -e MONGO_INITDB_ROOT_USERNAME=user \
  -e MONGO_INITDB_ROOT_PASSWORD="Password123!" \
  -e MONGO_INITDB_DATABASE=dbase \
  mongo:latest

# Verificar que el contenedor esté corriendo
docker ps
```

### 2. Datos de Conexión
- **Host**: localhost
- **Puerto**: 28011
- **Base de datos**: dbase
- **Usuario**: user
- **Contraseña**: Password123!
- **Colecciones**: components

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

## 📚 Documentación Adicional

- **Backend**: Ver `/backend/docs/` para documentación de API
- **Frontend**: Ver `/frontend/docs/` para guías de desarrollo
- **General**: Ver `/docs/` para documentación técnica general

## 🤝 Contribución

Este es un proyecto educativo desarrollado para el Club Deportivo Linares Colleges.

## 📄 Licencia

Proyecto privado - Todos los derechos reservados.

## 🔐 Seguridad

- Las contraseñas se encriptan con **bcrypt** antes de almacenarlas
- Los endpoints de edición requieren validación
- La desactivación de cuentas requiere permisos de administrador
- CORS configurado para permitir peticiones desde `http://localhost:4200` (Angular)

## 📝 Notas Importantes

1. **MongoDB debe estar corriendo** antes de iniciar el servidor backend
2. Las contraseñas se encriptan automáticamente, no envíes hashes
3. Los campos `_id` y `fechaCreacion` se generan automáticamente

## 👨‍💻 Autor

Desarrollado para Linares Colleges por dicasher10

## 📄 Licencia

ISC
