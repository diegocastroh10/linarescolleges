# Script de prueba para búsqueda de usuarios
$baseUrl = "http://localhost:3000/api/usuarios"

Write-Host "`n=== PRUEBA DE BUSQUEDA DE USUARIOS ===" -ForegroundColor Cyan

# 1. Login como superadmin
Write-Host "`n1. Login como superadmin..." -ForegroundColor Yellow
$loginBody = @{
    email = "diegocastroh10@hotmail.com"
    password = "D1eg0#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    Write-Host "✅ Login exitoso" -ForegroundColor Green
    Write-Host "Token obtenido: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    Write-Host "❌ Error en login: $_" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Buscar por RUT completo (con guión)
Write-Host "`n2. Buscar por RUT: 19133754-9" -ForegroundColor Yellow
try {
    $usuario = Invoke-RestMethod -Uri "$baseUrl/rut/19133754-9" -Method GET -Headers $headers
    Write-Host "✅ Usuario encontrado: $($usuario.usuario.nombrePersonal)" -ForegroundColor Green
    Write-Host "   Email: $($usuario.usuario.email)" -ForegroundColor Gray
    Write-Host "   RUT: $($usuario.usuario.rut)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 3. Buscar por RUT sin guión
Write-Host "`n3. Buscar por RUT sin guión: 19133754" -ForegroundColor Yellow
try {
    $usuario = Invoke-RestMethod -Uri "$baseUrl/rut/19133754" -Method GET -Headers $headers
    Write-Host "✅ Usuario encontrado: $($usuario.usuario.nombrePersonal)" -ForegroundColor Green
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   Esto es normal si el RUT en BD tiene guión" -ForegroundColor Gray
}

# 4. Buscar por Email
Write-Host "`n4. Buscar por Email: diegocastroh10@hotmail.com" -ForegroundColor Yellow
try {
    $usuario = Invoke-RestMethod -Uri "$baseUrl/email/diegocastroh10@hotmail.com" -Method GET -Headers $headers
    Write-Host "✅ Usuario encontrado: $($usuario.usuario.nombrePersonal)" -ForegroundColor Green
    Write-Host "   RUT: $($usuario.usuario.rut)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 5. Buscar otro usuario (persona)
Write-Host "`n5. Buscar por Email: persona@test.com" -ForegroundColor Yellow
try {
    $usuario = Invoke-RestMethod -Uri "$baseUrl/email/persona@test.com" -Method GET -Headers $headers
    Write-Host "✅ Usuario encontrado: $($usuario.usuario.nombrePersonal)" -ForegroundColor Green
    Write-Host "   RUT: $($usuario.usuario.rut)" -ForegroundColor Gray
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

# 6. Obtener todos los usuarios para ver los RUTs
Write-Host "`n6. Listar todos los usuarios y sus RUTs" -ForegroundColor Yellow
try {
    $usuarios = Invoke-RestMethod -Uri "$baseUrl" -Method GET -Headers $headers
    Write-Host "✅ Total usuarios: $($usuarios.cantidad)" -ForegroundColor Green
    foreach ($u in $usuarios.usuarios) {
        Write-Host "   - $($u.nombrePersonal) | RUT: $($u.rut) | Email: $($u.email)" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== FIN DE PRUEBAS ===" -ForegroundColor Cyan
