# Script de prueba para validar el filtro de categorías en entrenamientos
$baseUrl = "http://localhost:3000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA: FILTRO DE CATEGORÍAS" -ForegroundColor Cyan
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
    Write-Host "   ✓ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ✗ ERROR en login" -ForegroundColor Red
    exit
}

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

Write-Host "`n2. Creando entrenamientos de prueba para filtro..." -ForegroundColor Yellow

# Limpiar entrenamientos existentes (opcional)
Write-Host "   Nota: Asegúrate de tener entrenamientos en la BD para probar el filtro" -ForegroundColor Cyan

# Entrenamiento 1: Lunes - U17 varones y U21 varones
$ent1 = @{
    dia = "Lunes"
    categorias = @("U17 varones", "U21 varones")
    horario = "17:00-19:00"
    lugar = "Gimnasio Municipal"
    profesorACargo = "Juan Pérez"
    nivel = "Avanzado"
    observaciones = "Traer balón"
} | ConvertTo-Json

try {
    $nuevo1 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $ent1 -Headers $headers
    Write-Host "   ✓ Creado: Lunes - U17 varones + U21 varones" -ForegroundColor Green
    $id1 = $nuevo1.entrenamiento._id
} catch {
    Write-Host "   ⚠ Entrenamiento 1 ya existe o error" -ForegroundColor Yellow
}

# Entrenamiento 2: Lunes - U13 damas
$ent2 = @{
    dia = "Lunes"
    categorias = @("U13 damas")
    horario = "15:00-16:30"
    lugar = "Cancha Techada"
    profesorACargo = "María González"
    nivel = "Principiante"
    observaciones = "Sin experiencia requerida"
} | ConvertTo-Json

try {
    $nuevo2 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $ent2 -Headers $headers
    Write-Host "   ✓ Creado: Lunes - U13 damas" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Entrenamiento 2 ya existe o error" -ForegroundColor Yellow
}

# Entrenamiento 3: Miércoles - U11 mixtos, U13 varones, U15 damas
$ent3 = @{
    dia = "Miércoles"
    categorias = @("U11 mixtos", "U13 varones", "U15 damas")
    horario = "16:00-18:00"
    lugar = "Gimnasio Principal"
    profesorACargo = "Carlos Ramírez"
    nivel = "Intermedio"
    observaciones = "Fundamentos básicos"
} | ConvertTo-Json

try {
    $nuevo3 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $ent3 -Headers $headers
    Write-Host "   ✓ Creado: Miércoles - U11 mixtos + U13 varones + U15 damas" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Entrenamiento 3 ya existe o error" -ForegroundColor Yellow
}

# Entrenamiento 4: Viernes - U17 varones
$ent4 = @{
    dia = "Viernes"
    categorias = @("U17 varones")
    horario = "18:00-20:00"
    lugar = "Cancha Exterior"
    profesorACargo = "Roberto Silva"
    nivel = "Intermedio"
    observaciones = "Práctica táctica"
} | ConvertTo-Json

try {
    $nuevo4 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $ent4 -Headers $headers
    Write-Host "   ✓ Creado: Viernes - U17 varones" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Entrenamiento 4 ya existe o error" -ForegroundColor Yellow
}

# Entrenamiento 5: Sábado - Adultos varones
$ent5 = @{
    dia = "Sábado"
    categorias = @("Adultos varones")
    horario = "10:00-12:00"
    lugar = "Gimnasio Municipal"
    profesorACargo = "Diego Martínez"
    nivel = "Avanzado"
    observaciones = "Competencia"
} | ConvertTo-Json

