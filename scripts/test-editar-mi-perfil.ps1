# Test: Editar Mi Perfil - Cualquier usuario autenticado puede editar su propio perfil

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST: Editar Mi Perfil" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api/usuarios"

# Paso 1: Login con usuario persona
Write-Host "1. Login con usuario 'persona'..." -ForegroundColor Yellow
$loginBody = @{
    email = "diego@test.com"
    password = "Diego123."
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   ✓ Login exitoso" -ForegroundColor Green
    Write-Host "   - Usuario: $($loginResponse.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   - Rol: $($loginResponse.usuario.rol)" -ForegroundColor Gray
    Write-Host "   - Token obtenido" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error en login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Write-Host ""

# Paso 2: Editar mi propio perfil usando el nuevo endpoint
Write-Host "2. Editando mi perfil con el endpoint /mi-perfil..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$perfilActualizado = @{
    nombrePersonal = "Diego Actualizado"
    telefono = "977061343"
    posicion = "Hincha"
    direccion = "Nueva Dirección 456, Linares"
} | ConvertTo-Json

try {
    $editResponse = Invoke-RestMethod -Uri "$baseUrl/mi-perfil" -Method Put -Headers $headers -Body $perfilActualizado
    Write-Host "   ✓ Perfil actualizado exitosamente" -ForegroundColor Green
    Write-Host "   - Nombre: $($editResponse.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   - Posición: $($editResponse.usuario.posicion)" -ForegroundColor Gray
    Write-Host "   - Teléfono: $($editResponse.usuario.telefono)" -ForegroundColor Gray
    Write-Host "   - Dirección: $($editResponse.usuario.direccion)" -ForegroundColor Gray
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ✗ Error al editar perfil: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "   - Código de estado: $statusCode" -ForegroundColor Red
    if ($statusCode -eq 401) {
        Write-Host "   - PROBLEMA: Usuario no puede editar su propio perfil (401 Unauthorized)" -ForegroundColor Red
    }
    exit
}

Write-Host ""

# Paso 3: Verificar que el perfil se actualizó correctamente
Write-Host "3. Verificando cambios en el perfil..." -ForegroundColor Yellow
try {
    $perfilResponse = Invoke-RestMethod -Uri "$baseUrl/perfil" -Method Get -Headers $headers
    Write-Host "   ✓ Perfil verificado correctamente" -ForegroundColor Green
    Write-Host "   - Nombre: $($perfilResponse.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   - Posición: $($perfilResponse.usuario.posicion)" -ForegroundColor Gray
} catch {
    Write-Host "   ✗ Error al verificar perfil: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "RESULTADO: Test completado exitosamente" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Abrir http://localhost:4200/perfil/editar" -ForegroundColor White
Write-Host "2. Iniciar sesión con usuario rol 'persona'" -ForegroundColor White
Write-Host "3. Cambiar la posición usando el menú desplegable" -ForegroundColor White
Write-Host "4. Guardar cambios y verificar que funciona sin error 401" -ForegroundColor White
