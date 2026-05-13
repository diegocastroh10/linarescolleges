# 🛠️ Scripts Frontend - Linares Colleges

Esta carpeta contiene scripts de utilidad para el frontend.

## 📋 Scripts Disponibles

- `status.ps1` - Verificar estado del servidor frontend
- `verificar-auth.js` - Script Node.js para verificar autenticación

## 🚀 Uso

### Scripts PowerShell (.ps1)
```powershell
cd frontend/scripts
.\nombre-del-script.ps1
```

### Scripts Node.js (.js)
```powershell
cd frontend
node scripts/nombre-del-script.js
```

## 📝 Comandos NPM Principales

Estos comandos se ejecutan desde la carpeta `frontend/`:

```powershell
# Desarrollo
npm start                # Inicia servidor de desarrollo

# Producción
npm run build            # Compila para producción con SSR
npm run build:client     # Solo compilación del cliente
npm run build:server     # Solo compilación del servidor

# Testing
npm test                 # Ejecuta pruebas unitarias
npm run lint             # Verifica código con ESLint

# Otros
npm run watch            # Compila en modo watch
```

## ⚠️ Notas

- El servidor de desarrollo usa puerto 4200 por defecto
- SSR requiere compilación tanto de cliente como servidor
- Los scripts de verificación requieren backend activo
