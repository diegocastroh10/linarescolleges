// Script para probar la configuración de email
require('dotenv').config();

console.log('=== CONFIGURACIÓN DE EMAIL ===');
console.log('EMAIL_USER:', process.env.EMAIL_USER);
console.log('EMAIL_PASSWORD (longitud):', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.length : 'NO DEFINIDA');
console.log('EMAIL_PASSWORD (primeros 4 chars):', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.substring(0, 4) : 'N/A');
console.log('EMAIL_PASSWORD (últimos 4 chars):', process.env.EMAIL_PASSWORD ? process.env.EMAIL_PASSWORD.substring(process.env.EMAIL_PASSWORD.length - 4) : 'N/A');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  },
  tls: {
    rejectUnauthorized: false
  }
});

console.log('\n=== VERIFICANDO CONEXIÓN ===');
transporter.verify(function(error, success) {
  if (error) {
    console.log('❌ ERROR:', error.message);
    console.log('Código:', error.code);
    console.log('Response:', error.response);
  } else {
    console.log('✅ Servidor listo para enviar emails');
  }
  process.exit(error ? 1 : 0);
});
