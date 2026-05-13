import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { DiaSemana, CategoriaEntrenamiento, NivelEntrenamiento } from '../enums/entrenamientos.enum';

export type EntrenamientoDocument = Entrenamiento & Document;

@Schema({ collection: 'entrenamientos' })
export class Entrenamiento {
  @Prop({ type: String, default: () => uuidv4() })
  _id: string;

  @Prop({ required: true, enum: DiaSemana })
  dia: DiaSemana;

  @Prop({ required: true, type: [String], enum: CategoriaEntrenamiento })
  categorias: CategoriaEntrenamiento[];

  @Prop({ required: true })
  horario: string; // Formato: "17:00" o "17:00-19:00"

  @Prop({ required: true })
  lugar: string; // Ej: "Gimnasio Municipal", "Cancha Techada"

  @Prop({ required: true })
  profesorACargo: string;

  @Prop({ required: true, enum: NivelEntrenamiento })
  nivel: NivelEntrenamiento;

  @Prop({ required: false, default: '' })
  observaciones: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;
}

export const EntrenamientoSchema = SchemaFactory.createForClass(Entrenamiento);
