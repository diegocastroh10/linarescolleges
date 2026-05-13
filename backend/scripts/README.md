# 🛠️ Scripts Backend - Linares Colleges

Esta carpeta contiene scripts de utilidad para administración del backend.

## 📋 Scripts Disponibles

### Administración de Usuarios
- `crear-admin.ps1` - Crear usuario administrador
- `actualizar-password-admin.ps1` - Actualizar contraseña de admin
- `actualizar-rol-admin.js` - Script Node.js para cambiar roles
- `actualizar-rol-administrador.js` - Versión alternativa de actualización de roles
- `actualizar-password-administrador.js` - Script Node.js para contraseñas
- `temp-crear-admin.ps1` - Script temporal de creación de admin

### Testing
- `test-api.ps1` - Pruebas de endpoints de la API
- `test-email-config.js` - Verificación de configuración de email

## 🚀 Uso

### Scripts PowerShell (.ps1)
```powershell
cd backend/scripts
.\nombre-del-script.ps1
```

### Scripts Node.js (.js)
```powershell
cd backend
node scripts/nombre-del-script.js
```

## ⚠️ Requisitos

- Backend debe estar corriendo para algunos scripts
- MongoDB debe estar activo
- Variables de entorno configuradas en `.env`

## 📝 Notas

- Los scripts de administración modifican la base de datos directamente
- Usar con precaución en entornos de producción
- Mantener credenciales seguras
