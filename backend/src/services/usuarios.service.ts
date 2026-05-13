import { Injectable, NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Usuario, UsuarioDocument } from '../models/usuario.model';
import { JwtService } from '@nestjs/jwt';
import { UserRole } from '../enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import { createEmailTransporter, recuperarPasswordTemplate } from '../config/email.config';

export interface AuthResponse {
  usuario: Usuario;
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class UsuariosService {
  constructor(
    @InjectModel(Usuario.name) private usuarioModel: Model<UsuarioDocument>,
    private jwtService: JwtService,
  ) {}

  // Crear usuario (Register)
  async crearUsuario(usuarioData: any): Promise<Usuario> {
    // Verificar si ya existe un usuario con el mismo email, RUT o nombreUsuario
    const usuarioExistente = await this.usuarioModel.findOne({
      $or: [{ email: usuarioData.email }, { rut: usuarioData.rut }, { nombreUsuario: usuarioData.nombreUsuario }]
    });

    if (usuarioExistente) {
      throw new ConflictException('Ya existe un usuario con ese email, RUT o nombre de usuario');
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(usuarioData.password, salt);

    const nuevoUsuario = new this.usuarioModel({
      ...usuarioData,
      password: hashedPassword,
    });

    return await nuevoUsuario.save();
  }

  // Login con JWT
  async login(email: string, password: string): Promise<AuthResponse> {
    const usuario = await this.usuarioModel.findOne({ email, activo: true });

    if (!usuario) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const esPasswordValido = await bcrypt.compare(password, usuario.password);

    if (!esPasswordValido) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    // Generar tokens
    const tokens = await this.generateTokens(usuario);

    // Remover password del objeto usuario
    const usuarioSinPassword = usuario.toObject();
    delete usuarioSinPassword.password;

    return {
      usuario: usuarioSinPassword,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  // Generar tokens JWT
  private async generateTokens(usuario: Usuario): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: usuario._id.toString(),
      email: usuario.email,
      rol: usuario.rol,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET,
      expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });

    return { accessToken, refreshToken };
  }

  // Refresh token
  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const usuario = await this.usuarioModel.findById(payload.sub);

      if (!usuario || !usuario.activo) {
        throw new UnauthorizedException('Usuario no encontrado o inactivo');
      }

      const newPayload = {
        sub: usuario._id.toString(),
        email: usuario.email,
        rol: usuario.rol,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET,
        expiresIn: (process.env.JWT_EXPIRES_IN || '1h') as any,
      });

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  // Obtener todos los usuarios
  async obtenerUsuarios(): Promise<Usuario[]> {
    return await this.usuarioModel.find().select('-password').exec();
  }

