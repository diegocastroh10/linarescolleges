// Script de verificación de autenticación
// Ejecutar en la consola del navegador (F12)

console.log('%c=== VERIFICACIÓN DE AUTENTICACIÓN ===', 'color: cyan; font-size: 16px; font-weight: bold');

// 1. Verificar token en localStorage
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const currentUser = localStorage.getItem('currentUser');

console.log('\n%c1. Tokens en localStorage:', 'color: yellow; font-weight: bold');
console.log('  ✓ Access Token:', accessToken ? `${accessToken.substring(0, 30)}...` : '❌ NO ENCONTRADO');
console.log('  ✓ Refresh Token:', refreshToken ? `${refreshToken.substring(0, 30)}...` : '❌ NO ENCONTRADO');
console.log('  ✓ Usuario actual:', currentUser ? JSON.parse(currentUser).nombrePersonal : '❌ NO ENCONTRADO');

// 2. Verificar si el token es válido haciendo una petición
if (accessToken) {
  console.log('\n%c2. Verificando validez del token...', 'color: yellow; font-weight: bold');
  
  fetch('http://localhost:3000/api/usuarios/perfil', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  })
  .then(response => {
    if (response.ok) {
      console.log('  ✅ TOKEN VÁLIDO - La autenticación funciona correctamente');
      return response.json();
    } else if (response.status === 401) {
      console.log('  ❌ TOKEN INVÁLIDO O EXPIRADO');
      console.log('  ⚠️  SOLUCIÓN: Cerrar sesión y volver a iniciar sesión');
    } else {
      console.log(`  ❌ ERROR ${response.status}:`, response.statusText);
    }
  })
  .then(data => {
    if (data) {
      console.log('  Usuario autenticado:', data.usuario.nombrePersonal);
    }
  })
  .catch(error => {
    console.log('  ❌ ERROR DE RED:', error.message);
  });

  // 3. Probar búsqueda de usuario
  console.log('\n%c3. Probando búsqueda de usuario por RUT...', 'color: yellow; font-weight: bold');
  
  setTimeout(() => {
    fetch('http://localhost:3000/api/usuarios/rut/19133754-9', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      if (response.ok) {
        console.log('  ✅ BÚSQUEDA EXITOSA');
        return response.json();
      } else if (response.status === 401) {
        console.log('  ❌ ERROR 401: No autorizado');
        console.log('  ⚠️  El token no se está enviando o es inválido');
      } else if (response.status === 404) {
        console.log('  ❌ ERROR 404: Usuario no encontrado');
      } else {
        console.log(`  ❌ ERROR ${response.status}`);
      }
    })
    .then(data => {
      if (data) {
        console.log('  Usuario encontrado:', data.usuario.nombrePersonal);
      }
    })
    .catch(error => {
      console.log('  ❌ ERROR:', error.message);
    });
  }, 1000);

} else {
  console.log('\n%c❌ NO HAY TOKEN', 'color: red; font-weight: bold');
  console.log('  ⚠️  SOLUCIÓN: Debes iniciar sesión primero');
  console.log('  → Ve a: http://localhost:4200/login');
}

// 4. Instrucciones
console.log('\n%c=== SOLUCIONES ===', 'color: green; font-size: 14px; font-weight: bold');
console.log('Si el token no existe o es inválido:');
console.log('  1. Ve a: http://localhost:4200/login');
console.log('  2. Inicia sesión con: diegocastroh10@hotmail.com / D1eg0#');
console.log('  3. Vuelve a intentar la búsqueda');
console.log('\nSi el problema persiste:');
console.log('  1. Abre las DevTools (F12)');
console.log('  2. Ve a la pestaña Network');
console.log('  3. Intenta buscar un usuario');
console.log('  4. Verifica que el header "Authorization" esté presente en la petición');
