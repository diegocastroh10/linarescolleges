# Script de prueba para busqueda de usuarios

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  PRUEBA: BUSQUEDA DE USUARIOS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$baseUrl = "http://localhost:3000/api/usuarios"
$email = "diegocastroh10@hotmail.com"
$password = "D1eg0#"

Write-Host "1. LOGIN COMO SUPERADMIN" -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "$baseUrl/login" -Method Post -Body (@{
    email = $email
    password = $password
} | ConvertTo-Json) -ContentType "application/json"

$accessToken = $loginResponse.accessToken
Write-Host "   OK Login exitoso" -ForegroundColor Green
Write-Host ""

# Headers con el token
$headers = @{
    "Authorization" = "Bearer $accessToken"
}

# Lista de pruebas con RUTs reales
$pruebas = @(
    @{ Tipo = "RUT con guion"; Valor = "19133754-9"; Esperado = "Diego Castro Herrera" }
    @{ Tipo = "RUT con guion"; Valor = "12345678-9"; Esperado = "Juan Jose Perez" }
    @{ Tipo = "RUT con guion"; Valor = "11111111-1"; Esperado = "Usuario Persona" }
    @{ Tipo = "Email"; Valor = "clublinarescolleges@gmail.com"; Esperado = "Club Deportivo Linares Colleges" }
    @{ Tipo = "Email"; Valor = "persona@test.com"; Esperado = "Usuario Persona" }
)

$exitosos = 0
$fallidos = 0

foreach ($prueba in $pruebas) {
    Write-Host "Buscando por $($prueba.Tipo): $($prueba.Valor)" -ForegroundColor Yellow
    
    try {
        if ($prueba.Tipo -eq "RUT con guion") {
            $resultado = Invoke-RestMethod -Uri "$baseUrl/rut/$($prueba.Valor)" -Method Get -Headers $headers
        } else {
            $resultado = Invoke-RestMethod -Uri "$baseUrl/email/$($prueba.Valor)" -Method Get -Headers $headers
        }
        
        Write-Host "   OK Encontrado: $($resultado.usuario.nombrePersonal)" -ForegroundColor Green
        Write-Host "   RUT: $($resultado.usuario.rut)" -ForegroundColor Gray
        Write-Host "   Email: $($resultado.usuario.email)" -ForegroundColor Gray
        Write-Host "   Rol: $($resultado.usuario.rol)" -ForegroundColor Gray
        $exitosos++
    } catch {
        Write-Host "   ERROR No encontrado" -ForegroundColor Red
        $fallidos++
    }
    Write-Host ""
}

Write-Host "============================================" -ForegroundColor Cyan
Write-Host "  RESUMEN" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Pruebas exitosas: $exitosos" -ForegroundColor Green
Write-Host "Pruebas fallidas: $fallidos" -ForegroundColor $(if ($fallidos -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($fallidos -eq 0) {
    Write-Host "TODAS LAS BUSQUEDAS FUNCIONAN CORRECTAMENTE" -ForegroundColor Green
} else {
    Write-Host "HAY PROBLEMAS CON LA BUSQUEDA" -ForegroundColor Red
}
Write-Host ""
