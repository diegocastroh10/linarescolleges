# Script de prueba para el módulo de entrenamientos CON CAMPO NIVEL
$baseUrl = "http://localhost:3000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA DE API: ENTRENAMIENTOS CON NIVEL" -ForegroundColor Cyan
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

# 2. Crear entrenamiento - Lunes U17 y U21 varones (Avanzado)
Write-Host "`n2. Crear entrenamiento Lunes (U17 y U21 varones - Avanzado)..." -ForegroundColor Yellow
$entrenamiento1 = @{
    dia = "Lunes"
    categorias = @("U17 varones", "U21 varones")
    horario = "17:00-19:00"
    lugar = "Gimnasio Municipal"
    profesorACargo = "Juan Pérez"
    nivel = "Avanzado"
    observaciones = "Traer balón y uniforme completo"
} | ConvertTo-Json

try {
    $nuevo1 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento1 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo1.entrenamiento.dia) - $($nuevo1.entrenamiento.horario) - Nivel: $($nuevo1.entrenamiento.nivel)" -ForegroundColor Green
    $idEntrenamiento1 = $nuevo1.entrenamiento._id
} catch {
    Write-Host "   ERROR al crear entrenamiento 1: $_" -ForegroundColor Red
}

# 3. Crear entrenamiento - Lunes U13 damas (Principiante)
Write-Host "`n3. Crear entrenamiento Lunes (U13 damas - Principiante)..." -ForegroundColor Yellow
$entrenamiento2 = @{
    dia = "Lunes"
    categorias = @("U13 damas")
    horario = "15:00-16:30"
    lugar = "Cancha Techada"
    profesorACargo = "María González"
    nivel = "Principiante"
    observaciones = "Sin experiencia previa requerida"
} | ConvertTo-Json

try {
    $nuevo2 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento2 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo2.entrenamiento.dia) - $($nuevo2.entrenamiento.horario) - Nivel: $($nuevo2.entrenamiento.nivel)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 2: $_" -ForegroundColor Red
}

# 4. Crear entrenamiento - Miércoles U11, U13 varones, U15 damas (Intermedio)
Write-Host "`n4. Crear entrenamiento Miércoles (múltiples categorías - Intermedio)..." -ForegroundColor Yellow
$entrenamiento3 = @{
    dia = "Miércoles"
    categorias = @("U11 mixtos", "U13 varones", "U15 damas")
    horario = "16:00-18:00"
    lugar = "Gimnasio Principal"
    profesorACargo = "Carlos Ramírez"
    nivel = "Intermedio"
    observaciones = "Se requiere conocimiento básico de fundamentos"
} | ConvertTo-Json

try {
    $nuevo3 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento3 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo3.entrenamiento.dia) - $($nuevo3.entrenamiento.horario) - Nivel: $($nuevo3.entrenamiento.nivel)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 3: $_" -ForegroundColor Red
}

# 5. Crear entrenamiento - Viernes Adultos (Avanzado)
Write-Host "`n5. Crear entrenamiento Viernes (Adultos - Avanzado)..." -ForegroundColor Yellow
$entrenamiento4 = @{
    dia = "Viernes"
    categorias = @("Adultas damas", "Adultos varones")
    horario = "20:00-22:00"
    lugar = "Cancha Exterior"
    profesorACargo = "Roberto Silva"
    nivel = "Avanzado"
    observaciones = "Solo para adultos con experiencia competitiva"
} | ConvertTo-Json

try {
    $nuevo4 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $entrenamiento4 -Headers $headers
    Write-Host "   OK Entrenamiento creado: $($nuevo4.entrenamiento.dia) - $($nuevo4.entrenamiento.horario) - Nivel: $($nuevo4.entrenamiento.nivel)" -ForegroundColor Green
} catch {
    Write-Host "   ERROR al crear entrenamiento 4: $_" -ForegroundColor Red
}

# 6. Obtener todos los entrenamientos
Write-Host "`n6. Obtener todos los entrenamientos..." -ForegroundColor Yellow
try {
    $todos = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method GET -Headers $headers
    Write-Host "   OK Total de entrenamientos: $($todos.cantidad)" -ForegroundColor Green
    Write-Host "   Detalles de niveles:" -ForegroundColor Cyan
    foreach ($e in $todos.entrenamientos) {
        Write-Host "      - $($e.dia): $($e.horario) - Nivel: $($e.nivel) - Categorías: $($e.categorias -join ', ')" -ForegroundColor White
    }
} catch {
    Write-Host "   ERROR al obtener entrenamientos: $_" -ForegroundColor Red
}

# 7. Obtener entrenamientos del Lunes
Write-Host "`n7. Obtener entrenamientos de Lunes..." -ForegroundColor Yellow
try {
    $lunes = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/dia/Lunes" -Method GET -Headers $headers
    Write-Host "   OK Entrenamientos del Lunes: $($lunes.cantidad)" -ForegroundColor Green
    foreach ($e in $lunes.entrenamientos) {
        Write-Host "      - $($e.horario) - Nivel: $($e.nivel) - Profesor: $($e.profesorACargo)" -ForegroundColor White
    }
} catch {
    Write-Host "   ERROR al obtener entrenamientos de Lunes: $_" -ForegroundColor Red
}

# 8. Actualizar entrenamiento (cambiar nivel y horario)
if ($idEntrenamiento1) {
    Write-Host "`n8. Actualizar entrenamiento (cambiar horario y nivel)..." -ForegroundColor Yellow
    $actualizacion = @{
        horario = "17:30-19:30"
        nivel = "Intermedio"
    } | ConvertTo-Json
    
    try {
        $actualizado = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/$idEntrenamiento1" -Method PUT -Body $actualizacion -Headers $headers
        Write-Host "   OK Entrenamiento actualizado: $($actualizado.entrenamiento.horario) - Nuevo nivel: $($actualizado.entrenamiento.nivel)" -ForegroundColor Green
    } catch {
        Write-Host "   ERROR al actualizar entrenamiento: $_" -ForegroundColor Red
    }
}

# 9. Obtener entrenamiento por ID
if ($idEntrenamiento1) {
    Write-Host "`n9. Obtener entrenamiento por ID..." -ForegroundColor Yellow
    try {
        $porId = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/$idEntrenamiento1" -Method GET -Headers $headers
        Write-Host "   OK Entrenamiento encontrado:" -ForegroundColor Green
        Write-Host "      Día: $($porId.entrenamiento.dia)" -ForegroundColor White
        Write-Host "      Horario: $($porId.entrenamiento.horario)" -ForegroundColor White
        Write-Host "      Nivel: $($porId.entrenamiento.nivel)" -ForegroundColor White
        Write-Host "      Categorías: $($porId.entrenamiento.categorias -join ', ')" -ForegroundColor White
    } catch {
        Write-Host "   ERROR al obtener entrenamiento por ID: $_" -ForegroundColor Red
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PRUEBAS COMPLETADAS CON CAMPO NIVEL" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
