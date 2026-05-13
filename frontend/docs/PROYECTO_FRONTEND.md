# Linares Colleges - Frontend Angular 18

## 🎯 Proyecto Implementado

Aplicación frontend moderna y responsiva para el club de baloncesto Linares Colleges, desarrollada con **Angular 18** y las últimas características del framework.

## ✅ Características Implementadas

### 🏗️ Arquitectura
- ✅ **Angular CLI 18** - Última versión
- ✅ **Componentes Standalone** - Nueva arquitectura sin módulos
- ✅ **Signals** - Sistema reactivo de Angular 18
- ✅ **App Routes** - Routing con lazy loading
- ✅ **SCSS** - Estilos con preprocesador
- ✅ **TypeScript** - Tipado fuerte

### 🔐 Autenticación y Servicios
- ✅ **AuthService** con Signals
  - Login/Logout
  - Registro de usuarios
  - Estado de autenticación reactivo
  - LocalStorage para persistencia
  
- ✅ **UsuariosService**
  - CRUD completo de usuarios
  - Integración con backend NestJS

- ✅ **AuthGuard**
  - Protección de rutas privadas
  - Redirección automática

### 🧩 Componentes Compartidos

#### Navbar Component ✅
- ✅ Diseño responsive (mobile + desktop)
- ✅ Menú hamburguesa para móvil
- ✅ Navegación horizontal en escritorio
- ✅ Botón de login/logout dinámico
- ✅ Muestra nombre de usuario logueado
- ✅ Animaciones suaves

#### Footer Component ✅
- ✅ Diseño horizontal responsive
- ✅ Enlaces a páginas principales
- ✅ Redes sociales
- ✅ Sección de auspiciadores
- ✅ Copyright dinámico

### 📄 Páginas

#### Estructuras Creadas ✅
- ✅ Inicio
- ✅ Login & Register
- ✅ Entrenamientos
- ✅ Galerías
- ✅ Noticias
- ✅ Historia  
- ✅ Mi Perfil (protegida por guard)

### 🎨 Estilos Globales
- ✅ Variables CSS personalizadas
- ✅ Paleta de colores del club
- ✅ Componentes base (botones, formularios, cards)
- ✅ Sistema de alertas
- ✅ Diseño responsive mobile-first

### 🔌 Integración Backend
- ✅ HttpClient configurado
- ✅ API URL configurada (localhost:3000)
- ✅ Modelos TypeScript (Usuario, LoginRequest, etc.)
- ✅ Interceptores preparados

## 🚀 Cómo Ejecutar

### 1. Instalar Dependencias
```bash
cd frontend
npm install
```

### 2. Ejecutar Servidor de Desarrollo
```bash
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

### 3. Ejecutar Backend (en otra terminal)
```bash
cd backend
npm start
```

## 📋 Comandos Útiles

```bash
# Desarrollo
ng serve                    # Ejecutar en modo desarrollo
ng serve --open            # Abrir en navegador automáticamente

# Build
ng build                   # Compilar para producción
ng build --configuration production

# Tests
ng test                    # Ejecutar tests unitarios
ng e2e                     # Ejecutar tests end-to-end
```

## 🛣️ Rutas Configuradas

| Ruta | Componente | Protegida | Descripción |
|------|-----------|-----------|-------------|
| `/` | - | No | Redirige a /inicio |
| `/inicio` | InicioComponent | No | Página principal |
| `/login` | LoginComponent | No | Iniciar sesión |
| `/register` | RegisterComponent | No | Registro de usuarios |
| `/entrenamientos` | EntrenamientosComponent | No | Información de entrenamientos |
| `/galerias` | GaleriasComponent | No | Galería de fotos |
| `/noticias` | NoticiasComponent | No | Noticias del club |
| `/historia` | HistoriaComponent | No | Historia del club |
| `/perfil` | PerfilComponent | **Sí** | Perfil del usuario (requiere login) |

## 📦 Estructura de Archivos

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   ├── guards/
│   │   │   │   └── auth.guard.ts                 ✅
│   │   │   ├── models/
│   │   │   │   └── usuario.model.ts             ✅
│   │   │   └── services/
│   │   │       ├── auth.service.ts              ✅
│   │   │       └── usuarios.service.ts          ✅
│   │   ├── pages/
│   │   │   ├── inicio/                          ✅
│   │   │   ├── login/                           ✅
│   │   │   ├── register/                        ✅
│   │   │   ├── entrenamientos/                  ✅
│   │   │   ├── galerias/                        ✅
│   │   │   ├── noticias/                        ✅
│   │   │   ├── historia/                        ✅
│   │   │   └── perfil/                          ✅
│   │   ├── shared/
│   │   │   ├── navbar/                          ✅
│   │   │   └── footer/                          ✅
│   │   ├── app.component.ts                     ✅
│   │   ├── app.config.ts                        ✅
│   │   └── app.routes.ts                        ✅
│   ├── styles.scss                              ✅
│   └── index.html
└── package.json

✅ = Implementado
⚠️ = Pendiente contenido/lógica
```

