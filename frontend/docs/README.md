# 📚 Documentación Frontend - Linares Colleges

Esta carpeta contiene la documentación específica del frontend Angular.

## 📄 Documentos

- `PROYECTO_FRONTEND.md` - Documentación completa del proyecto frontend

## 🏗️ Arquitectura

El proyecto utiliza:
- **Angular 18.2.21** con Standalone Components
- **Signals API** para manejo de estado reactivo
- **Angular Universal** para Server-Side Rendering (SSR)
- **SCSS** para estilos
- **RouterLink** para navegación

## 📂 Estructura de Componentes

```
src/app/
├── core/              # Servicios, guards, interceptors
├── pages/             # Componentes de páginas
│   ├── admin/        # Panel administrativo
│   ├── inicio/       # Home page
│   ├── historia/     # Historia del club
│   ├── noticias/     # Noticias
│   └── ...
├── shared/           # Componentes compartidos
└── app.routes.ts     # Configuración de rutas
```

## 🎨 Convenciones de Estilo

- **Tema oscuro**: Fondo #0a0e27, tarjetas #1a1f3a
- **Gradientes**: Purple/Blue (#667eea, #764ba2)
- **Glass morphism**: backdrop-filter blur con transparencias
- **Responsive**: Breakpoints 1024px, 768px, 480px

## 🔗 Enlaces Útiles

- [Angular Docs](https://angular.dev/)
- [Angular Signals](https://angular.dev/guide/signals)
- [Angular SSR](https://angular.dev/guide/ssr)
