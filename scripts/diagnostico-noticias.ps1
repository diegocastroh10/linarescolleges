# Script de diagnóstico para verificar el sistema de noticias
Write-Host "=== DIAGNÓSTICO: Sistema de Noticias ===" -ForegroundColor Cyan
Write-Host ""

# 1. Verificar que el backend está corriendo
Write-Host "1. Verificando backend..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publicas" `
        -Method Get `
        -ContentType "application/json" `
        -TimeoutSec 5
    
    Write-Host "   ✅ Backend respondiendo correctamente" -ForegroundColor Green
    Write-Host "   📊 Noticias públicas: $($healthCheck.cantidad)" -ForegroundColor White
} catch {
    Write-Host "   ❌ Backend NO está respondiendo" -ForegroundColor Red
    Write-Host "   💡 Solución: Inicia el backend con 'cd backend && npm start'" -ForegroundColor Yellow
    exit
}

# 2. Login como administrador
Write-Host "`n2. Iniciando sesión como administrador..." -ForegroundColor Yellow
try {
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" `
        -Method Post `
        -ContentType "application/json" `
        -Body (@{
            email = "administrador@linarescolleges.com"
            password = "Admin123456"
        } | ConvertTo-Json)
    
    $token = $loginResponse.token
    Write-Host "   ✅ Login exitoso" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Error al hacer login" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    exit
}

# 3. Obtener todas las noticias (endpoint protegido)
Write-Host "`n3. Obteniendo todas las noticias..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $todasNoticias = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
        -Method Get `
        -Headers $headers
    
    Write-Host "   ✅ Noticias obtenidas exitosamente" -ForegroundColor Green
    Write-Host "   📰 Total de noticias: $($todasNoticias.cantidad)" -ForegroundColor White
    Write-Host ""
    
    if ($todasNoticias.cantidad -eq 0) {
        Write-Host "   ⚠️  NO HAY NOTICIAS CREADAS" -ForegroundColor Yellow
        Write-Host "   💡 Este es el problema: No existen noticias en la base de datos" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "   📋 SOLUCIONES:" -ForegroundColor Cyan
        Write-Host "   1. Ejecuta: .\test-noticias-crear.ps1 para crear noticias de prueba" -ForegroundColor White
        Write-Host "   2. O crea una noticia manualmente desde el panel de administrador" -ForegroundColor White
    } else {
        Write-Host "   📋 Listado de noticias:" -ForegroundColor Cyan
        Write-Host ""
        
        # Ordenar por fecha
        $noticiasOrdenadas = $todasNoticias.noticias | Sort-Object -Property fechaPublicacion -Descending
        
        $contador = 1
        foreach ($noticia in $noticiasOrdenadas) {
            $estado = if ($noticia.publicada) { "✅ Publicada" } else { "❌ Borrador" }
            $fecha = [DateTime]::Parse($noticia.fechaPublicacion).ToString("dd/MM/yyyy")
            
            Write-Host "   $contador. $($noticia.titulo)" -ForegroundColor White
            Write-Host "      📅 Fecha: $fecha" -ForegroundColor Gray
            Write-Host "      👤 Autor: $($noticia.autor)" -ForegroundColor Gray
            Write-Host "      📊 Estado: $estado" -ForegroundColor Gray
            Write-Host "      👁️  Visitas: $($noticia.visitas)" -ForegroundColor Gray
            
            # Verificar imagen
            if ($noticia.imagenPortada) {
                if ($noticia.imagenPortada.StartsWith("data:image")) {
                    $tamano = [Math]::Round($noticia.imagenPortada.Length / 1024, 2)
                    Write-Host "      🖼️  Imagen: Base64 ($tamano KB)" -ForegroundColor Gray
                } else {
                    Write-Host "      🖼️  Imagen: URL ($($noticia.imagenPortada.Substring(0, 50))...)" -ForegroundColor Gray
                }
            }
            
            Write-Host ""
            $contador++
        }
    }
    
} catch {
    Write-Host "   ❌ Error al obtener noticias" -ForegroundColor Red
    Write-Host "   Error: $($_.Exception.Message)" -ForegroundColor Red
    
    if ($_.Exception.Response) {
        Write-Host "   Status: $($_.Exception.Response.StatusCode)" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "   📋 POSIBLES CAUSAS:" -ForegroundColor Cyan
    Write-Host "   1. Token JWT inválido o expirado" -ForegroundColor White
    Write-Host "   2. Usuario no tiene permisos de administrador" -ForegroundColor White
    Write-Host "   3. Endpoint del backend no está configurado correctamente" -ForegroundColor White
}

# 4. Verificar estructura de la primera noticia
if ($todasNoticias.cantidad -gt 0) {
    Write-Host "`n4. Analizando estructura de la primera noticia..." -ForegroundColor Yellow
    $primeraNoticia = $todasNoticias.noticias[0]
    
    Write-Host "   Campos presentes:" -ForegroundColor White
    
    $camposRequeridos = @('_id', 'titulo', 'contenido', 'imagenPortada', 'orientacionImagen', 'autor', 'fechaPublicacion', 'publicada', 'visitas', 'auspiciadores')
    
    foreach ($campo in $camposRequeridos) {
        $valor = $primeraNoticia.$campo
        if ($null -ne $valor) {
            Write-Host "      ✅ $campo : " -NoNewline -ForegroundColor Green
            if ($campo -eq 'imagenPortada' -and $valor.Length -gt 50) {
                Write-Host "$($valor.Substring(0, 50))..." -ForegroundColor Gray
            } elseif ($campo -eq 'contenido' -and $valor.Length -gt 50) {
                Write-Host "$($valor.Substring(0, 50))..." -ForegroundColor Gray
            } elseif ($campo -eq 'auspiciadores') {
                Write-Host "Array con $($valor.Count) elementos" -ForegroundColor Gray
            } else {
                Write-Host "$valor" -ForegroundColor Gray
            }
        } else {
            Write-Host "      ⚠️  $campo : NO PRESENTE" -ForegroundColor Yellow
        }
    }
}

