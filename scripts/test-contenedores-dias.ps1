# Script de prueba para validar que solo se muestren contenedores de días con entrenamientos
$baseUrl = "http://localhost:3000"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN: CONTENEDORES POR DÍA CON FILTRO" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# Login
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

# Obtener todos los entrenamientos
Write-Host "`n2. Obteniendo entrenamientos actuales..." -ForegroundColor Yellow
try {
    $todos = Invoke-RestMethod -Uri "$baseUrl/api/entrenamientos/publico" -Method GET
    Write-Host "   ✓ Total de entrenamientos: $($todos.cantidad)" -ForegroundColor Green
} catch {
    Write-Host "   ✗ ERROR al obtener entrenamientos" -ForegroundColor Red
    exit
}

# Análisis por día
Write-Host "`n3. Análisis de entrenamientos por día:" -ForegroundColor Yellow
$dias = @("Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo")
$diasConEntrenamientos = @()

foreach ($dia in $dias) {
    $entrenamientosDia = $todos.entrenamientos | Where-Object { $_.dia -eq $dia }
    $count = ($entrenamientosDia | Measure-Object).Count
    
    if ($count -gt 0) {
        Write-Host "   ✓ $dia : $count entrenamiento(s)" -ForegroundColor Green
        $diasConEntrenamientos += $dia
    } else {
        Write-Host "   ○ $dia : 0 entrenamientos (NO debería mostrarse)" -ForegroundColor Gray
    }
}

# Análisis por categoría
Write-Host "`n4. Análisis por categoría:" -ForegroundColor Yellow
$categorias = @(
    "U11 mixtos", "U13 damas", "U13 varones", "U15 damas", "U15 varones",
    "U17 damas", "U17 varones", "U21 varones", "Adultas damas", "Adultos varones"
)

foreach ($cat in $categorias) {
    $entrenamientosCat = $todos.entrenamientos | Where-Object { $_.categorias -contains $cat }
    $count = ($entrenamientosCat | Measure-Object).Count
    
    if ($count -gt 0) {
        Write-Host "`n   Categoría: $cat ($count entrenamientos)" -ForegroundColor Cyan
        
        # Mostrar días únicos para esta categoría
        $diasUnicos = $entrenamientosCat | Select-Object -ExpandProperty dia -Unique
        Write-Host "   Días con entrenamientos: $($diasUnicos -join ', ')" -ForegroundColor White
        Write-Host "   → Al filtrar por '$cat' solo deberían mostrarse estos contenedores de días" -ForegroundColor Yellow
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN ESPERADA EN NAVEGADOR" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "📋 Comportamiento esperado:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. SIN FILTRO (Todas las categorías):" -ForegroundColor Cyan
Write-Host "   → Deberían mostrarse contenedores de: $($diasConEntrenamientos -join ', ')" -ForegroundColor White
Write-Host "   → Total de contenedores visibles: $($diasConEntrenamientos.Count)" -ForegroundColor White
Write-Host ""

# Casos de prueba específicos
Write-Host "2. CON FILTRO ACTIVO:" -ForegroundColor Cyan

foreach ($cat in $categorias) {
    $entrenamientosCat = $todos.entrenamientos | Where-Object { $_.categorias -contains $cat }
    $count = ($entrenamientosCat | Measure-Object).Count
    
    if ($count -gt 0) {
        $diasUnicosCat = $entrenamientosCat | Select-Object -ExpandProperty dia -Unique | Sort-Object
        Write-Host "`n   Filtro: '$cat'" -ForegroundColor Yellow
        Write-Host "   → Solo mostrar contenedores de: $($diasUnicosCat -join ', ')" -ForegroundColor White
        Write-Host "   → Total de contenedores: $($diasUnicosCat.Count)" -ForegroundColor White
    }
}

Write-Host "`n3. FILTRO SIN RESULTADOS:" -ForegroundColor Cyan
$categoriasSinEntrenamientos = @()
foreach ($cat in $categorias) {
    $entrenamientosCat = $todos.entrenamientos | Where-Object { $_.categorias -contains $cat }
    if (($entrenamientosCat | Measure-Object).Count -eq 0) {
        $categoriasSinEntrenamientos += $cat
    }
}

if ($categoriasSinEntrenamientos.Count -gt 0) {
    Write-Host "   Categorías sin entrenamientos: $($categoriasSinEntrenamientos -join ', ')" -ForegroundColor Gray
    Write-Host "   → No debería mostrarse NINGÚN contenedor de día" -ForegroundColor Yellow
    Write-Host "   → Debería aparecer mensaje: 'No se encontraron entrenamientos'" -ForegroundColor Yellow
    Write-Host "   → Debería aparecer botón: 'Ver todas las categorías'" -ForegroundColor Yellow
} else {
    Write-Host "   ✓ Todas las categorías tienen entrenamientos" -ForegroundColor Green
}

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  PASOS DE PRUEBA MANUAL" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "1. Abrir http://localhost:4200/entrenamientos" -ForegroundColor White
Write-Host ""
Write-Host "2. Verificar estado inicial (sin filtro):" -ForegroundColor Cyan
Write-Host "   → Contar contenedores de días visibles" -ForegroundColor White
Write-Host "   → Verificar que solo se muestren días con entrenamientos" -ForegroundColor White
Write-Host ""
Write-Host "3. Aplicar filtro por categoría:" -ForegroundColor Cyan
Write-Host "   → Seleccionar una categoría del dropdown" -ForegroundColor White
Write-Host "   → Verificar que solo aparezcan contenedores de días con esa categoría" -ForegroundColor White
Write-Host "   → Los días sin entrenamientos de esa categoría NO deben aparecer" -ForegroundColor White
Write-Host ""
Write-Host "4. Probar categoría sin entrenamientos:" -ForegroundColor Cyan
if ($categoriasSinEntrenamientos.Count -gt 0) {
    Write-Host "   → Seleccionar: $($categoriasSinEntrenamientos[0])" -ForegroundColor White
} else {
    Write-Host "   → (No hay categorías sin entrenamientos en este momento)" -ForegroundColor Gray
}
Write-Host "   → NO debe aparecer ningún contenedor de día" -ForegroundColor White
Write-Host "   → Debe aparecer mensaje central con botón 'Ver todas las categorías'" -ForegroundColor White
Write-Host ""
Write-Host "5. Limpiar filtro:" -ForegroundColor Cyan
Write-Host "   → Click en 'Limpiar filtro' (botón rojo)" -ForegroundColor White
Write-Host "   → O click en 'Ver todas las categorías' (si sin resultados)" -ForegroundColor White
Write-Host "   → Debe volver a mostrar todos los contenedores de días con entrenamientos" -ForegroundColor White

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  VALIDACIÓN COMPLETADA" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

Write-Host "✓ Resumen:" -ForegroundColor Green
Write-Host "  - Total entrenamientos en BD: $($todos.cantidad)" -ForegroundColor White
Write-Host "  - Días con entrenamientos: $($diasConEntrenamientos.Count) de 7" -ForegroundColor White
Write-Host "  - Categorías activas: $(($categorias | ForEach-Object { $cat = $_; if (($todos.entrenamientos | Where-Object { $_.categorias -contains $cat } | Measure-Object).Count -gt 0) { $cat } } | Measure-Object).Count)" -ForegroundColor White
Write-Host ""
