# 🤝 Guía de Contribución - Linares Colleges

Gracias por tu interés en contribuir al proyecto Linares Colleges. Esta guía te ayudará a comenzar.

## 📋 Tabla de Contenidos

- [Configuración del Entorno](#configuración-del-entorno)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Convenciones de Código](#convenciones-de-código)
- [Proceso de Contribución](#proceso-de-contribución)
- [Pruebas](#pruebas)

## 🔧 Configuración del Entorno

### Requisitos Previos

- Node.js v20 o superior
- Docker Desktop (para MongoDB)
- Git
- PowerShell 5.1+ (para scripts de prueba)

### Instalación

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/tu-usuario/linarescolleges.git
   cd linarescolleges
   ```

2. **Configurar MongoDB con Docker**
   ```bash
   docker run -d --name mongodb-linarescolleges -p 27017:27017 \
     -e MONGO_INITDB_ROOT_USERNAME=admin \
     -e MONGO_INITDB_ROOT_PASSWORD="Linare$2026" \
     -e MONGO_INITDB_DATABASE=db-linarescolleges \
     mongo:latest
   ```

3. **Configurar Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env
   # Editar .env con tus configuraciones
   npm run start:dev
   ```

4. **Configurar Frontend**
   ```bash
   cd frontend
   npm install
   npm start
   ```

## 📂 Estructura del Proyecto

```
linarescolleges/
├── backend/          # API NestJS
├── frontend/         # App Angular
├── docs/             # Documentación general
└── scripts/          # Scripts de prueba
```

Ver `README.md` para más detalles.

## 💻 Convenciones de Código

### TypeScript

- **Indentación**: 2 espacios
- **Comillas**: Simples (`'`)
- **Punto y coma**: Siempre al final
- **Nombres de archivos**: kebab-case (ej: `mi-componente.ts`)

### Angular

- **Componentes**: Standalone components
- **Estado**: Usar Signals cuando sea posible
- **Estilos**: SCSS con variables globales
- **Rutas**: Lazy loading para todos los módulos

### NestJS

- **Decoradores**: Un decorador por línea
- **DTOs**: Usar class-validator para validaciones
- **Servicios**: Inyección de dependencias con constructor
- **Controladores**: RESTful endpoints

### Git Commits

Formato de mensajes de commit:

```
tipo(alcance): descripción corta

[cuerpo opcional]

[footer opcional]
```

**Tipos**:
- `feat`: Nueva funcionalidad
- `fix`: Corrección de bug
- `docs`: Cambios en documentación
- `style`: Formato, punto y coma, etc (no afecta código)
- `refactor`: Refactorización de código
- `test`: Agregar o corregir pruebas
- `chore`: Tareas de mantenimiento

**Ejemplos**:
```
feat(noticias): agregar sistema de comentarios
fix(auth): corregir validación de JWT expirado
docs(readme): actualizar instrucciones de instalación
```

## 🔄 Proceso de Contribución

1. **Crear una rama**
   ```bash
   git checkout -b tipo/descripcion-corta
   # Ejemplos:
   # git checkout -b feat/sistema-comentarios
   # git checkout -b fix/validacion-formulario
   ```

2. **Hacer cambios**
   - Escribe código limpio y documentado
   - Sigue las convenciones establecidas
   - Agrega pruebas si es aplicable

3. **Commit de cambios**
   ```bash
   git add .
   git commit -m "tipo(alcance): descripción"
   ```

4. **Push a tu rama**
   ```bash
   git push origin tipo/descripcion-corta
   ```

5. **Crear Pull Request**
   - Describe los cambios realizados
   - Referencia issues relacionados
   - Asegúrate de que pasen todas las pruebas

## 🧪 Pruebas

### Backend

```bash
cd backend
npm run test          # Unit tests
npm run test:e2e      # E2E tests
npm run test:cov      # Coverage
```

### Frontend

```bash
cd frontend
npm test              # Unit tests
npm run test:e2e      # E2E tests (si están configurados)
```

### Scripts de Prueba

```bash
# Desde la raíz
.\scripts\verificar-sistema.ps1
.\scripts\test-crud-usuarios.ps1
```

## 📝 Documentación

- Documenta nuevas funcionalidades en `/docs`
- Actualiza README.md si cambias estructura
- Comenta código complejo
- Usa JSDoc para funciones públicas

## ❓ Preguntas

Si tienes preguntas:
- Revisa la documentación en `/docs`
- Crea un issue en GitHub
- Contacta al equipo de desarrollo

## 📜 Código de Conducta

- Sé respetuoso y profesional
- Acepta críticas constructivas
- Enfócate en lo mejor para el proyecto
- Ayuda a otros colaboradores

## 🙏 Agradecimientos

Gracias por contribuir a Linares Colleges. Cada contribución, grande o pequeña, es valiosa para el proyecto.