  // Buscar usuario por ID
  async buscarPorId(id: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findById(id).select('-password').exec();
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  // Buscar usuario por RUT
  async buscarPorRut(rut: string): Promise<Usuario> {
    // Normalizar RUT: si no tiene guión y tiene más de 1 dígito, agregarlo antes del último
    let rutNormalizado = rut;
    if (!rut.includes('-') && rut.length >= 2) {
      rutNormalizado = rut.slice(0, -1) + '-' + rut.slice(-1);
    }
    
    // Buscar por el RUT normalizado o el RUT original
    const usuario = await this.usuarioModel.findOne({
      $or: [
        { rut: rut },
        { rut: rutNormalizado }
      ]
    }).select('-password').exec();
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return usuario;
  }

  // Buscar usuario por nombre de usuario (email)
  async buscarPorEmail(email: string): Promise<Usuario> {
    const usuario = await this.usuarioModel.findOne({ email }).select('-password').exec();
    
    if (!usuario) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return usuario;
  }

  // Editar usuario por ID
  async editarUsuarioPorId(id: string, datosActualizados: any): Promise<Usuario> {
    // Si se va a actualizar la contraseña, encriptarla
    if (datosActualizados.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
    }

    // No permitir modificar el nombreUsuario
    delete datosActualizados.nombreUsuario;

    // Actualizar fecha de actualización
    datosActualizados.fechaActualizacion = new Date();

    const usuarioActualizado = await this.usuarioModel
      .findByIdAndUpdate(id, datosActualizados, { new: true })
      .select('-password')
      .exec();

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuarioActualizado;
  }

  // Editar usuario por RUT
  async editarUsuarioPorRut(rut: string, datosActualizados: any): Promise<Usuario> {
    // Si se va a actualizar la contraseña, encriptarla
    if (datosActualizados.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
    }

    // No permitir modificar el nombreUsuario
    delete datosActualizados.nombreUsuario;

    // Actualizar fecha de actualización
    datosActualizados.fechaActualizacion = new Date();

    const usuarioActualizado = await this.usuarioModel
      .findOneAndUpdate({ rut }, datosActualizados, { new: true })
      .select('-password')
      .exec();

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return usuarioActualizado;
  }

  // Editar usuario por email
  async editarUsuarioPorEmail(email: string, datosActualizados: any): Promise<Usuario> {
    // Si se va a actualizar la contraseña, encriptarla
    if (datosActualizados.password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(datosActualizados.password, salt);
    }

    // No permitir modificar el nombreUsuario
    delete datosActualizados.nombreUsuario;

    // Actualizar fecha de actualización
    datosActualizados.fechaActualizacion = new Date();

    const usuarioActualizado = await this.usuarioModel
      .findOneAndUpdate({ email }, datosActualizados, { new: true })
      .select('-password')
      .exec();

    if (!usuarioActualizado) {
      throw new NotFoundException(`Usuario con email ${email} no encontrado`);
    }

    return usuarioActualizado;
  }

  // Eliminar usuario por ID (solo admin)
  async eliminarUsuario(id: string): Promise<{ mensaje: string }> {
    const usuario = await this.usuarioModel.findByIdAndDelete(id);

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return { mensaje: `Usuario con ID ${id} ha sido eliminado permanentemente` };
  }

  // Desactivar cuenta de usuario (solo admin)
  async desactivarCuenta(rut: string): Promise<{ mensaje: string }> {
    const usuario = await this.usuarioModel.findOneAndUpdate(
      { rut },
      { activo: false },
      { new: true }
    );

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return { mensaje: `Cuenta del usuario con RUT ${rut} ha sido desactivada` };
  }

  // Solicitar recuperación de contraseña
  async solicitarRecuperacionPassword(email: string, frontendUrl: string): Promise<{ mensaje: string }> {
    const usuario = await this.usuarioModel.findOne({ email, activo: true });

    if (!usuario) {
      // Por seguridad, no revelamos si el usuario existe o no
      return { mensaje: 'Si existe una cuenta con ese correo, recibirás un email con instrucciones.' };
    }

    // Generar token único
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    // Establecer token y expiración (1 hora)
    usuario.resetPasswordToken = hashedToken;
    usuario.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hora
    
    await this.usuarioModel.updateOne(
      { _id: usuario._id },
      {
        resetPasswordToken: usuario.resetPasswordToken,
        resetPasswordExpires: usuario.resetPasswordExpires
      }
    );

    // Crear link de recuperación
    const resetLink = `${frontendUrl}/restablecer-password/${resetToken}`;

    // Enviar email
    try {
      const transporter = createEmailTransporter();
      const emailTemplate = recuperarPasswordTemplate(usuario.nombreUsuario, resetLink);

      await transporter.sendMail({
        from: '"Linares Colleges" <noreply@linarescolleges.cl>',
        to: usuario.email,
        subject: emailTemplate.subject,
        html: emailTemplate.html,
      });

      console.log('✅ Email de recuperación enviado a:', usuario.email);
    } catch (error) {
      console.error('❌ Error al enviar email:', error);
      throw new Error('Error al enviar el correo de recuperación. Intenta nuevamente más tarde.');
    }

    return { mensaje: 'Si existe una cuenta con ese correo, recibirás un email con instrucciones.' };
  }

  // Verificar token de recuperación
  async verificarTokenRecuperacion(token: string): Promise<Usuario> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const usuario = await this.usuarioModel.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
      activo: true
    });

    if (!usuario) {
      throw new UnauthorizedException('Token inválido o expirado');
    }

    return usuario;
  }

  // Restablecer contraseña con token
  async restablecerPassword(token: string, nuevaPassword: string): Promise<{ mensaje: string }> {
    const usuario = await this.verificarTokenRecuperacion(token);

    // Encriptar nueva contraseña
    const salt = await bcrypt.genSalt(10);
    usuario.password = await bcrypt.hash(nuevaPassword, salt);

    // Limpiar token de recuperación
    usuario.resetPasswordToken = undefined;
    usuario.resetPasswordExpires = undefined;
    usuario.fechaActualizacion = new Date();

    await this.usuarioModel.updateOne(
      { _id: usuario._id },
      {
        password: usuario.password,
        resetPasswordToken: null,
        resetPasswordExpires: null,
        fechaActualizacion: usuario.fechaActualizacion
      }
    );

    return { mensaje: 'Contraseña restablecida exitosamente' };
  }
}
