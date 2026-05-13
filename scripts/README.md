# 🧪 Scripts de Prueba - Linares Colleges

Esta carpeta contiene scripts PowerShell para realizar pruebas automatizadas de las diferentes funcionalidades del sistema.

## 📋 Scripts Disponibles

### Usuarios
- `test-crud-usuarios.ps1` - Pruebas completas del CRUD de usuarios
- `test-busqueda-usuarios.ps1` - Pruebas del sistema de búsqueda de usuarios
- `test-busqueda-backend.ps1` - Pruebas de búsqueda a nivel backend
- `test-busqueda-mejorada.ps1` - Versión mejorada de búsquedas

### Perfil
- `test-perfil-usuario.ps1` - Pruebas del perfil de usuario
- `test-editar-mi-perfil.ps1` - Pruebas de edición de perfil propio
- `test-editar-perfil-debug.ps1` - Versión debug para edición de perfil
- `test-mi-perfil-simple.ps1` - Pruebas simplificadas de perfil

### Noticias
- `test-noticias-admin.ps1` - Pruebas del panel admin de noticias
- `test-noticias-crear.ps1` - Pruebas de creación de noticias
- `test-noticias-con-imagenes.ps1` - Pruebas con imágenes base64
- `test-noticias-publicas.ps1` - Pruebas de noticias públicas
- `diagnostico-noticias.ps1` - Diagnóstico del sistema de noticias

### Entrenamientos
- `test-entrenamientos.ps1` - Pruebas básicas de entrenamientos
- `test-entrenamientos-con-nivel.ps1` - Pruebas con filtro por nivel
- `test-contenedores-dias.ps1` - Pruebas de contenedores por días
- `test-filtro-categorias.ps1` - Pruebas de filtros por categorías

### Sistema
- `verificar-sistema.ps1` - Verificación general del sistema completo

## 🚀 Uso

### Requisitos Previos
1. PowerShell 5.1 o superior
2. Backend ejecutándose en `http://localhost:3000`
3. MongoDB ejecutándose en `localhost:27017`

### Ejecutar un Script
```powershell
# Desde la raíz del proyecto
.\scripts\nombre-del-script.ps1

# O navega a la carpeta scripts
cd scripts
.\nombre-del-script.ps1
```

## 📝 Notas

- Los scripts realizan llamadas HTTP reales a la API
- Algunos scripts requieren credenciales de administrador
- Los datos de prueba se crean y eliminan automáticamente (cuando corresponde)
- Revisa la salida de cada script para verificar resultados

## ⚠️ Advertencias

- **No ejecutar en producción**: Estos scripts están diseñados para entornos de desarrollo
- **Datos de prueba**: Los scripts pueden crear, modificar o eliminar datos
- **Credenciales**: Las credenciales están hardcodeadas para testing, cámbialas en producción
