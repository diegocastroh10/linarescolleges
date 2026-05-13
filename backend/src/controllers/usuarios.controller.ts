import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards, Request } from '@nestjs/common';
import { UsuariosService, AuthResponse } from '../services/usuarios.service';
import { RolesGuard } from '../guards/roles.guard';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { UserRole } from '../enums/roles.enum';

@Controller('api/usuarios')
export class UsuariosController {
  constructor(private readonly usuariosService: UsuariosService) {}

  // Crear usuario (Register)
  @Public()
  @Post('register')
  async register(@Body() body: any) {
    try {
      const usuario = await this.usuariosService.crearUsuario(body);
      return {
        mensaje: 'Usuario creado exitosamente',
        usuario: {
          _id: usuario._id,
          email: usuario.email,
          nombrePersonal: usuario.nombrePersonal,
          nombreUsuario: usuario.nombreUsuario,
          rut: usuario.rut,
          telefono: usuario.telefono,
          posicion: usuario.posicion,
          direccion: usuario.direccion,
          nombreApoderado: usuario.nombreApoderado,
          telefonoApoderado: usuario.telefonoApoderado,
          fechaNacimiento: usuario.fechaNacimiento,
          fechaCreacion: usuario.fechaCreacion,
        }
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Login con JWT
  @Public()
  @Post('login')
  async login(@Body() body: { email: string; password: string }): Promise<{ mensaje: string } & AuthResponse> {
    try {
      const authResponse = await this.usuariosService.login(body.email, body.password);
      return {
        mensaje: 'Login exitoso',
        ...authResponse
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Refresh token
  @Public()
  @Post('refresh')
  async refreshToken(@Body() body: { refreshToken: string }) {
    try {
      const result = await this.usuariosService.refreshToken(body.refreshToken);
      return {
        mensaje: 'Token renovado exitosamente',
        ...result
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Obtener perfil del usuario autenticado
  @Get('perfil')
  async obtenerPerfil(@Request() req) {
    return {
      mensaje: 'Perfil obtenido exitosamente',
      usuario: req.user
    };
  }

  // Obtener todos los usuarios (protegido - solo admin/superadmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get()
  async obtenerUsuarios() {
    try {
      const usuarios = await this.usuariosService.obtenerUsuarios();
      return {
        mensaje: 'Usuarios obtenidos exitosamente',
        cantidad: usuarios.length,
        usuarios
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Buscar usuario por ID
  @Get('id/:id')
  async buscarPorId(@Param('id') id: string) {
    try {
      const usuario = await this.usuariosService.buscarPorId(id);
      return {
        mensaje: 'Usuario encontrado',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Buscar usuario por RUT
  @Get('rut/:rut')
  async buscarPorRut(@Param('rut') rut: string) {
    try {
      const usuario = await this.usuariosService.buscarPorRut(rut);
      return {
        mensaje: 'Usuario encontrado',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Buscar usuario por email
  @Get('email/:email')
  async buscarPorEmail(@Param('email') email: string) {
    try {
      const usuario = await this.usuariosService.buscarPorEmail(email);
      return {
        mensaje: 'Usuario encontrado',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Editar mi propio perfil (cualquier usuario autenticado)
  @Put('mi-perfil')
  async editarMiPerfil(@Request() req, @Body() body: any) {
    try {
      console.log('=== EDITAR MI PERFIL ===');
      console.log('req.user:', req.user);
      console.log('body:', body);
      
      if (!req.user) {
        console.error('ERROR: req.user no disponible');
        throw new HttpException('Usuario no autenticado', HttpStatus.UNAUTHORIZED);
      }
      
      // El JWT strategy puede devolver sub o _id dependiendo de cómo esté configurado
      const usuarioId = req.user.sub || req.user._id;
      console.log('ID del usuario:', usuarioId);
      
      if (!usuarioId) {
        console.error('ERROR: No se pudo obtener el ID del usuario');
        throw new HttpException('ID de usuario no disponible', HttpStatus.UNAUTHORIZED);
      }
      
      const usuario = await this.usuariosService.editarUsuarioPorId(usuarioId, body);
      console.log('Usuario actualizado correctamente');
      
      return {
        mensaje: 'Perfil actualizado exitosamente',
        usuario
      };
    } catch (error) {
      console.error('ERROR en editarMiPerfil:', error);
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Editar usuario por ID (protegido)
  @Put('id/:id')
  async editarPorId(@Param('id') id: string, @Body() body: any) {
    try {
      const usuario = await this.usuariosService.editarUsuarioPorId(id, body);
      return {
        mensaje: 'Usuario actualizado exitosamente',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Editar usuario por RUT (protegido)
  @Put('rut/:rut')
  async editarPorRut(@Param('rut') rut: string, @Body() body: any) {
    try {
      const usuario = await this.usuariosService.editarUsuarioPorRut(rut, body);
      return {
        mensaje: 'Usuario actualizado exitosamente',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Editar usuario por email (protegido)
  @Put('email/:email')
  async editarPorEmail(@Param('email') email: string, @Body() body: any) {
    try {
      const usuario = await this.usuariosService.editarUsuarioPorEmail(email, body);
      return {
        mensaje: 'Usuario actualizado exitosamente',
        usuario
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Eliminar usuario por ID (solo superadmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete('id/:id')
  async eliminarUsuario(@Param('id') id: string) {
    try {
      const resultado = await this.usuariosService.eliminarUsuario(id);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Desactivar cuenta de usuario (solo superadmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.SUPERADMIN)
  @Delete('desactivar/:rut')
  async desactivarCuenta(@Param('rut') rut: string) {
    try {
      const resultado = await this.usuariosService.desactivarCuenta(rut);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Solicitar recuperación de contraseña
  @Public()
  @Post('recuperar-password')
  async solicitarRecuperacionPassword(@Body() body: { email: string; frontendUrl: string }) {
    try {
      const resultado = await this.usuariosService.solicitarRecuperacionPassword(body.email, body.frontendUrl);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Verificar token de recuperación
  @Public()
  @Get('verificar-token/:token')
  async verificarToken(@Param('token') token: string) {
    try {
      await this.usuariosService.verificarTokenRecuperacion(token);
      return { mensaje: 'Token válido', valido: true };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.UNAUTHORIZED);
    }
  }

  // Restablecer contraseña
  @Public()
  @Post('restablecer-password')
  async restablecerPassword(@Body() body: { token: string; password: string }) {
    try {
      const resultado = await this.usuariosService.restablecerPassword(body.token, body.password);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
