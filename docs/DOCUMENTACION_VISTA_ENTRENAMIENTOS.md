# 📅 Visualización Pública de Entrenamientos

## 🎯 Descripción
Componente público que muestra los horarios de entrenamientos del club de forma atractiva y organizada. Los usuarios pueden ver todos los entrenamientos sin necesidad de iniciar sesión.

## ✨ Características Principales

### 🎨 Diseño Visual
- **Hero Header**: Encabezado impactante con gradiente violeta
- **Cards por Día**: 7 secciones organizadas por día de la semana
- **Gradientes Únicos**: Cada día tiene su propio esquema de color
- **Animaciones Suaves**: Transiciones y efectos hover modernos
- **Responsive**: Totalmente adaptable a móviles y tablets

### 📊 Información Mostrada
Cada entrenamiento muestra:
- ⏰ **Horario**: En formato destacado (ej: 17:00-19:00)
- 👥 **Categorías**: Múltiples categorías con badges (U11 mixtos, U13 damas, etc.)
- 📊 **Nivel**: Con badge de color según dificultad
  - 🟢 Verde: Principiante
  - 🟡 Amarillo: Intermedio  
  - 🔴 Rojo: Avanzado
- 📍 **Lugar**: Ubicación del entrenamiento
- 👨‍🏫 **Profesor**: Nombre del profesor a cargo
- 💬 **Observaciones**: Información adicional (si existe)

### 🎯 Leyenda de Niveles
Sección informativa al inicio que explica:
- **Principiante**: Sin experiencia requerida
- **Intermedio**: Conocimientos básicos necesarios
- **Avanzado**: Experiencia competitiva

### 🔄 Funcionalidades
- **Carga Automática**: Los datos se obtienen al cargar la página
- **Ordenamiento**: Entrenamientos ordenados por horario dentro de cada día
- **Estados de Carga**: Spinner animado mientras carga
- **Manejo de Errores**: Mensaje amigable con botón de reintentar
- **Sin Datos**: Mensaje informativo si no hay entrenamientos

## 🌐 Rutas y URLs

### Frontend
- **Ruta pública**: `http://localhost:4200/entrenamientos`
- **Componente**: `EntrenamientosComponent`
- **Ubicación**: `frontend/src/app/pages/entrenamientos/`

### Backend - Endpoints Públicos
Los siguientes endpoints NO requieren autenticación:

1. **Obtener todos los entrenamientos**
   ```
   GET http://localhost:3000/api/entrenamientos/publico
   ```
   Respuesta:
   ```json
   {
     "mensaje": "Entrenamientos obtenidos exitosamente",
     "cantidad": 5,
     "entrenamientos": [...]
   }
   ```

2. **Obtener entrenamientos por día**
   ```
   GET http://localhost:3000/api/entrenamientos/publico/dia/Lunes
   ```
   Valores válidos para :dia: `Lunes`, `Martes`, `Miércoles`, `Jueves`, `Viernes`, `Sábado`, `Domingo`

## 🎨 Colores por Día

| Día | Gradiente | Código |
|-----|-----------|--------|
| Lunes | Violeta → Púrpura | `#667eea → #764ba2` |
| Martes | Rosa → Rojo | `#f093fb → #f5576c` |
| Miércoles | Azul Cielo → Cyan | `#4facfe → #00f2fe` |
| Jueves | Verde → Turquesa | `#43e97b → #38f9d7` |
| Viernes | Rosa → Amarillo | `#fa709a → #fee140` |
| Sábado | Turquesa → Púrpura Oscuro | `#30cfd0 → #330867` |
| Domingo | Menta → Rosa Pastel | `#a8edea → #fed6e3` |

## 🔧 Estructura de Archivos

```
frontend/src/app/pages/entrenamientos/
├── entrenamientos.component.ts      # Lógica del componente
├── entrenamientos.component.html    # Template visual
└── entrenamientos.component.scss    # Estilos (520+ líneas)

frontend/src/app/core/services/
└── entrenamientos.service.ts        # Métodos públicos y protegidos

backend/src/controllers/
└── entrenamientos.controller.ts     # Endpoints públicos y privados
```

## 📱 Responsive Design

### Desktop (>768px)
- Máximo width: 1200px centrado
- Cards amplias con información extendida
- Grid de 3 columnas para badges de nivel

### Mobile (<768px)
- Diseño de una columna
- Header compacto
- Cards con información apilada verticalmente
- Badges de nivel en una columna

## 🚀 Uso

### Para Usuarios
1. Navegar a `http://localhost:4200/entrenamientos`
2. Ver todos los horarios organizados por día
3. Identificar nivel de cada entrenamiento
4. Sin necesidad de login

### Para Administradores
Los entrenamientos se gestionan desde:
- Panel admin: `http://localhost:4200/admin/entrenamientos`
- Los cambios se reflejan automáticamente en la vista pública

## 🎯 Casos de Uso

1. **Usuario Nuevo**: Busca entrenamientos para principiantes
   - Identifica fácilmente por badge verde
   - Lee observaciones para requisitos

2. **Jugador Experimentado**: Busca entrenamientos avanzados
   - Filtra visualmente por badge rojo
   - Verifica horarios disponibles

3. **Padre/Tutor**: Busca categoría específica para hijo
   - Encuentra U13 o U15 en badges de categoría
   - Verifica lugar y profesor a cargo

## 💡 Mejoras Futuras Sugeridas
- [ ] Filtro por categoría
- [ ] Filtro por nivel
- [ ] Filtro por día
- [ ] Búsqueda por profesor
- [ ] Exportar horario a PDF
- [ ] Integración con calendario (iCal)
- [ ] Notificaciones de cambios
- [ ] Vista de calendario mensual

## 🐛 Troubleshooting

**Problema**: No se cargan los entrenamientos
- **Solución**: Verificar que el backend esté corriendo en puerto 3000
- **Comando**: `cd backend && npm run dev`

**Problema**: Error 404 en la API
- **Solución**: Asegurarse de usar la ruta `/publico` en el servicio
- **Verificar**: `http://localhost:3000/api/entrenamientos/publico`

**Problema**: Estilos no se aplican
- **Solución**: Verificar que el archivo SCSS esté compilando
- **Revisar**: Consola del navegador para errores CSS

## 📝 Notas Técnicas

- **Signals**: Usa Angular Signals para reactividad
- **Standalone**: Componente standalone (no requiere módulo)
- **Lazy Loading**: Compatible con carga diferida
- **SEO Friendly**: Contenido accesible para crawlers
- **Performance**: Carga inicial <2MB, tiempo <500ms
- **Accesibilidad**: Iconos con semántica clara

---

**Última actualización**: 11 de enero de 2026
**Versión**: 1.0.0
**Autor**: Diego Castro
