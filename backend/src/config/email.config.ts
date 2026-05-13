import * as nodemailer from 'nodemailer';

export const emailConfig = {
  // Configuración para Gmail
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para 465, false para 587
  auth: {
    user: process.env.EMAIL_USER || 'tu-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'tu-contraseña-de-aplicacion'
  },
  tls: {
    rejectUnauthorized: false
  }
};

// Crear transportador de email
export const createEmailTransporter = () => {
  return nodemailer.createTransport(emailConfig);
};

// Plantilla de email para recuperación de contraseña
export const recuperarPasswordTemplate = (nombreUsuario: string, resetLink: string) => {
  return {
    subject: 'Recuperación de Contraseña - Linares Colleges',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f5f7fa;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 20px auto;
            background: white;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
          }
          .header {
            background: linear-gradient(135deg, #ff5e00, #e67e22);
            padding: 30px;
            text-align: center;
            color: white;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
            letter-spacing: 2px;
          }
          .content {
            padding: 40px 30px;
          }
          .content h2 {
            color: #2d1b4e;
            margin-bottom: 20px;
          }
          .content p {
            color: #666;
            line-height: 1.6;
            margin-bottom: 20px;
          }
          .button {
            display: inline-block;
            padding: 15px 40px;
            background: linear-gradient(135deg, #ff5e00, #e67e22);
            color: white;
            text-decoration: none;
            border-radius: 8px;
            font-weight: bold;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 20px 0;
          }
          .button:hover {
            opacity: 0.9;
          }
          .warning {
            background: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 15px;
            margin: 20px 0;
            color: #856404;
          }
          .footer {
            background: #f5f7fa;
            padding: 20px;
            text-align: center;
            color: #999;
            font-size: 12px;
          }
          .basketball-icon {
            font-size: 48px;
            margin-bottom: 10px;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="basketball-icon">🏀</div>
            <h1>LINARES COLLEGES</h1>
            <p style="margin: 10px 0 0 0; font-size: 14px;">Basketball Club</p>
          </div>
          
          <div class="content">
            <h2>Hola, ${nombreUsuario}!</h2>
            
            <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Linares Colleges.</p>
            
            <p>Si fuiste tú quien solicitó este cambio, haz clic en el siguiente botón para crear una nueva contraseña:</p>
            
            <center>
              <a href="${resetLink}" class="button">Restablecer Contraseña</a>
            </center>
            
            <div class="warning">
              <strong>⚠️ Importante:</strong>
              <ul style="margin: 10px 0 0 20px;">
                <li>Este enlace es válido por <strong>1 hora</strong></li>
                <li>Solo puede usarse una vez</li>
                <li>Si no solicitaste este cambio, ignora este correo</li>
              </ul>
            </div>
            
            <p>Si el botón no funciona, copia y pega el siguiente enlace en tu navegador:</p>
            <p style="word-break: break-all; color: #ff5e00; font-size: 12px;">${resetLink}</p>
            
            <p style="margin-top: 30px; color: #999; font-size: 14px;">
              Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura.
            </p>
          </div>
          
          <div class="footer">
            <p><strong>Linares Colleges Basketball Club</strong></p>
            <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            <p>&copy; ${new Date().getFullYear()} Linares Colleges. Todos los derechos reservados.</p>
          </div>
        </div>
      </body>
      </html>
    `
  };
};
