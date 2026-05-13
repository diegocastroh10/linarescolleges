import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Usuario, UsuarioSchema } from '../models/usuario.model';
import { UsuariosService } from '../services/usuarios.service';
import { UsuariosController } from '../controllers/usuarios.controller';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Usuario.name, schema: UsuarioSchema }]),
    AuthModule
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService],
  exports: [UsuariosService]
})
export class UsuariosModule {}
