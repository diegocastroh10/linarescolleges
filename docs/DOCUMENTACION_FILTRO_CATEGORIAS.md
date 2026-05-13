# 🔍 Filtro de Categorías - Entrenamientos

## 📋 Resumen
Se ha implementado un filtro por categoría en la vista pública de entrenamientos que permite a los usuarios ver solo los entrenamientos de una categoría específica.

## ✨ Características del Filtro

### 🎯 Ubicación
- **Posición**: Antes de la sección "Niveles de Entrenamiento"
- **Visibilidad**: Siempre visible cuando hay contenido cargado
- **Accesibilidad**: No requiere autenticación (público)

### 🎨 Diseño Visual
- **Card blanca** con borde violeta sutil
- **Icono de embudo** (funnel) para representar el filtro
- **Select estilizado** con borde que cambia a violeta en focus/hover
- **Botón "Limpiar filtro"** en rojo que solo aparece cuando hay un filtro activo
- **Banner informativo** que muestra la categoría seleccionada actualmente

### 📱 Responsive
- **Desktop**: Select y botón en una fila
- **Mobile**: Select y botón apilados verticalmente (100% width)

## 🔧 Implementación Técnica

### Backend (sin cambios)
El filtrado se hace en el frontend usando los datos existentes de la API:
```
GET /api/entrenamientos/publico
```

### Frontend - Componente TypeScript

**Archivos modificados:**
- `entrenamientos.component.ts`
- `entrenamientos.component.html`
- `entrenamientos.component.scss`

**Signals agregados:**
```typescript
categoriaSeleccionada = signal<string>('todas');
```

**Constante CATEGORIAS:**
```typescript
readonly CATEGORIAS = [
  { valor: 'todas', label: 'Todas las categorías' },
  { valor: CategoriaEntrenamiento.U11_MIXTOS, label: 'U11 mixtos' },
  { valor: CategoriaEntrenamiento.U13_DAMAS, label: 'U13 damas' },
  { valor: CategoriaEntrenamiento.U13_VARONES, label: 'U13 varones' },
  { valor: CategoriaEntrenamiento.U15_DAMAS, label: 'U15 damas' },
  { valor: CategoriaEntrenamiento.U15_VARONES, label: 'U15 varones' },
  { valor: CategoriaEntrenamiento.U17_DAMAS, label: 'U17 damas' },
  { valor: CategoriaEntrenamiento.U17_VARONES, label: 'U17 varones' },
  { valor: CategoriaEntrenamiento.U21_VARONES, label: 'U21 varones' },
  { valor: CategoriaEntrenamiento.ADULTAS_DAMAS, label: 'Adultas damas' },
  { valor: CategoriaEntrenamiento.ADULTOS_VARONES, label: 'Adultos varones' }
];
```

**Método actualizado - obtenerEntrenamientosPorDia:**
```typescript
obtenerEntrenamientosPorDia(dia: DiaSemana): Entrenamiento[] {
  const categoria = this.categoriaSeleccionada();
  
  return this.entrenamientos()
    .filter(e => {
      const esMismoDia = e.dia === dia;
      
      if (categoria === 'todas') {
        return esMismoDia;
      } else {
        return esMismoDia && e.categorias.includes(categoria as CategoriaEntrenamiento);
      }
    })
    .sort((a, b) => {
      const horaA = a.horario.split('-')[0].split(':')[0];
      const horaB = b.horario.split('-')[0].split(':')[0];
      return parseInt(horaA) - parseInt(horaB);
    });
}
```

**Nuevos métodos:**
- `cambiarCategoria(categoria: string)`: Actualiza el signal
- `limpiarFiltro()`: Resetea a 'todas'

## 🎯 Lógica del Filtro

### Comportamiento:
1. **Por defecto**: Muestra todas las categorías ('todas')
2. **Al seleccionar una categoría**: Solo muestra entrenamientos que incluyan esa categoría en su array
3. **Entrenamientos con múltiples categorías**: Aparecen en CADA filtro de categoría correspondiente

### Ejemplo:
Si un entrenamiento tiene:
```json
{
  "dia": "Lunes",
  "categorias": ["U17 varones", "U21 varones"],
  "horario": "17:00-19:00"
}
```

Este entrenamiento aparecerá:
- ✅ En filtro "Todas las categorías"
- ✅ En filtro "U17 varones"
- ✅ En filtro "U21 varones"
- ❌ NO en otros filtros (ej: U13 damas)

## 🧪 Pruebas de Validación

### Script de Prueba
Se ha creado `test-filtro-categorias.ps1` que:
1. Crea 5 entrenamientos de prueba
2. Valida filtrado por diferentes categorías
3. Verifica conteos correctos

