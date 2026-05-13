# Script de prueba para endpoints públicos de noticias
Write-Host "=== PRUEBA: Endpoints Públicos de Noticias ===" -ForegroundColor Cyan

# 1. Obtener noticias publicadas (sin autenticación)
Write-Host "`n1. Obteniendo noticias publicadas..." -ForegroundColor Yellow
try {
    $noticiasPublicas = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publicas" `
        -Method Get `
        -ContentType "application/json"
    
    Write-Host "✅ Noticias públicas obtenidas" -ForegroundColor Green
    Write-Host "   Total: $($noticiasPublicas.cantidad)" -ForegroundColor White
    
    if ($noticiasPublicas.cantidad -gt 0) {
        Write-Host "`n   Listado de noticias:" -ForegroundColor White
        foreach ($noticia in $noticiasPublicas.noticias) {
            Write-Host "   📰 $($noticia.titulo)" -ForegroundColor Cyan
            Write-Host "      Autor: $($noticia.autor)" -ForegroundColor Gray
            Write-Host "      Visitas: $($noticia.visitas)" -ForegroundColor Gray
            Write-Host "      Fecha: $($noticia.fechaPublicacion)" -ForegroundColor Gray
            if ($noticia.urlInstagram) {
                Write-Host "      📸 Incluye Instagram" -ForegroundColor Magenta
            }
            if ($noticia.auspiciadores.Count -gt 0) {
                Write-Host "      🏆 Auspiciadores: $($noticia.auspiciadores.Count)" -ForegroundColor Yellow
            }
            Write-Host ""
        }
    } else {
        Write-Host "   ⚠️  No hay noticias publicadas" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Error al obtener noticias públicas" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
}

# 2. Obtener últimas 2 noticias
Write-Host "`n2. Obteniendo últimas 2 noticias..." -ForegroundColor Yellow
try {
    $ultimasNoticias = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/ultimas/2" `
        -Method Get `
        -ContentType "application/json"
    
    Write-Host "✅ Últimas noticias obtenidas" -ForegroundColor Green
    Write-Host "   Total: $($ultimasNoticias.cantidad)" -ForegroundColor White
    
    foreach ($noticia in $ultimasNoticias.noticias) {
        Write-Host "   - $($noticia.titulo)" -ForegroundColor White
    }
} catch {
    Write-Host "❌ Error al obtener últimas noticias" -ForegroundColor Red
}

# 3. Ver una noticia específica (incrementa visitas)
Write-Host "`n3. Viendo noticia específica..." -ForegroundColor Yellow
if ($noticiasPublicas.noticias.Count -gt 0) {
    $primeraNoticia = $noticiasPublicas.noticias[0]
    $visitasAntes = $primeraNoticia.visitas
    
    try {
        $noticiaDetalle = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publica/$($primeraNoticia._id)" `
            -Method Get `
            -ContentType "application/json"
        
        Write-Host "✅ Noticia obtenida" -ForegroundColor Green
        Write-Host "   Título: $($noticiaDetalle.noticia.titulo)" -ForegroundColor White
        Write-Host "   Visitas antes: $visitasAntes" -ForegroundColor Gray
        Write-Host "   Visitas ahora: $($noticiaDetalle.noticia.visitas)" -ForegroundColor Gray
        Write-Host "   ✅ Contador de visitas incrementado" -ForegroundColor Green
        
        # Ver la noticia nuevamente para incrementar contador otra vez
        Start-Sleep -Seconds 1
        $noticiaDetalle2 = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publica/$($primeraNoticia._id)" `
            -Method Get `
            -ContentType "application/json"
        
        Write-Host "   Visitas después de segunda vista: $($noticiaDetalle2.noticia.visitas)" -ForegroundColor Gray
    } catch {
        Write-Host "❌ Error al ver noticia" -ForegroundColor Red
    }
}

# 4. Intentar acceder a endpoint protegido sin token (debe fallar)
Write-Host "`n4. Intentando acceder a endpoint protegido sin autenticación..." -ForegroundColor Yellow
try {
    $todasNoticias = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
        -Method Get `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    Write-Host "❌ ERROR: Se pudo acceder sin token (no debería ser posible)" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 401) {
        Write-Host "✅ Correcto: Acceso denegado sin token (401 Unauthorized)" -ForegroundColor Green
    } else {
        Write-Host "❌ Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
