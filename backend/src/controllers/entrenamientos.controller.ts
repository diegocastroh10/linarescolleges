import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, HttpStatus, HttpException } from '@nestjs/common';
import { EntrenamientosService } from '../services/entrenamientos.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RolesGuard } from '../guards/roles.guard';
import { Roles } from '../decorators/roles.decorator';
import { Public } from '../decorators/public.decorator';
import { UserRole } from '../enums/roles.enum';
import { DiaSemana } from '../enums/entrenamientos.enum';

@Controller('api/entrenamientos')
@UseGuards(JwtAuthGuard)
export class EntrenamientosController {
  constructor(private readonly entrenamientosService: EntrenamientosService) {}

  // ==================== ENDPOINTS PÚBLICOS ====================
  
  // Obtener todos los entrenamientos (PÚBLICO - para vista de usuarios)
  @Public()
  @Get('publico')
  async obtenerTodosPublico() {
    try {
      const entrenamientos = await this.entrenamientosService.obtenerTodos();
      return {
        mensaje: 'Entrenamientos obtenidos exitosamente',
        cantidad: entrenamientos.length,
        entrenamientos
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener entrenamientos por día (PÚBLICO)
  @Public()
  @Get('publico/dia/:dia')
  async obtenerPorDiaPublico(@Param('dia') dia: DiaSemana) {
    try {
      const entrenamientos = await this.entrenamientosService.obtenerPorDia(dia);
      return {
        mensaje: `Entrenamientos del ${dia} obtenidos exitosamente`,
        cantidad: entrenamientos.length,
        entrenamientos
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // ==================== ENDPOINTS PROTEGIDOS (ADMIN) ====================

  // Obtener todos los entrenamientos (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get()
  async obtenerTodos() {
    try {
      const entrenamientos = await this.entrenamientosService.obtenerTodos();
      return {
        mensaje: 'Entrenamientos obtenidos exitosamente',
        cantidad: entrenamientos.length,
        entrenamientos
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener entrenamientos por día (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get('dia/:dia')
  async obtenerPorDia(@Param('dia') dia: DiaSemana) {
    try {
      const entrenamientos = await this.entrenamientosService.obtenerPorDia(dia);
      return {
        mensaje: `Entrenamientos del ${dia} obtenidos exitosamente`,
        cantidad: entrenamientos.length,
        entrenamientos
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Obtener entrenamiento por ID (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      const entrenamiento = await this.entrenamientosService.obtenerPorId(id);
      return {
        mensaje: 'Entrenamiento encontrado',
        entrenamiento
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Crear nuevo entrenamiento (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Post()
  async crear(@Body() entrenamientoData: any) {
    try {
      const entrenamiento = await this.entrenamientosService.crear(entrenamientoData);
      return {
        mensaje: 'Entrenamiento creado exitosamente',
        entrenamiento
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Actualizar entrenamiento (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() datosActualizados: any) {
    try {
      const entrenamiento = await this.entrenamientosService.actualizar(id, datosActualizados);
      return {
        mensaje: 'Entrenamiento actualizado exitosamente',
        entrenamiento
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Eliminar entrenamiento (Admin y SuperAdmin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    try {
      const resultado = await this.entrenamientosService.eliminar(id);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }
}
