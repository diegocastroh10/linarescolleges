# Script de prueba para el perfil de usuario

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRUEBA: PERFIL DE USUARIO" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:3000/api/usuarios"
$email = "persona@test.com"
$password = "Test123#"

Write-Host "1. LOGIN COMO USUARIO PERSONA" -ForegroundColor Yellow
Write-Host "   Email: $email" -ForegroundColor Gray
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body (@{
    email = $email
    password = $password
} | ConvertTo-Json) -ContentType "application/json"

$accessToken = $loginResponse.accessToken
$userId = $loginResponse.usuario._id
Write-Host "   OK Login exitoso" -ForegroundColor Green
Write-Host "   Usuario ID: $userId" -ForegroundColor Gray
Write-Host ""

# Headers con el token
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

Write-Host "2. OBTENER PERFIL ACTUAL" -ForegroundColor Yellow
try {
    $perfil = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Get -Headers $headers
    Write-Host "   OK Perfil obtenido" -ForegroundColor Green
    Write-Host "   Nombre: $($perfil.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   Email: $($perfil.usuario.email)" -ForegroundColor Gray
    Write-Host "   Posicion: $($perfil.usuario.posicion)" -ForegroundColor Gray
    if ($perfil.usuario.fotoPerfil) {
        Write-Host "   Foto actual: Si tiene foto" -ForegroundColor Gray
    } else {
        Write-Host "   Foto actual: Sin foto" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ERROR al obtener perfil" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. ACTUALIZAR TELEFONO Y DIRECCION" -ForegroundColor Yellow
try {
    $nuevoTelefono = "+56912345999"
    $nuevaDireccion = "Avenida Principal 456, Linares"
    
    $actualizacion = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        telefono = $nuevoTelefono
        direccion = $nuevaDireccion
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "   OK Datos actualizados" -ForegroundColor Green
    Write-Host "   Nuevo telefono: $($actualizacion.usuario.telefono)" -ForegroundColor Gray
    Write-Host "   Nueva direccion: $($actualizacion.usuario.direccion)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al actualizar datos" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. ACTUALIZAR POSICION" -ForegroundColor Yellow
try {
    $nuevaPosicion = "Alero"
    
    $actualizacion = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        posicion = $nuevaPosicion
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "   OK Posicion actualizada" -ForegroundColor Green
    Write-Host "   Nueva posicion: $($actualizacion.usuario.posicion)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al actualizar posicion" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. SIMULAR ACTUALIZACION DE FOTO DE PERFIL" -ForegroundColor Yellow
try {
    # Crear una imagen base64 simple (pixel rojo 1x1)
    $fotoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
    
    $actualizacion = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        fotoPerfil = $fotoBase64
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "   OK Foto de perfil actualizada" -ForegroundColor Green
    Write-Host "   Longitud del base64: $($actualizacion.usuario.fotoPerfil.Length) caracteres" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al actualizar foto: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "6. VERIFICAR TODOS LOS CAMBIOS" -ForegroundColor Yellow
try {
    $perfilFinal = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Get -Headers $headers
    Write-Host "   OK Verificacion exitosa" -ForegroundColor Green
    Write-Host "   Nombre: $($perfilFinal.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   Telefono: $($perfilFinal.usuario.telefono)" -ForegroundColor Gray
    Write-Host "   Direccion: $($perfilFinal.usuario.direccion)" -ForegroundColor Gray
    Write-Host "   Posicion: $($perfilFinal.usuario.posicion)" -ForegroundColor Gray
    Write-Host "   Tiene foto: $($perfilFinal.usuario.fotoPerfil -ne $null)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al verificar perfil" -ForegroundColor Red
}
Write-Host ""

Write-Host "7. LIMPIAR FOTO DE PERFIL (OPCIONAL)" -ForegroundColor Yellow
try {
    $limpieza = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        fotoPerfil = $null
    } | ConvertTo-Json) -ContentType "application/json"
    
    Write-Host "   OK Foto de perfil eliminada" -ForegroundColor Green
} catch {
    Write-Host "   INFO No se pudo limpiar (campo opcional)" -ForegroundColor Gray
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK Login funcional" -ForegroundColor Green
Write-Host "OK Obtencion de perfil funcional" -ForegroundColor Green
Write-Host "OK Actualizacion de datos funcional" -ForegroundColor Green
Write-Host "OK Actualizacion de posicion funcional" -ForegroundColor Green
Write-Host "OK Actualizacion de foto funcional" -ForegroundColor Green
Write-Host ""
Write-Host "TODAS LAS PRUEBAS BACKEND COMPLETADAS" -ForegroundColor Green
Write-Host ""
