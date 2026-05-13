# Script de prueba para crear noticias con imágenes en base64
Write-Host "=== PRUEBA: Crear Noticia con Imágenes Base64 ===" -ForegroundColor Cyan

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

# Función para convertir imagen a base64
function Convert-ImageToBase64 {
    param(
        [string]$ImagePath
    )
    
    if (Test-Path $ImagePath) {
        $imageBytes = [System.IO.File]::ReadAllBytes($ImagePath)
        $extension = [System.IO.Path]::GetExtension($ImagePath).ToLower()
        
        $mimeType = switch ($extension) {
            ".jpg"  { "image/jpeg" }
            ".jpeg" { "image/jpeg" }
            ".png"  { "image/png" }
            ".gif"  { "image/gif" }
            ".webp" { "image/webp" }
            default { "image/jpeg" }
        }
        
        $base64 = [Convert]::ToBase64String($imageBytes)
        return "data:$mimeType;base64,$base64"
    } else {
        Write-Host "⚠️  Archivo no encontrado: $ImagePath" -ForegroundColor Yellow
        return $null
    }
}

# Crear imagen de ejemplo si no existe
$testImagePath = ".\test-image-noticia.png"
if (-not (Test-Path $testImagePath)) {
    Write-Host "`n📸 Generando imagen de prueba..." -ForegroundColor Yellow
    
    # Crear una imagen simple usando .NET (1x1 pixel)
    Add-Type -AssemblyName System.Drawing
    $bitmap = New-Object System.Drawing.Bitmap(800, 450)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    $graphics.Clear([System.Drawing.Color]::FromArgb(102, 126, 234))
    
    # Agregar texto
    $font = New-Object System.Drawing.Font("Arial", 40, [System.Drawing.FontStyle]::Bold)
    $brush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
    $point = New-Object System.Drawing.Point(150, 200)
    $graphics.DrawString("Noticia de Prueba", $font, $brush, $point)
    
    $bitmap.Save($testImagePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $graphics.Dispose()
    $bitmap.Dispose()
    
    Write-Host "✅ Imagen de prueba creada: $testImagePath" -ForegroundColor Green
}

# 2. Convertir imagen a base64
Write-Host "`n2. Convirtiendo imagen a base64..." -ForegroundColor Yellow
$imagenBase64 = Convert-ImageToBase64 -ImagePath $testImagePath

if ($imagenBase64) {
    $tamanoBase64 = [Math]::Round($imagenBase64.Length / 1024, 2)
    Write-Host "✅ Imagen convertida exitosamente" -ForegroundColor Green
    Write-Host "   Tamaño base64: $tamanoBase64 KB" -ForegroundColor White
    Write-Host "   Primeros 50 caracteres: $($imagenBase64.Substring(0, 50))..." -ForegroundColor Gray
} else {
    Write-Host "❌ No se pudo convertir la imagen" -ForegroundColor Red
    Write-Host "`n💡 NOTA: Este script demuestra cómo funciona el sistema." -ForegroundColor Cyan
    Write-Host "   En la aplicación web, las imágenes se cargan desde el navegador." -ForegroundColor Cyan
    exit
}

# 3. Crear nueva noticia con imagen base64
Write-Host "`n3. Creando noticia con imagen en base64..." -ForegroundColor Yellow
$nuevaNoticia = @{
    titulo = "Gran victoria del equipo - Imagen cargada desde archivo"
    contenido = "<p>El equipo de <strong>Linares Colleges</strong> logró una victoria histórica.</p><p>Esta noticia incluye una imagen cargada directamente desde el sistema de archivos local, convertida a base64 para almacenamiento.</p>"
    imagenPortada = $imagenBase64
    orientacionImagen = "horizontal"
    autor = "Sistema de Pruebas"
    fechaPublicacion = (Get-Date).ToString("yyyy-MM-dd")
    auspiciadores = @()
    publicada = $true
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer $token"
    "Content-Type" = "application/json"
}

try {
    $noticiaCreada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias" `
        -Method Post `
        -Headers $headers `
        -Body $nuevaNoticia
    
    Write-Host "✅ Noticia creada exitosamente con imagen base64" -ForegroundColor Green
    Write-Host "   ID: $($noticiaCreada.noticia._id)" -ForegroundColor White
    Write-Host "   Título: $($noticiaCreada.noticia.titulo)" -ForegroundColor White
    
    $tamanoImagenGuardada = [Math]::Round($noticiaCreada.noticia.imagenPortada.Length / 1024, 2)
    Write-Host "   Tamaño imagen almacenada: $tamanoImagenGuardada KB" -ForegroundColor White
    
    # Verificar que la imagen se puede recuperar
    Write-Host "`n4. Verificando que la imagen se recupera correctamente..." -ForegroundColor Yellow
    $noticiaRecuperada = Invoke-RestMethod -Uri "http://localhost:3000/api/noticias/$($noticiaCreada.noticia._id)" `
        -Method Get `
        -Headers $headers
    
    if ($noticiaRecuperada.noticia.imagenPortada.StartsWith("data:image")) {
        Write-Host "✅ Imagen recuperada correctamente en formato base64" -ForegroundColor Green
        Write-Host "   Formato: $($noticiaRecuperada.noticia.imagenPortada.Substring(0, 30))..." -ForegroundColor Gray
    } else {
        Write-Host "⚠️  La imagen no está en formato base64 esperado" -ForegroundColor Yellow
    }
    
} catch {
    Write-Host "❌ Error al crear noticia" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    
    if ($_.ErrorDetails.Message) {
        Write-Host "Detalles: $($_.ErrorDetails.Message)" -ForegroundColor Red
    }
}

Write-Host "`n=== INFORMACIÓN IMPORTANTE ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "📋 Cómo funciona el sistema:" -ForegroundColor Yellow
Write-Host "   1. En el navegador, el usuario selecciona una imagen con <input type='file'>" -ForegroundColor White
Write-Host "   2. JavaScript lee el archivo y lo convierte a base64 usando FileReader" -ForegroundColor White
Write-Host "   3. El base64 se envía al backend en el campo 'imagenPortada'" -ForegroundColor White
Write-Host "   4. MongoDB almacena el string base64 directamente" -ForegroundColor White
Write-Host "   5. Al mostrar la imagen, se usa: <img [src]='imagenBase64'>" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Limitaciones:" -ForegroundColor Yellow
Write-Host "   - Tamaño máximo portada: 5 MB" -ForegroundColor White
Write-Host "   - Tamaño máximo auspiciadores: 2 MB c/u" -ForegroundColor White
Write-Host "   - El base64 aumenta ~33% el tamaño del archivo" -ForegroundColor White
Write-Host ""
Write-Host "💡 Ventajas:" -ForegroundColor Yellow
Write-Host "   ✅ No requiere servidor de archivos separado" -ForegroundColor White
Write-Host "   ✅ No requiere configurar AWS S3, Cloudinary, etc." -ForegroundColor White
Write-Host "   ✅ Las imágenes siempre están disponibles" -ForegroundColor White
Write-Host "   ✅ Funciona desde cualquier dispositivo (PC/móvil)" -ForegroundColor White
Write-Host ""
Write-Host "=== PRUEBA COMPLETADA ===" -ForegroundColor Cyan