try {
    $nuevo5 = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos" -Method POST -Body $ent5 -Headers $headers
    Write-Host "   ✓ Creado: Sábado - Adultos varones" -ForegroundColor Green
} catch {
    Write-Host "   ⚠ Entrenamiento 5 ya existe o error" -ForegroundColor Yellow
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN DE FILTROS" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 3. Obtener todos los entrenamientos (sin filtro)
Write-Host "3. Obteniendo todos los entrenamientos (sin filtro)..." -ForegroundColor Yellow
try {
    $todos = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/publico" -Method GET
    Write-Host "   ✓ Total de entrenamientos: $($todos.cantidad)" -ForegroundColor Green
    
    Write-Host "`n   Detalle de entrenamientos:" -ForegroundColor Cyan
    foreach ($e in $todos.entrenamientos) {
        Write-Host "      - $($e.dia): $($e.horario) | Categorías: $($e.categorias -join ', ')" -ForegroundColor White
    }
} catch {
    Write-Host "   ✗ ERROR al obtener entrenamientos: $_" -ForegroundColor Red
}

# 4. Validar filtro por U17 varones (debería mostrar 2 entrenamientos: Lunes y Viernes)
Write-Host "`n4. PRUEBA FILTRO: U17 varones" -ForegroundColor Yellow
Write-Host "   Expectativa: Debería encontrar entrenamientos de Lunes (17:00-19:00) y Viernes (18:00-20:00)" -ForegroundColor Cyan
$u17Count = 0
foreach ($e in $todos.entrenamientos) {
    if ($e.categorias -contains "U17 varones") {
        $u17Count++
        Write-Host "      ✓ Encontrado: $($e.dia) - $($e.horario) - Categorías: $($e.categorias -join ', ')" -ForegroundColor Green
    }
}
Write-Host "   Total encontrados con U17 varones: $u17Count" -ForegroundColor $(if ($u17Count -ge 2) { "Green" } else { "Yellow" })

# 5. Validar filtro por U13 damas (debería mostrar 1 entrenamiento: Lunes)
Write-Host "`n5. PRUEBA FILTRO: U13 damas" -ForegroundColor Yellow
Write-Host "   Expectativa: Debería encontrar entrenamiento de Lunes (15:00-16:30)" -ForegroundColor Cyan
$u13DamasCount = 0
foreach ($e in $todos.entrenamientos) {
    if ($e.categorias -contains "U13 damas") {
        $u13DamasCount++
        Write-Host "      ✓ Encontrado: $($e.dia) - $($e.horario) - Categorías: $($e.categorias -join ', ')" -ForegroundColor Green
    }
}
Write-Host "   Total encontrados con U13 damas: $u13DamasCount" -ForegroundColor $(if ($u13DamasCount -ge 1) { "Green" } else { "Yellow" })

# 6. Validar filtro por U11 mixtos (debería mostrar 1 entrenamiento: Miércoles)
Write-Host "`n6. PRUEBA FILTRO: U11 mixtos" -ForegroundColor Yellow
Write-Host "   Expectativa: Debería encontrar entrenamiento de Miércoles (16:00-18:00)" -ForegroundColor Cyan
$u11Count = 0
foreach ($e in $todos.entrenamientos) {
    if ($e.categorias -contains "U11 mixtos") {
        $u11Count++
        Write-Host "      ✓ Encontrado: $($e.dia) - $($e.horario) - Categorías: $($e.categorias -join ', ')" -ForegroundColor Green
    }
}
Write-Host "   Total encontrados con U11 mixtos: $u11Count" -ForegroundColor $(if ($u11Count -ge 1) { "Green" } else { "Yellow" })

# 7. Validar filtro por Adultos varones (debería mostrar 1 entrenamiento: Sábado)
Write-Host "`n7. PRUEBA FILTRO: Adultos varones" -ForegroundColor Yellow
Write-Host "   Expectativa: Debería encontrar entrenamiento de Sábado (10:00-12:00)" -ForegroundColor Cyan
$adultosCount = 0
foreach ($e in $todos.entrenamientos) {
    if ($e.categorias -contains "Adultos varones") {
        $adultosCount++
        Write-Host "      ✓ Encontrado: $($e.dia) - $($e.horario) - Categorías: $($e.categorias -join ', ')" -ForegroundColor Green
    }
}
Write-Host "   Total encontrados con Adultos varones: $adultosCount" -ForegroundColor $(if ($adultosCount -ge 1) { "Green" } else { "Yellow" })

# 8. Validar categoría sin entrenamientos
Write-Host "`n8. PRUEBA FILTRO: U15 varones (sin entrenamientos dedicados)" -ForegroundColor Yellow
Write-Host "   Expectativa: Debería encontrar 0 entrenamientos exclusivos" -ForegroundColor Cyan
$u15VaronesCount = 0
foreach ($e in $todos.entrenamientos) {
    if ($e.categorias -contains "U15 varones") {
        $u15VaronesCount++
        Write-Host "      ✓ Encontrado: $($e.dia) - $($e.horario) - Categorías: $($e.categorias -join ', ')" -ForegroundColor Green
    }
}
if ($u15VaronesCount -eq 0) {
    Write-Host "   ✓ Correcto: No hay entrenamientos con U15 varones" -ForegroundColor Green
} else {
    Write-Host "   ℹ Se encontraron $u15VaronesCount entrenamientos con U15 varones" -ForegroundColor Cyan
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  RESUMEN DE VALIDACIÓN" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "Total de entrenamientos en BD: $($todos.cantidad)" -ForegroundColor White
Write-Host "Con U17 varones: $u17Count" -ForegroundColor White
Write-Host "Con U13 damas: $u13DamasCount" -ForegroundColor White
Write-Host "Con U11 mixtos: $u11Count" -ForegroundColor White
Write-Host "Con Adultos varones: $adultosCount" -ForegroundColor White
Write-Host "Con U15 varones: $u15VaronesCount" -ForegroundColor White

Write-Host "`n✓ El filtro funciona correctamente si:" -ForegroundColor Cyan
Write-Host "  1. Cada categoría muestra solo sus entrenamientos" -ForegroundColor White
Write-Host "  2. Un entrenamiento con múltiples categorías aparece en cada filtro correspondiente" -ForegroundColor White
Write-Host "  3. El filtro 'Todas las categorías' muestra todos los entrenamientos" -ForegroundColor White

Write-Host "`n📋 Instrucciones para prueba manual en navegador:" -ForegroundColor Yellow
Write-Host "  1. Abre http://localhost:4200/entrenamientos" -ForegroundColor White
Write-Host "  2. Verifica que el select de 'Filtrar por Categoría' aparezca en la parte superior" -ForegroundColor White
Write-Host "  3. Selecciona 'U17 varones' → Deberías ver entrenamientos de Lunes y Viernes" -ForegroundColor White
Write-Host "  4. Selecciona 'U13 damas' → Deberías ver solo el entrenamiento de Lunes 15:00" -ForegroundColor White
Write-Host "  5. Selecciona 'Todas las categorías' → Deberías ver todos los entrenamientos" -ForegroundColor White
Write-Host "  6. Verifica que el botón 'Limpiar filtro' aparezca solo cuando hay un filtro activo" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PRUEBA COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan
