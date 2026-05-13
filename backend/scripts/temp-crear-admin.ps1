$body = @{
    email = "diegocastroh10@hotmail.com"
    password = "admin123"
    nombrePersonal = "Diego Castro Herrera"
    nombreUsuario = "d1eg0"
    rut = "19133754-9"
    fechaNacimiento = "1995-06-22"
    posicion = "Base"
    telefono = "977061343"
    direccion = "Alonso de ercilla 232"
    isAdmin = $true
} | ConvertTo-Json

Write-Host "Creando usuario administrador..." -ForegroundColor Yellow
try {
    $resultado = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "Usuario administrador creado exitosamente!" -ForegroundColor Green
    $resultado | ConvertTo-Json -Depth 3
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}
