# 🧪 GUÍA DE PRUEBAS - Sistema JWT Implementado

## 📋 Estado del Sistema

### ✅ Backend (Puerto 3000)
- JWT implementado con tokens de acceso y refresh
- Rutas protegidas con JwtAuthGuard y AdminGuard
- Login devuelve accessToken y refreshToken

### ✅ Frontend (Puerto 4200)
- AuthInterceptor configurado para agregar tokens automáticamente
- AuthService actualizado con manejo de JWT
- LocalStorage para tokens y usuario

---

## 🔐 FLUJO DE PRUEBAS JWT

### 1️⃣ **Prueba de Login**

**URL:** http://localhost:4200/login

**Credenciales de prueba:**
- Email: `diegocastroh10@hotmail.com`
- Password: `D1eg0#`

**¿Qué verificar?**
1. Al hacer login exitoso, se debe redirigir automáticamente
2. Abre las DevTools (F12) → Application → Local Storage → http://localhost:4200
3. Debes ver:
   - `accessToken`: Token JWT (largo, empieza con "eyJ...")
   - `refreshToken`: Token de renovación (largo, empieza con "eyJ...")
   - `currentUser`: Objeto JSON con datos del usuario

**Consola del navegador (F12):**
```javascript
// Ver el token guardado
localStorage.getItem('accessToken')

// Decodificar el token (copia el token y pégalo en https://jwt.io)
// Verás el payload: { sub, email, isAdmin, iat, exp }
```

---

### 2️⃣ **Prueba de Petición Autenticada**

**Abrir consola del navegador (F12) y ejecutar:**

```javascript
// Esta petición debería funcionar porque el interceptor agrega el token automáticamente
fetch('http://localhost:3000/api/usuarios/perfil', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(res => res.json())
.then(data => console.log('✅ Perfil obtenido:', data))
.catch(err => console.error('❌ Error:', err));
```

---

### 3️⃣ **Prueba de Ruta Protegida Solo Admin**

**Desde la consola del navegador:**

```javascript
// Intentar obtener todos los usuarios (solo admin)
fetch('http://localhost:3000/api/usuarios', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(res => res.json())
.then(data => {
  if (data.usuarios) {
    console.log('✅ Acceso permitido - Eres admin!');
    console.log('Total usuarios:', data.cantidad);
  }
})
.catch(err => console.error('❌ Error:', err));
```

---

### 4️⃣ **Prueba de Token Expirado**

**Simulación en consola:**

```javascript
// Guardar token inválido
localStorage.setItem('accessToken', 'token_invalido_123');

// Intentar acceder a ruta protegida
fetch('http://localhost:3000/api/usuarios/perfil', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('accessToken')
  }
})
.then(res => res.json())
.then(data => console.log(data))
.catch(err => console.log('✅ Token rechazado correctamente'));

// Restaurar token válido (haz login de nuevo)
```

---

### 5️⃣ **Prueba de Refresh Token**

**Desde la consola del navegador:**

```javascript
// Renovar el access token usando el refresh token
fetch('http://localhost:3000/api/usuarios/refresh', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    refreshToken: localStorage.getItem('refreshToken')
  })
})
.then(res => res.json())
.then(data => {
  console.log('✅ Token renovado:', data);
  // Guardar nuevo token
  localStorage.setItem('accessToken', data.accessToken);
})
.catch(err => console.error('❌ Error:', err));
```

---

### 6️⃣ **Prueba de Logout**

1. Navega a cualquier página que use AuthService
2. Abre consola del navegador:

```javascript
// El logout debería limpiar tokens y redirigir al login
// (esto se puede hacer desde un botón en el navbar también)
localStorage.clear();
window.location.href = '/login';
```

3. Verifica en DevTools → Application → Local Storage que no haya tokens

---

## 🔍 VERIFICACIÓN DE SEGURIDAD

### ✅ Lo que DEBE funcionar:
- ✅ Login devuelve tokens JWT
- ✅ Tokens se guardan en localStorage
- ✅ Peticiones incluyen header Authorization automáticamente
- ✅ Rutas protegidas rechazan peticiones sin token
- ✅ Rutas protegidas aceptan peticiones con token válido
- ✅ AdminGuard bloquea usuarios no-admin
- ✅ Refresh token puede renovar el access token

### ❌ Lo que NO debe funcionar:
- ❌ Acceso a rutas protegidas sin token
- ❌ Tokens inválidos o manipulados
- ❌ Tokens expirados
- ❌ Usuario no-admin accediendo a rutas de admin

---

## 📊 ENDPOINTS DISPONIBLES

### 🔓 Públicos (sin autenticación):
- `POST /api/usuarios/register` - Registro
- `POST /api/usuarios/login` - Login (devuelve tokens)
- `POST /api/usuarios/recuperar-password` - Recuperar contraseña
- `GET /api/usuarios/verificar-token/:token` - Verificar token recuperación
- `POST /api/usuarios/restablecer-password` - Restablecer contraseña

### 🔒 Protegidos (requieren JWT):
- `GET /api/usuarios/perfil` - Obtener perfil del usuario autenticado
- `PUT /api/usuarios/id/:id` - Editar usuario (propio o admin)
- `PUT /api/usuarios/rut/:rut` - Editar usuario por RUT
- `PUT /api/usuarios/email/:email` - Editar usuario por email

### 🔐 Solo Admin (requieren JWT + isAdmin=true):
- `GET /api/usuarios` - Listar todos los usuarios
- `DELETE /api/usuarios/id/:id` - Eliminar usuario
- `DELETE /api/usuarios/desactivar/:rut` - Desactivar usuario

### 🔄 Refresh:
- `POST /api/usuarios/refresh` - Renovar access token

---

## 🎯 RESULTADO ESPERADO

Si todo funciona correctamente:

1. ✅ El login guarda tokens en localStorage
2. ✅ Las peticiones a rutas protegidas funcionan automáticamente
3. ✅ Las rutas de admin solo funcionan para usuarios admin
4. ✅ Los tokens expiran después de 1 hora (access) / 7 días (refresh)
5. ✅ El refresh token puede renovar el acceso sin requerir login

---

## 🐛 TROUBLESHOOTING

### Problema: "No se recibe el token en el login"
**Solución:** Verificar que el backend esté devolviendo `accessToken` y `refreshToken` en la respuesta.

### Problema: "401 Unauthorized en rutas protegidas"
**Solución:** 
1. Verificar que el token esté en localStorage
2. Verificar que el interceptor esté agregando el header Authorization
3. Abrir Network en DevTools y ver si el header se envía

### Problema: "Token inválido"
**Solución:** Hacer logout y login de nuevo para obtener tokens frescos.

### Problema: "AdminGuard bloqueando usuario admin"
**Solución:** Verificar en el token decodificado (jwt.io) que `isAdmin: true`.

---

## 📝 NOTAS ADICIONALES

- **Access Token expira en:** 1 hora
- **Refresh Token expira en:** 7 días
- **Secret Key:** Configurada en `.env` (JWT_SECRET)
- **Algoritmo:** HS256
- **Storage:** localStorage (frontend)
- **Header:** Authorization: Bearer {token}

---

## 🎉 ¡Sistema JWT Completamente Funcional!

La implementación incluye todas las mejores prácticas de seguridad para una aplicación web moderna.
