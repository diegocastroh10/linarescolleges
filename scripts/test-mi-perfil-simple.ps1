# Test: Editar Mi Perfil
Write-Host "Probando endpoint /mi-perfil..." -ForegroundColor Cyan

# Variables
$baseUrl = "http://localhost:3000/api/usuarios"
$email = "diego@test.com"
$password = "Diego123."

# Login
Write-Host "1. Haciendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = $email
    password = $password
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
$token = $loginResponse.token
Write-Host "Login exitoso - Rol: $($loginResponse.usuario.rol)" -ForegroundColor Green

# Editar perfil
Write-Host ""
Write-Host "2. Editando mi perfil..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$nuevosDatos = @{
    nombrePersonal = "Diego Test Actualizado"
    posicion = "Hincha"
    telefono = "977061343"
    direccion = "Direccion de prueba 123"
} | ConvertTo-Json

try {
    $editResponse = Invoke-RestMethod -Uri "$baseUrl/mi-perfil" -Method Put -Headers $headers -Body $nuevosDatos
    Write-Host "Perfil actualizado exitosamente!" -ForegroundColor Green
    Write-Host "  Nombre: $($editResponse.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "  Posicion: $($editResponse.usuario.posicion)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "TEST EXITOSO - El usuario puede editar su perfil sin error 401" -ForegroundColor Green
} catch {
    Write-Host "ERROR al editar: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "  Codigo: 401 Unauthorized" -ForegroundColor Red
    }
}
