# Script de prueba para crear noticias
Write-Host "=== PRUEBA: Crear Noticia ===" -ForegroundColor Cyan

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
Write-Host "✅ Login exitoso. Token obtenido." -ForegroundColor Green

# 2. Crear nueva noticia
Write-Host "`n2. Creando nueva noticia..." -ForegroundColor Yellow
$nuevaNoticia = @{
    titulo = "Gran victoria del equipo en el torneo regional"
    contenido = "<p>El equipo de <strong>Linares Colleges</strong> logró una <em>impresionante victoria</em> en el torneo regional de fútbol.</p><p>Con un marcador de 3-0, nuestros jugadores demostraron un excelente nivel de juego y trabajo en equipo.</p><h3>Goles destacados</h3><ul><li>Minuto 15: Gol de Juan Pérez</li><li>Minuto 32: Gol de Carlos Muñoz</li><li>Minuto 78: Gol de Diego Fernández</li></ul><p>¡Felicitaciones a todo el equipo por este gran logro!</p>"
    imagenPortada = "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=800"
    orientacionImagen = "horizontal"
    autor = "Juan Pérez"
    fechaPublicacion = (Get-Date).ToString("yyyy-MM-dd")
    urlInstagram = "https://www.instagram.com/p/ejemplo123/"
    auspiciadores = @(
        "https://via.placeholder.com/200x100/667eea/ffffff?text=Sponsor+1"
        "https://via.placeholder.com/200x100/764ba2/ffffff?text=Sponsor+2"
    )
    publicada = $true
} | ConvertTo-Json

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

$noticiaCreada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
    -Method Post `
    -Headers $headers `
    -Body $nuevaNoticia

Write-Host "✅ Noticia creada exitosamente" -ForegroundColor Green
Write-Host "   ID: $($noticiaCreada.noticia._id)" -ForegroundColor White
Write-Host "   Título: $($noticiaCreada.noticia.titulo)" -ForegroundColor White

# 3. Crear otra noticia (borrador)
Write-Host "`n3. Creando noticia en borrador..." -ForegroundColor Yellow
$noticiaBorrador = @{
    titulo = "Próximo partido: Preparativos y estrategia del equipo"
    contenido = "<p>El próximo sábado enfrentaremos a nuestro rival histórico en un partido crucial para la clasificación.</p><p>El cuerpo técnico ha estado trabajando intensamente en la estrategia y los jugadores muestran una gran motivación.</p>"
    imagenPortada = "https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800"
    orientacionImagen = "vertical"
    autor = "María González"
    fechaPublicacion = (Get-Date).AddDays(3).ToString("yyyy-MM-dd")
    publicada = $false
} | ConvertTo-Json

$borradorCreado = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
    -Method Post `
    -Headers $headers `
    -Body $noticiaBorrador

Write-Host "✅ Borrador creado exitosamente" -ForegroundColor Green
Write-Host "   ID: $($borradorCreado.noticia._id)" -ForegroundColor White
Write-Host "   Título: $($borradorCreado.noticia.titulo)" -ForegroundColor White
Write-Host "   Estado: Borrador (no publicada)" -ForegroundColor Yellow

# 4. Listar todas las noticias (admin)
Write-Host "`n4. Listando todas las noticias (incluye borradores)..." -ForegroundColor Yellow
$todasNoticias = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
    -Method Get `
    -Headers $headers

Write-Host "✅ Total de noticias: $($todasNoticias.cantidad)" -ForegroundColor Green
foreach ($noticia in $todasNoticias.noticias) {
    $estado = if ($noticia.publicada) { "✅ Publicada" } else { "❌ Borrador" }
    Write-Host "   - $($noticia.titulo) - $estado" -ForegroundColor White
}

Write-Host "`n=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