# Resumen final
Write-Host "`n=== RESUMEN DEL DIAGNÓSTICO ===" -ForegroundColor Cyan
Write-Host ""

if ($todasNoticias.cantidad -eq 0) {
    Write-Host "🔴 PROBLEMA IDENTIFICADO:" -ForegroundColor Red
    Write-Host "   No hay noticias en la base de datos" -ForegroundColor White
    Write-Host ""
    Write-Host "📝 SOLUCIÓN:" -ForegroundColor Green
    Write-Host "   Ejecuta: .\test-noticias-crear.ps1" -ForegroundColor White
    Write-Host "   Esto creará 2 noticias de prueba" -ForegroundColor White
} elseif ($todasNoticias.cantidad -gt 0) {
    Write-Host "✅ TODO ESTÁ FUNCIONANDO CORRECTAMENTE" -ForegroundColor Green
    Write-Host ""
    Write-Host "   Si no ves las noticias en el frontend:" -ForegroundColor Yellow
    Write-Host "   1. Abre la consola del navegador (F12)" -ForegroundColor White
    Write-Host "   2. Ve a la pestaña 'Console'" -ForegroundColor White
    Write-Host "   3. Busca mensajes que empiecen con '🔄 Cargando noticias...'" -ForegroundColor White
    Write-Host "   4. Verifica si hay errores en rojo" -ForegroundColor White
    Write-Host ""
    Write-Host "   Posibles problemas en el frontend:" -ForegroundColor Yellow
    Write-Host "   • El servicio NoticiasService no está inyectado correctamente" -ForegroundColor White
    Write-Host "   • El token JWT no se está enviando en las peticiones" -ForegroundColor White
    Write-Host "   • CORS está bloqueando las peticiones" -ForegroundColor White
    Write-Host "   • El componente no está llamando a cargarNoticias()" -ForegroundColor White
}

Write-Host ""
Write-Host "=== FIN DEL DIAGNÓSTICO ===" -ForegroundColor Cyan
