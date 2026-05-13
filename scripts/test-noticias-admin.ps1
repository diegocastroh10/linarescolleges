# Script de prueba para operaciones de administrador
Write-Host "=== PRUEBA: Operaciones de Administrador ===" -ForegroundColor Cyan

# 1. Login como administrador
Write-Host "`n1. Iniciando sesión como administrador..." -ForegroundColor Yellow
$loginResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/usuarios/login" `
    -Method Post `
    -ContentType "application/json" `
    -Body (@{
        email = "administrador@linarescolleges.com"
        password = "Admin123456"
    } | ConvertTo-Json)

$token = $loginResponse.token
$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}
Write-Host "✅ Login exitoso" -ForegroundColor Green

# 2. Crear noticia de prueba
Write-Host "`n2. Creando noticia de prueba..." -ForegroundColor Yellow
$nuevaNoticia = @{
    titulo = "Noticia de prueba para actualización y publicación"
    contenido = "<p>Esta es una noticia de prueba que será modificada.</p>"
    imagenPortada = "https://via.placeholder.com/800x450"
    orientacionImagen = "horizontal"
    autor = "Test Admin"
    fechaPublicacion = (Get-Date).ToString("yyyy-MM-dd")
    publicada = $false
} | ConvertTo-Json

$noticiaCreada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
    -Method Post `
    -Headers $headers `
    -Body $nuevaNoticia

$noticiaId = $noticiaCreada.noticia._id
Write-Host "✅ Noticia creada con ID: $noticiaId" -ForegroundColor Green

# 3. Obtener noticia por ID
Write-Host "`n3. Obteniendo noticia por ID..." -ForegroundColor Yellow
$noticiaObtenida = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Noticia obtenida" -ForegroundColor Green
Write-Host "   Título: $($noticiaObtenida.noticia.titulo)" -ForegroundColor White
Write-Host "   Publicada: $($noticiaObtenida.noticia.publicada)" -ForegroundColor White

# 4. Actualizar noticia
Write-Host "`n4. Actualizando noticia..." -ForegroundColor Yellow
$datosActualizados = @{
    titulo = "Noticia ACTUALIZADA - Nueva información importante"
    contenido = "<p>Esta noticia ha sido <strong>actualizada</strong> con nuevo contenido.</p><p>Ahora incluye más información relevante.</p>"
    auspiciadores = @(
        "https://via.placeholder.com/200x100/ff6b6b/ffffff?text=Nuevo+Sponsor"
    )
} | ConvertTo-Json

$noticiaActualizada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId" `
    -Method Put `
    -Headers $headers `
    -Body $datosActualizados

Write-Host "✅ Noticia actualizada" -ForegroundColor Green
Write-Host "   Nuevo título: $($noticiaActualizada.noticia.titulo)" -ForegroundColor White
Write-Host "   Auspiciadores: $($noticiaActualizada.noticia.auspiciadores.Count)" -ForegroundColor White

# 5. Alternar publicación (publicar)
Write-Host "`n5. Publicando noticia..." -ForegroundColor Yellow
$noticiaPublicada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId/publicar" `
    -Method Put `
    -Headers $headers

Write-Host "✅ Estado de publicación cambiado" -ForegroundColor Green
Write-Host "   Publicada: $($noticiaPublicada.noticia.publicada)" -ForegroundColor White

# 6. Verificar que aparece en endpoint público
Write-Host "`n6. Verificando que aparece en noticias públicas..." -ForegroundColor Yellow
$noticiasPublicas = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publicas" `
    -Method Get

$encontrada = $noticiasPublicas.noticias | Where-Object { $_._id -eq $noticiaId }
if ($encontrada) {
    Write-Host "✅ La noticia aparece en el endpoint público" -ForegroundColor Green
} else {
    Write-Host "❌ La noticia NO aparece en el endpoint público" -ForegroundColor Red
}

# 7. Despublicar noticia
Write-Host "`n7. Despublicando noticia..." -ForegroundColor Yellow
$noticiaDespublicada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId/publicar" `
    -Method Put `
    -Headers $headers

Write-Host "✅ Estado cambiado" -ForegroundColor Green
Write-Host "   Publicada: $($noticiaDespublicada.noticia.publicada)" -ForegroundColor White

# 8. Verificar que ya no aparece en endpoint público
Write-Host "`n8. Verificando que ya no aparece en noticias públicas..." -ForegroundColor Yellow
$noticiasPublicas2 = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/publicas" `
    -Method Get

$encontrada2 = $noticiasPublicas2.noticias | Where-Object { $_._id -eq $noticiaId }
if (-not $encontrada2) {
    Write-Host "✅ La noticia ya no aparece en el endpoint público" -ForegroundColor Green
} else {
    Write-Host "❌ ERROR: La noticia todavía aparece en el endpoint público" -ForegroundColor Red
}

# 9. Eliminar noticia
Write-Host "`n9. Eliminando noticia de prueba..." -ForegroundColor Yellow
try {
    Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId" `
        -Method Delete `
        -Headers $headers
    
    Write-Host "✅ Noticia eliminada exitosamente" -ForegroundColor Green
} catch {
    Write-Host "❌ Error al eliminar noticia" -ForegroundColor Red
}

# 10. Verificar que ya no existe
Write-Host "`n10. Verificando eliminación..." -ForegroundColor Yellow
try {
    $noticiaEliminada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$noticiaId" `
        -Method Get `
        -Headers $headers `
        -ErrorAction Stop
    
    Write-Host "❌ ERROR: La noticia todavía existe" -ForegroundColor Red
} catch {
    if ($_.Exception.Response.StatusCode -eq 404) {
        Write-Host "✅ Correcto: Noticia no encontrada (404)" -ForegroundColor Green
    } else {
        Write-Host "❌ Error inesperado: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
