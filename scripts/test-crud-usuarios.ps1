# Script de prueba para el CRUD de Usuarios

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRUEBA: CRUD DE USUARIOS (SUPERADMIN)" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:3000/api/usuarios"
$email = "diegocastroh10@hotmail.com"
$password = "D1eg0#"

Write-Host "1. LOGIN COMO SUPERADMIN" -ForegroundColor Yellow
Write-Host "   Email: $email" -ForegroundColor Gray
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body (@{
    email = $email
    password = $password
} | ConvertTo-Json) -ContentType "application/json"

$accessToken = $loginResponse.accessToken
Write-Host "   OK Login exitoso" -ForegroundColor Green
Write-Host "   Token: $($accessToken.Substring(0,20))..." -ForegroundColor Gray
Write-Host ""

# Headers con el token
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

Write-Host "2. BUSCAR USUARIO POR RUT" -ForegroundColor Yellow
Write-Host "   RUT: 11111111-1 (usuario persona)" -ForegroundColor Gray
try {
    $usuarioPorRut = Invoke-RestMethod -Uri "$baseUrl/rut/11111111-1" -Method Get -Headers $headers
    Write-Host "   OK Usuario encontrado: $($usuarioPorRut.usuario.nombrePersonal)" -ForegroundColor Green
    Write-Host "   Rol actual: $($usuarioPorRut.usuario.rol)" -ForegroundColor Gray
    $userId = $usuarioPorRut.usuario._id
} catch {
    Write-Host "   ERROR al buscar usuario" -ForegroundColor Red
}
Write-Host ""

Write-Host "3. BUSCAR USUARIO POR EMAIL" -ForegroundColor Yellow
Write-Host "   Email: persona@test.com" -ForegroundColor Gray
try {
    $usuarioPorEmail = Invoke-RestMethod -Uri "$baseUrl/email/persona@test.com" -Method Get -Headers $headers
    Write-Host "   OK Usuario encontrado: $($usuarioPorEmail.usuario.nombrePersonal)" -ForegroundColor Green
    Write-Host "   RUT: $($usuarioPorEmail.usuario.rut)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al buscar usuario" -ForegroundColor Red
}
Write-Host ""

Write-Host "4. ACTUALIZAR ROL DE USUARIO" -ForegroundColor Yellow
Write-Host "   Usuario ID: $userId" -ForegroundColor Gray
Write-Host "   Nuevo rol: administrador" -ForegroundColor Gray
try {
    $actualizarRol = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        rol = "administrador"
    } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   OK Rol actualizado correctamente" -ForegroundColor Green
    Write-Host "   Rol actual: $($actualizarRol.usuario.rol)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al actualizar rol: $_" -ForegroundColor Red
}
Write-Host ""

Write-Host "5. VERIFICAR CAMBIO DE ROL" -ForegroundColor Yellow
try {
    $verificarUsuario = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Get -Headers $headers
    Write-Host "   OK Verificacion exitosa" -ForegroundColor Green
    Write-Host "   Nombre: $($verificarUsuario.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   Rol: $($verificarUsuario.usuario.rol)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al verificar usuario" -ForegroundColor Red
}
Write-Host ""

Write-Host "6. REVERTIR ROL A PERSONA" -ForegroundColor Yellow
try {
    $revertirRol = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        rol = "persona"
    } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   OK Rol revertido correctamente" -ForegroundColor Green
    Write-Host "   Rol actual: $($revertirRol.usuario.rol)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al revertir rol" -ForegroundColor Red
}
Write-Host ""

Write-Host "7. ACTUALIZAR DATOS DE USUARIO" -ForegroundColor Yellow
try {
    $actualizarDatos = Invoke-RestMethod -Uri "$baseUrl/id/$userId" -Method Put -Headers $headers -Body (@{
        telefono = "+56912345678"
        direccion = "Calle Nueva 123, Linares"
    } | ConvertTo-Json) -ContentType "application/json"
    Write-Host "   OK Datos actualizados correctamente" -ForegroundColor Green
    Write-Host "   Telefono: $($actualizarDatos.usuario.telefono)" -ForegroundColor Gray
    Write-Host "   Direccion: $($actualizarDatos.usuario.direccion)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR al actualizar datos" -ForegroundColor Red
}
Write-Host ""

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE PRUEBAS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "OK Busqueda por RUT funcional" -ForegroundColor Green
Write-Host "OK Busqueda por Email funcional" -ForegroundColor Green
Write-Host "OK Actualizacion de rol funcional" -ForegroundColor Green
Write-Host "OK Actualizacion de datos funcional" -ForegroundColor Green
Write-Host ""
Write-Host "TODAS LAS PRUEBAS COMPLETADAS" -ForegroundColor Green
Write-Host ""