## 🎨 Paleta de Colores

```scss
// Colores principales
$primary: #3498db;      // Azul
$secondary: #f39c12;    // Naranja/Dorado
$success: #27ae60;      // Verde
$danger: #e74c3c;       // Rojo
$dark: #1a1a2e;         // Azul oscuro
$light: #ecf0f1;        // Gris claro

// Fondos
$bg-primary: #f5f7fa;
$bg-dark: #0f1419;
$bg-card: #ffffff;
```

## 🔄 Signals de Angular 18

El proyecto utiliza el nuevo sistema de **Signals** para manejo de estado reactivo:

```typescript
// Ejemplo en AuthService
currentUser = signal<Usuario | null>(null);
isAuthenticated = computed(() => this.currentUser() !== null);
isAdmin = computed(() => this.currentUser()?.isAdmin ?? false);
```

## 📱 Responsive Design

La aplicación está optimizada para:
- 📱 **Mobile**: < 768px
- 💻 **Tablet**: 768px - 1024px
- 🖥️ **Desktop**: > 1024px

## 🔌 Endpoints Backend Integrados

```typescript
API_URL = 'http://localhost:3000/api/usuarios'

// Autenticación
POST /login
POST /register

// Usuarios
GET  /
GET  /id/:id
GET  /rut/:rut
PUT  /id/:id
DELETE /id/:id
```

## ⚠️ Pendiente de Implementar

Para completar las páginas, necesitas agregar el HTML y lógica específica para:

1. **Login Component** - Formulario de inicio de sesión
2. **Register Component** - Formulario de registro completo
3. **Perfil Component** - Ver y editar datos del usuario
4. **Inicio Component** - Página de bienvenida
5. **Entrenamientos Component** - Horarios y ubicaciones
6. **Galerías Component** - Fotos del equipo
7. **Noticias Component** - Blog/noticias
8. **Historia Component** - Historia del club

## 🚦 Próximos Pasos

1. ✅ Estructura base creada
2. ✅ Servicios y guards implementados
3. ✅ Navbar y Footer responsivos
4. ✅ Routing configurado
5. ⚠️ Completar HTML/lógica de páginas
6. ⚠️ Agregar validaciones de formularios
7. ⚠️ Implementar manejo de errores
8. ⚠️ Agregar loading states
9. ⚠️ Tests unitarios

## 💡 Características de Angular 18 Utilizadas

- ✅ **Standalone Components** - No requiere NgModules
- ✅ **Signals** - Reactividad mejorada
- ✅ **Inject function** - Inyección de dependencias moderna
- ✅ **Control Flow** - @if, @for (nueva sintaxis)
- ✅ **provideHttpClient** - Nueva forma de configurar HTTP
- ✅ **Function Guards** - Guards como funciones
- ✅ **Lazy Loading** - Carga diferida de componentes

## 📝 Notas de Desarrollo

- El proyecto usa **SSR** (Server-Side Rendering) habilitado
- Los formularios utilizan **Reactive Forms**
- La autenticación persiste en **localStorage**
- Todos los componentes son **standalone**
- Se usa **SCSS** para estilos anidados

## 🤝 Integración con Backend

El frontend está configurado para comunicarse con el backend NestJS:

```typescript
// Configuración en AuthService
private readonly API_URL = 'http://localhost:3000/api/usuarios';
```

Asegúrate de que el backend esté corriendo en el puerto 3000.

## 📄 Licencia

ISC

## 👨‍💻 Desarrollo

Desarrollado para Linares Colleges - Club de Baloncesto

---

**Nota**: Este proyecto está en desarrollo activo. Las páginas individuales necesitan contenido específico según los requerimientos del club.
