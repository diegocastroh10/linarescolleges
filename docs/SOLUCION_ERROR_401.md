# SOLUCIÓN ERROR 401: Unauthorized

## Problema
Al buscar usuarios por RUT o email, aparece el error:
```json
{
  "message": "Unauthorized",
  "statusCode": 401
}
```

## Causa
El error 401 significa que **no estás autenticado** o **tu token JWT expiró**. Esto puede ocurrir porque:
- No has iniciado sesión
- El token JWT expiró (duran 1 hora)
- El localStorage se borró
- Refrescaste la página y el token se perdió

## Solución Inmediata

### Opción 1: Iniciar Sesión Nuevamente
1. **Ve a la página de login**: http://localhost:4200/login
2. **Inicia sesión** con las credenciales de superadmin:
   - Email: `diegocastroh10@hotmail.com`
   - Password: `D1eg0#`
3. **Navega al panel de usuarios**: http://localhost:4200/admin/usuarios
4. **Intenta buscar** nuevamente por RUT o email

### Opción 2: Verificar Estado de Autenticación
1. **Abre las DevTools** (F12 en el navegador)
2. **Ve a la pestaña Console**
3. **Copia y pega** el siguiente código:

```javascript
// Verificar tokens
console.log('Token:', localStorage.getItem('accessToken'));
console.log('Usuario:', localStorage.getItem('currentUser'));
```

4. **Resultados**:
   - Si ambos son `null` → **Debes iniciar sesión**
   - Si el token existe pero obtienes 401 → **El token expiró, cierra sesión e inicia sesión nuevamente**

### Opción 3: Limpiar y Reiniciar Sesión
Si el problema persiste:

1. **Abre la consola** (F12)
2. **Ejecuta estos comandos**:
```javascript
localStorage.clear();
location.reload();
```
3. **Inicia sesión nuevamente**

## Verificación de que el Interceptor Funciona

Para verificar que el interceptor está agregando el token correctamente:

1. **Abre las DevTools** (F12)
2. **Ve a la pestaña Network**
3. **Intenta buscar un usuario** por RUT o email
4. **Haz clic en la petición** a `/api/usuarios/rut/...` o `/api/usuarios/email/...`
5. **Ve a la pestaña Headers**
6. **Busca "Request Headers"**
7. **Verifica que exista**:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

### Resultado Esperado:
- ✅ Si el header "Authorization" está presente → **El interceptor funciona**
- ❌ Si NO está presente → **Hay un problema con el interceptor**

## Causa Técnica

El interceptor de autenticación (`authInterceptor`) debe agregar automáticamente el header `Authorization: Bearer <token>` a todas las peticiones excepto las rutas públicas:
- `/login`
- `/register`
- `/recuperar-password`
- `/restablecer-password`
- `/verificar-token`

Si el token no está en el localStorage o expiró, el backend responde con 401.

## Usuarios de Prueba

Para realizar pruebas, puedes usar cualquiera de estos usuarios:

### Superadmin
- Email: `diegocastroh10@hotmail.com`
- Password: `D1eg0#`
- RUT: `19133754-9`
- **Permisos**: Todos (CRUD usuarios, asignar roles, desactivar cuentas)

### Administrador
- Email: `clublinarescolleges@gmail.com`
- Password: `Admin2024#`
- RUT: `65082894-1`
- **Permisos**: Ver usuarios (solo lectura)

### Persona
- Email: `persona@test.com`
- Password: `Test123#`
- RUT: `11111111-1`
- **Permisos**: Solo su propio perfil

## Pruebas Backend Directas

Si quieres verificar que el backend funciona correctamente, ejecuta este script en PowerShell:

```powershell
# Login
$loginBody = @{
    email = "diegocastroh10@hotmail.com"
    password = "D1eg0#"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.accessToken

Write-Host "Token obtenido: $($token.Substring(0, 30))..."

# Buscar usuario
$headers = @{
    "Authorization" = "Bearer $token"
}

$usuario = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/rut/19133754-9" -Method GET -Headers $headers
Write-Host "Usuario encontrado: $($usuario.usuario.nombrePersonal)"
```

**Resultado esperado**: Debería mostrar "Usuario encontrado: Diego Castro Herrera"

## Resumen

**El problema es de autenticación, no del buscador.**

**Solución rápida**:
1. Ve a http://localhost:4200/login
2. Inicia sesión con `diegocastroh10@hotmail.com` / `D1eg0#`
3. Navega a http://localhost:4200/admin/usuarios
4. Busca por RUT: `191337549` o `19133754-9` o email: `persona@test.com`

Si después de iniciar sesión el problema persiste, verifica en Network (F12) que el header Authorization se esté enviando.
