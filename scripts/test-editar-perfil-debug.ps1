# Test: Debug - Editar Mi Perfil

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TEST DEBUG: Editar Mi Perfil" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "http://localhost:3000/api/usuarios"

# Paso 1: Login
Write-Host "1. Haciendo login..." -ForegroundColor Yellow
$loginBody = @{
    email = "diego@test.com"
    password = "Diego123."
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.token
    Write-Host "   OK - Token obtenido" -ForegroundColor Green
    Write-Host "   Usuario: $($loginResponse.usuario.nombrePersonal)" -ForegroundColor Gray
    Write-Host "   Rol: $($loginResponse.usuario.rol)" -ForegroundColor Gray
} catch {
    Write-Host "   ERROR en login: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

Write-Host ""

# Paso 2: Editar mi perfil
Write-Host "2. Editando mi perfil..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$datosActualizados = @{
    nombrePersonal = "Diego Test"
    telefono = "977061343"
    posicion = "Hincha"
    direccion = "Direccion Test 123"
} | ConvertTo-Json

Write-Host "   Datos enviados:" -ForegroundColor Gray
Write-Host "   $datosActualizados" -ForegroundColor Gray

try {
    $response = Invoke-WebRequest -Uri "$baseUrl/mi-perfil" -Method Put -Headers $headers -Body $datosActualizados -UseBasicParsing
    
    Write-Host "   StatusCode: $($response.StatusCode)" -ForegroundColor $(if ($response.StatusCode -eq 200) { "Green" } else { "Yellow" })
    Write-Host "   StatusDescription: $($response.StatusDescription)" -ForegroundColor Gray
    Write-Host "   Content:" -ForegroundColor Gray
    Write-Host "   $($response.Content)" -ForegroundColor Gray
    
    if ($response.StatusCode -eq 200) {
        $jsonResponse = $response.Content | ConvertFrom-Json
        Write-Host ""
        Write-Host "   PERFIL ACTUALIZADO:" -ForegroundColor Green
        Write-Host "   - Nombre: $($jsonResponse.usuario.nombrePersonal)" -ForegroundColor White
        Write-Host "   - Posicion: $($jsonResponse.usuario.posicion)" -ForegroundColor White
        Write-Host "   - Telefono: $($jsonResponse.usuario.telefono)" -ForegroundColor White
    }
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    Write-Host "   ERROR: StatusCode $statusCode" -ForegroundColor Red
    Write-Host "   Mensaje: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $responseBody = $reader.ReadToEnd()
        Write-Host "   Response Body: $responseBody" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Fin del test" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
