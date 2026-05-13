# Script para actualizar contraseña del administrador
# Usuario: d1eg0
# Nueva contraseña: D1eg0#

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Actualizar Contraseña Administrador" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Cargar módulos necesarios
Write-Host "Verificando dependencias..." -ForegroundColor Yellow

$bcryptjs = "const bcrypt = require('bcryptjs'); const password = 'D1eg0#'; const salt = bcrypt.genSaltSync(10); const hash = bcrypt.hashSync(password, salt); console.log(hash);"

# Generar hash de la contraseña
Write-Host "Generando hash de la contraseña..." -ForegroundColor Yellow
$hashedPassword = node -e $bcryptjs

if (-not $hashedPassword) {
    Write-Host "Error al generar hash de contraseña" -ForegroundColor Red
    exit 1
}

Write-Host "Hash generado exitosamente" -ForegroundColor Green
Write-Host ""

# Script para actualizar en MongoDB
$updateScript = @"
const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
  _id: String,
  email: String,
  password: String,
  nombrePersonal: String,
  nombreUsuario: String,
  rut: String,
  fechaNacimiento: Date,
  posicion: String,
  telefono: String,
  direccion: String,
  nombreApoderado: String,
  telefonoApoderado: String,
  activo: Boolean,
  isAdmin: Boolean,
  fechaCreacion: Date,
  fechaActualizacion: Date
}, { collection: 'usuarios' });

const Usuario = mongoose.model('Usuario', usuarioSchema);

async function actualizarPassword() {
  try {
    await mongoose.connect('mongodb://admin:Linare`$2026@localhost:27017/db-linarescolleges?authSource=admin');
    console.log('Conectado a MongoDB');

    const resultado = await Usuario.updateOne(
      { nombreUsuario: 'd1eg0' },
      { 
        `$set: { 
          password: '$hashedPassword',
          fechaActualizacion: new Date()
        }
      }
    );

    if (resultado.matchedCount === 0) {
      console.log('ERROR: No se encontró el usuario d1eg0');
      process.exit(1);
    }

    if (resultado.modifiedCount === 0) {
      console.log('ADVERTENCIA: Usuario encontrado pero no se modificó');
    } else {
      console.log('SUCCESS: Contraseña actualizada exitosamente');
      console.log('Usuario: d1eg0');
      console.log('Nueva contraseña: D1eg0#');
    }

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('ERROR:', error.message);
    process.exit(1);
  }
}

actualizarPassword();
"@

# Guardar script temporal
$tempFile = "temp-update-password.js"
$updateScript | Out-File -FilePath $tempFile -Encoding UTF8

Write-Host "Ejecutando actualización en MongoDB..." -ForegroundColor Yellow
Write-Host ""

# Ejecutar script
$output = node $tempFile 2>&1

# Mostrar resultado
$output | ForEach-Object {
    if ($_ -match "SUCCESS") {
        Write-Host $_ -ForegroundColor Green
    } elseif ($_ -match "ERROR") {
        Write-Host $_ -ForegroundColor Red
    } elseif ($_ -match "ADVERTENCIA") {
        Write-Host $_ -ForegroundColor Yellow
    } else {
        Write-Host $_ -ForegroundColor White
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan

# Limpiar archivo temporal
Remove-Item $tempFile -ErrorAction SilentlyContinue

# Verificar si fue exitoso
if ($output -match "SUCCESS") {
    Write-Host "[OK] Contrasena actualizada correctamente" -ForegroundColor Green
    Write-Host ""
    Write-Host "Credenciales actualizadas:" -ForegroundColor Cyan
    Write-Host "  Email: diegocastroh10@hotmail.com" -ForegroundColor White
    Write-Host "  Usuario: d1eg0" -ForegroundColor White
    Write-Host "  Contrasena: D1eg0#" -ForegroundColor White
    Write-Host ""
    Write-Host "Ahora puedes iniciar sesion con estas credenciales" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Error al actualizar contrasena" -ForegroundColor Red
    exit 1
}
