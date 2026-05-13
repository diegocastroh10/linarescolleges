import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_GUARD } from '@nestjs/core';
import { UsuariosModule } from './modules/usuarios.module';
import { AuthModule } from './modules/auth.module';
import { EntrenamientosModule } from './modules/entrenamientos.module';
import { NoticiasModule } from './modules/noticias.module';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { databaseConfig } from './config/database.config';

@Module({
  imports: [
    MongooseModule.forRoot(databaseConfig.uri),
    AuthModule,
    UsuariosModule,
    EntrenamientosModule,
    NoticiasModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
