# Script de pruebas para API REST de Linares Colleges
Write-Host "=== PRUEBAS API REST - LINARES COLLEGES ===" -ForegroundColor Cyan
Write-Host ""

# 1. Registrar usuario
Write-Host "1. Registrando nuevo usuario..." -ForegroundColor Yellow
$usuario1 = @{
    email = "jugador1@linarescolleges.cl"
    password = "password123"
    nombrePersonal = "Juan Pérez López"
    rut = "12345678-9"
    fechaNacimiento = "1995-05-15"
    posicion = "Base"
    telefono = "+56912345678"
} | ConvertTo-Json

try {
    $resultado1 = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/register" -Method POST -Body $usuario1 -ContentType "application/json"
    Write-Host "✓ Usuario creado exitosamente" -ForegroundColor Green
    $resultado1 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 2. Registrar segundo usuario
Write-Host "2. Registrando segundo usuario..." -ForegroundColor Yellow
$usuario2 = @{
    email = "jugador2@linarescolleges.cl"
    password = "password456"
    nombrePersonal = "María González"
    rut = "98765432-1"
    fechaNacimiento = "1998-08-20"
    posicion = "Alero"
    telefono = "+56987654321"
} | ConvertTo-Json

try {
    $resultado2 = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/register" -Method POST -Body $usuario2 -ContentType "application/json"
    Write-Host "✓ Usuario creado exitosamente" -ForegroundColor Green
    $resultado2 | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 3. Login
Write-Host "3. Probando login..." -ForegroundColor Yellow
$login = @{
    email = "jugador1@linarescolleges.cl"
    password = "password123"
} | ConvertTo-Json

try {
    $resultadoLogin = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" -Method POST -Body $login -ContentType "application/json"
    Write-Host "✓ Login exitoso" -ForegroundColor Green
    $resultadoLogin | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 4. Obtener todos los usuarios
Write-Host "4. Obteniendo todos los usuarios..." -ForegroundColor Yellow
try {
    $todosUsuarios = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios" -Method GET
    Write-Host "✓ Usuarios obtenidos exitosamente" -ForegroundColor Green
    $todosUsuarios | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 5. Buscar usuario por RUT
Write-Host "5. Buscando usuario por RUT (12345678-9)..." -ForegroundColor Yellow
try {
    $usuarioPorRut = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/rut/12345678-9" -Method GET
    Write-Host "✓ Usuario encontrado" -ForegroundColor Green
    $usuarioPorRut | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 6. Buscar usuario por email
Write-Host "6. Buscando usuario por email..." -ForegroundColor Yellow
try {
    $usuarioPorEmail = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/email/jugador1@linarescolleges.cl" -Method GET
    Write-Host "✓ Usuario encontrado" -ForegroundColor Green
    $usuarioPorEmail | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 7. Editar usuario por RUT
Write-Host "7. Editando usuario por RUT..." -ForegroundColor Yellow
$edicion = @{
    telefono = "+56911111111"
    posicion = "Escolta"
} | ConvertTo-Json

try {
    $usuarioEditado = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/rut/12345678-9" -Method PUT -Body $edicion -ContentType "application/json"
    Write-Host "✓ Usuario editado exitosamente" -ForegroundColor Green
    $usuarioEditado | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n-----------------------------------------`n"

# 8. Desactivar cuenta (requiere permisos de admin)
Write-Host "8. Desactivando cuenta de usuario (98765432-1)..." -ForegroundColor Yellow
$desactivar = @{
    isAdmin = $true
} | ConvertTo-Json

try {
    $desactivado = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/desactivar/98765432-1" -Method DELETE -Body $desactivar -ContentType "application/json"
    Write-Host "✓ Cuenta desactivada exitosamente" -ForegroundColor Green
    $desactivado | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`n=== FIN DE LAS PRUEBAS ===" -ForegroundColor Cyan