### Pruebas Manuales en Navegador

**URL**: `http://localhost:4200/entrenamientos`

**Pasos de validación:**

1. **Ver todos los entrenamientos**
   - Verificar que el select muestra "Todas las categorías"
   - Todos los entrenamientos deben estar visibles

2. **Filtrar por U17 varones**
   - Seleccionar "U17 varones" del dropdown
   - Verificar que aparece el banner: "Mostrando entrenamientos de: U17 varones"
   - Solo deben aparecer entrenamientos que incluyan U17 varones
   - Verificar botón "Limpiar filtro" visible

3. **Filtrar por U13 damas**
   - Seleccionar "U13 damas"
   - Solo deben aparecer entrenamientos con esa categoría
   - Días sin entrenamientos muestran "No hay entrenamientos programados"

4. **Limpiar filtro**
   - Click en "Limpiar filtro"
   - Debe volver a "Todas las categorías"
   - Banner informativo debe desaparecer
   - Todos los entrenamientos visibles nuevamente

5. **Categoría sin entrenamientos**
   - Seleccionar una categoría sin entrenamientos (ej: U15 damas si no hay)
   - Todos los días deben mostrar "No hay entrenamientos programados"

## 🎨 Elementos Visuales

### Select
- Border: `2px solid #e9ecef`
- Focus: Border violeta `#667eea` con shadow
- Hover: Border violeta
- Padding: `0.75rem 1rem`
- Border radius: `10px`

### Botón "Limpiar filtro"
- Gradiente rojo: `#dc3545 → #c82333`
- Icono: `bi-x-circle`
- Shadow en hover: elevación de 2px
- Solo visible cuando filtro activo

### Banner informativo
- Fondo: Gradiente azul-violeta suave
- Border izquierdo: 4px violeta
- Icono: `bi-filter-circle-fill`
- Animación: slideIn desde la izquierda

## 📊 Casos de Uso

### Usuario Nuevo Buscando Categoría
1. Entra a `/entrenamientos`
2. Ve el filtro prominente en la parte superior
3. Selecciona su categoría de edad (ej: U13 damas)
4. Ve solo horarios relevantes para su categoría
5. Puede cambiar fácilmente a otra categoría

### Padre Buscando Horario para Hijo
1. Identifica la categoría del hijo (ej: U11 mixtos)
2. Filtra por esa categoría
3. Ve todos los días y horarios disponibles
4. Verifica lugar y profesor

### Jugador con Múltiples Categorías
1. Selecciona su categoría principal
2. Ve sus entrenamientos
3. Limpia el filtro para ver si hay otros horarios que comparten categoría

## 🐛 Manejo de Edge Cases

### Sin entrenamientos en la BD
- Filtro sigue visible
- Mensaje: "No hay entrenamientos programados"
- Select funcional pero sin resultados

### Un solo entrenamiento total
- Filtro funciona normalmente
- Aparece en su categoría específica
- No aparece en otras categorías

### Entrenamiento con 5+ categorías
- Aparece en TODOS los filtros correspondientes
- No hay límite de categorías por entrenamiento

### Cambio rápido de categorías
- Signal reactivo: actualización instantánea
- Sin recargas de página
- Transiciones suaves

## 💡 Mejoras Futuras Potenciales

- [ ] Filtro múltiple (varias categorías a la vez)
- [ ] Filtro combinado con nivel (ej: U17 + Avanzado)
- [ ] Búsqueda por texto en observaciones
- [ ] Guardar filtro en localStorage
- [ ] Filtro por día de la semana
- [ ] Filtro por horario (mañana/tarde/noche)
- [ ] Contador de resultados por categoría en dropdown
- [ ] Animación en cambio de filtro

## 📱 Accesibilidad

- Label asociado al select
- Iconos descriptivos
- Contraste de colores WCAG AA
- Navegación por teclado funcional
- Focus visible en el select
- Mensajes informativos claros

## 🔍 Troubleshooting

### El filtro no aparece
- Verificar que `!cargando() && !error()` sea true
- Revisar consola del navegador
- Verificar imports de FormsModule

### El filtro no funciona
- Verificar que `categoriaSeleccionada` sea un signal
- Comprobar que `obtenerEntrenamientosPorDia` usa el signal
- Revisar array de categorías en entrenamientos

### Estilos no se aplican
- Verificar compilación de SCSS
- Revisar que las clases CSS coincidan
- Limpiar caché del navegador

### Botón limpiar no aparece
- Solo visible cuando `categoriaSeleccionada() !== 'todas'`
- Verificar directiva `@if` en el HTML

---

**Fecha de implementación**: 12 de enero de 2026
**Versión**: 1.0.0
**Estado**: ✅ Completado y probado
