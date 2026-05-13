import { Controller, Get, Post, Put, Delete, Body, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { NoticiasService } from '../services/noticias.service';
import { Public } from '../decorators/public.decorator';
import { Roles } from '../decorators/roles.decorator';
import { RolesGuard } from '../guards/roles.guard';
import { UserRole } from '../enums/roles.enum';

@Controller('api/noticias')
export class NoticiasController {
  constructor(private readonly noticiasService: NoticiasService) {}

  // ========== ENDPOINTS PÚBLICOS ==========

  // Obtener todas las noticias publicadas
  @Public()
  @Get('publicas')
  async obtenerPublicadas() {
    try {
      const noticias = await this.noticiasService.obtenerPublicadas();
      return {
        mensaje: 'Noticias obtenidas exitosamente',
        cantidad: noticias.length,
        noticias
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener últimas noticias
  @Public()
  @Get('ultimas/:limite')
  async obtenerUltimas(@Param('limite') limite: string) {
    try {
      const noticias = await this.noticiasService.obtenerUltimas(parseInt(limite));
      return {
        mensaje: 'Últimas noticias obtenidas',
        cantidad: noticias.length,
        noticias
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener noticia por ID (público)
  @Public()
  @Get('publica/:id')
  async obtenerNoticiaPublica(@Param('id') id: string) {
    try {
      const noticia = await this.noticiasService.obtenerPorId(id);
      
      // Incrementar visitas
      await this.noticiasService.incrementarVisitas(id);
      
      return {
        mensaje: 'Noticia obtenida exitosamente',
        noticia
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // ========== ENDPOINTS PROTEGIDOS (ADMIN/SUPERADMIN) ==========

  // Obtener todas las noticias (incluye no publicadas)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get()
  async obtenerTodas() {
    try {
      const noticias = await this.noticiasService.obtenerTodas();
      return {
        mensaje: 'Todas las noticias obtenidas',
        cantidad: noticias.length,
        noticias
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  // Obtener noticia por ID (admin)
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Get(':id')
  async obtenerPorId(@Param('id') id: string) {
    try {
      const noticia = await this.noticiasService.obtenerPorId(id);
      return {
        mensaje: 'Noticia obtenida',
        noticia
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Crear noticia
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Post()
  async crear(@Body() body: any) {
    try {
      const noticia = await this.noticiasService.crear(body);
      return {
        mensaje: 'Noticia creada exitosamente',
        noticia
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Actualizar noticia
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Put(':id')
  async actualizar(@Param('id') id: string, @Body() body: any) {
    try {
      const noticia = await this.noticiasService.actualizar(id, body);
      return {
        mensaje: 'Noticia actualizada exitosamente',
        noticia
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }

  // Eliminar noticia
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Delete(':id')
  async eliminar(@Param('id') id: string) {
    try {
      const resultado = await this.noticiasService.eliminar(id);
      return resultado;
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.NOT_FOUND);
    }
  }

  // Alternar publicación
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMINISTRADOR, UserRole.SUPERADMIN)
  @Put(':id/publicar')
  async alternarPublicacion(@Param('id') id: string) {
    try {
      const noticia = await this.noticiasService.alternarPublicacion(id);
      return {
        mensaje: `Noticia ${noticia.publicada ? 'publicada' : 'despublicada'} exitosamente`,
        noticia
      };
    } catch (error) {
      throw new HttpException(error.message, error.status || HttpStatus.BAD_REQUEST);
    }
  }
}
