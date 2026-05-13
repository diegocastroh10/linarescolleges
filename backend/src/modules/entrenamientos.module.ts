import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Entrenamiento, EntrenamientoSchema } from '../models/entrenamiento.model';
import { EntrenamientosService } from '../services/entrenamientos.service';
import { EntrenamientosController } from '../controllers/entrenamientos.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Entrenamiento.name, schema: EntrenamientoSchema }
    ])
  ],
  controllers: [EntrenamientosController],
  providers: [EntrenamientosService],
  exports: [EntrenamientosService]
})
export class EntrenamientosModule {}
