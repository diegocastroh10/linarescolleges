# Script de prueba para búsqueda mejorada
$baseUrl = "http://localhost:3000/api/usuarios"

Write-Host "`n=== PRUEBA DE BUSQUEDA MEJORADA ===" -ForegroundColor Cyan

# Login
$loginBody = @{
    email = "diegocastroh10@hotmail.com"
    password = "D1eg0#"
} | ConvertTo-Json

$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method POST -Body $loginBody -ContentType "application/json"
$token = $loginResponse.accessToken
Write-Host "✅ Login exitoso como superadmin`n" -ForegroundColor Green

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# Pruebas de búsqueda con diferentes formatos de RUT
$testCases = @(
    @{ Nombre = "RUT completo con guión"; Valor = "19133754-9"; Tipo = "rut" },
    @{ Nombre = "RUT sin guión (9 dígitos)"; Valor = "191337549"; Tipo = "rut" },
    @{ Nombre = "RUT sin guión (8 dígitos)"; Valor = "19133754"; Tipo = "rut" },
    @{ Nombre = "Otro RUT con guión"; Valor = "11111111-1"; Tipo = "rut" },
    @{ Nombre = "Otro RUT sin guión"; Valor = "111111111"; Tipo = "rut" },
    @{ Nombre = "Email del superadmin"; Valor = "diegocastroh10@hotmail.com"; Tipo = "email" },
    @{ Nombre = "Email de persona"; Valor = "persona@test.com"; Tipo = "email" }
)

$contador = 1
foreach ($test in $testCases) {
    Write-Host "$contador. Buscar: $($test.Nombre) - '$($test.Valor)'" -ForegroundColor Yellow
    
    $endpoint = if ($test.Tipo -eq "rut") { "$baseUrl/rut/$($test.Valor)" } else { "$baseUrl/email/$($test.Valor)" }
    
    try {
        $usuario = Invoke-RestMethod -Uri $endpoint -Method GET -Headers $headers
        Write-Host "   ✅ ENCONTRADO: $($usuario.usuario.nombrePersonal)" -ForegroundColor Green
        Write-Host "      RUT: $($usuario.usuario.rut) | Email: $($usuario.usuario.email)" -ForegroundColor Gray
    } catch {
        Write-Host "   ❌ NO ENCONTRADO" -ForegroundColor Red
        if ($_.Exception.Response.StatusCode.value__ -eq 404) {
            Write-Host "      Error 404: Usuario no existe" -ForegroundColor DarkRed
        }
    }
    $contador++
}

Write-Host "`n=== RESUMEN ===" -ForegroundColor Cyan
Write-Host "Todos los formatos de RUT deberian funcionar ahora:" -ForegroundColor White
Write-Host "  OK 19133754-9 (con guion)" -ForegroundColor Gray
Write-Host "  OK 191337549 (sin guion, 9 digitos)" -ForegroundColor Gray
Write-Host "  OK 19133754 (sin guion, 8 digitos - se agrega el guion automaticamente)" -ForegroundColor Gray
Write-Host "" 
Write-Host "Prueba en el frontend: http://localhost:4200/admin/usuarios" -ForegroundColor Yellow
