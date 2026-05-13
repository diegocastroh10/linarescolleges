# Script para crear usuario administrador
Write-Host "=== CREANDO USUARIO ADMINISTRADOR ===" -ForegroundColor Cyan
Write-Host ""

$adminUsuario = @{
    email = "diegocastroh10@hotmail.com"
    password = "admin123"
    nombrePersonal = "Diego Castro Herrera"
    nombreUsuario = "d1eg0"
    rut = "19133754-9"
    fechaNacimiento = "1995-06-22"
    posicion = "Base"
    telefono = "977061343"
    direccion = "Alonso de ercilla 232"
    nombreApoderado = ""
    telefonoApoderado = ""
    isAdmin = $true
} | ConvertTo-Json

Write-Host "Datos del administrador:" -ForegroundColor Yellow
$adminUsuario | ConvertFrom-Json | Format-List

try {
    $resultado = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/register" -Method POST -Body $adminUsuario -ContentType "application/json"
    Write-Host "✓ Usuario administrador creado exitosamente" -ForegroundColor Green
    Write-Host ""
    $resultado | ConvertTo-Json -Depth 3
} catch {
    Write-Host "✗ Error: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== FIN ===" -ForegroundColor Cyan
