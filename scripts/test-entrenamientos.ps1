# Script de prueba para el módulo de entrenamientos
$baseUrl = "http://localhost:3000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA DE API: ENTRENAMIENTOS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Login como administrador
Write-Host "1. Login como administrador..." -ForegroundColor Yellow
$loginBody = @{
    email = "clublinarescolleges@gmail.com"
    password = "Admin2024#"
} | ConvertTo-Json

try {
    $loginResponse = Invoke-RestMethod -Uri "$baseUrl/api/usuarios/login" -Method POST -Body $loginBody -ContentType "application/json"
    $token = $loginResponse.accessToken
    Write-Host "   OK Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ERROR en login" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

# 2. Crear entrenamiento - Lunes U17 y U21 varones
Write-Host "`n2. Crear entrenamiento Lunes (U17 y U21 varones)..." -ForegroundColor Yellow
$entrenamiento1 = @{
    dia = "Lunes"
    categorias = @("U17 varones", "U21 varones")
    horario = "17:00-19:00"
    lugar = "Gimnasio Municipal"
    profesorACargo = "Juan Pérez"
    observaciones = "Traer balón y uniforme completo"
} | ConvertTo-Json

try {
    $nuevo1 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento1 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo1.entrenamiento.dia) - $($nuevo1.entrenamiento.horario)" -ForegroundColor Green
    $idEntrenamiento1 = $nuevo1.entrenamiento._id
} catch {
    Write-Host "   ERROR al crear entrenamiento 1" -ForegroundColor Red
}

# 3. Crear entrenamiento - Lunes U13 damas
Write-Host "`n3. Crear entrenamiento Lunes (U13 damas)..." -ForegroundColor Yellow
$entrenamiento2 = @{
    dia = "Lunes"
    categorias = @("U13 damas")
    horario = "15:00-16:30"
    lugar = "Cancha Techada"
    profesorACargo = "María González"
    observaciones = ""
} | ConvertTo-Json

try {
    $nuevo2 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento2 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo2.entrenamiento.dia) - $($nuevo2.entrenamiento.horario)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 2" -ForegroundColor Red
}

# 4. Crear entrenamiento - Miércoles múltiples categorías
Write-Host "`n4. Crear entrenamiento Miércoles (U11, U13 varones, U15 damas)..." -ForegroundColor Yellow
$entrenamiento3 = @{
    dia = "Miércoles"
    categorias = @("U11 mixtos", "U13 varones", "U15 damas")
    horario = "16:00-18:00"
    lugar = "Gimnasio Central"
    profesorACargo = "Carlos Rojas"
    observaciones = "Entrenamiento conjunto"
} | ConvertTo-Json

try {
    $nuevo3 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento3 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo3.entrenamiento.dia) - $($nuevo3.entrenamiento.horario)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 3" -ForegroundColor Red
}

# 5. Crear entrenamiento - Viernes adultos
Write-Host "`n5. Crear entrenamiento Viernes (Adultas damas y Adultos varones)..." -ForegroundColor Yellow
$entrenamiento4 = @{
    dia = "Viernes"
    categorias = @("Adultas damas", "Adultos varones")
    horario = "20:00-22:00"
    lugar = "Gimnasio Liceo"
    profesorACargo = "Roberto Silva"
    observaciones = "Traer certificado médico vigente"
} | ConvertTo-Json

try {
    $nuevo4 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento4 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo4.entrenamiento.dia) - $($nuevo4.entrenamiento.horario)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 4" -ForegroundColor Red
}

# 6. Obtener todos los entrenamientos
Write-Host "`n6. Obtener todos los entrenamientos..." -ForegroundColor Yellow
try {
    $todos = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method GET -Headers $headers
    Write-Host "   OK Total entrenamientos: $($todos.cantidad)" -ForegroundColor Green
    foreach ($e in $todos.entrenamientos) {
        Write-Host "      - $($e.dia) $($e.horario): $($e.categorias -join ', ')" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ERROR al obtener entrenamientos" -ForegroundColor Red
}

# 7. Obtener entrenamientos del Lunes
Write-Host "`n7. Obtener entrenamientos del Lunes..." -ForegroundColor Yellow
try {
    $lunes = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/dia/Lunes" -Method GET -Headers $headers
    Write-Host "   OK Entrenamientos del Lunes: $($lunes.cantidad)" -ForegroundColor Green
    foreach ($e in $lunes.entrenamientos) {
        Write-Host "      - $($e.horario): $($e.categorias -join ', ') | $($e.lugar)" -ForegroundColor Gray
    }
} catch {
    Write-Host "   ERROR al obtener entrenamientos del Lunes" -ForegroundColor Red
}

# 8. Actualizar entrenamiento
if ($idEntrenamiento1) {
    Write-Host "`n8. Actualizar entrenamiento (cambiar horario)..." -ForegroundColor Yellow
    $actualizacion = @{
        horario = "17:30-19:30"
        observaciones = "Horario actualizado - Traer balón y uniforme"
    } | ConvertTo-Json

    try {
        $actualizado = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/$idEntrenamiento1" -Method PUT -Body $actualizacion -Headers $headers
        Write-Host "   OK Entrenamiento actualizado: nuevo horario $($actualizado.entrenamiento.horario)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR al actualizar entrenamiento" -ForegroundColor Red
    }
}

# 9. Obtener entrenamiento por ID
if ($idEntrenamiento1) {
    Write-Host "`n9. Obtener entrenamiento por ID..." -ForegroundColor Yellow
    try {
        $porId = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/$idEntrenamiento1" -Method GET -Headers $headers
        Write-Host "   OK Entrenamiento encontrado:" -ForegroundColor Green
        Write-Host "      Día: $($porId.entrenamiento.dia)" -ForegroundColor Gray
        Write-Host "      Horario: $($porId.entrenamiento.horario)" -ForegroundColor Gray
        Write-Host "      Categorías: $($porId.entrenamiento.categorias -join ', ')" -ForegroundColor Gray
        Write-Host "      Lugar: $($porId.entrenamiento.lugar)" -ForegroundColor Gray
        Write-Host "      Profesor: $($porId.entrenamiento.profesorACargo)" -ForegroundColor Gray
    } catch {
        Write-Host "   ERROR al obtener entrenamiento" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "         PRUEBAS COMPLETADAS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Verifica el panel en el navegador:" -ForegroundColor Yellow
Write-Host "1. Login: http://localhost:4200/login" -ForegroundColor Cyan
Write-Host "2. Credenciales: clublinarescolleges@gmail.com / Admin2024#" -ForegroundColor Cyan
Write-Host "3. Panel entrenamientos: http://localhost:4200/admin/entrenamientos`n" -ForegroundColor Cyan
