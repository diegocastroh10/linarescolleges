import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ collection: 'noticias', timestamps: true })
export class Noticia extends Document {
  @Prop({ required: true })
  titulo: string;

  @Prop({ required: true })
  contenido: string; // Contenido en formato HTML (rich text)

  @Prop({ required: true })
  imagenPortada: string; // URL de la imagen

  @Prop({ required: true })
  orientacionImagen: 'horizontal' | 'vertical'; // Tipo de banner

  @Prop({ required: true })
  autor: string; // Nombre del autor

  @Prop({ required: true })
  fechaPublicacion: Date;

  @Prop()
  urlInstagram?: string; // URL opcional del post de Instagram

  @Prop({ type: [String], default: [] })
  auspiciadores: string[]; // Array de URLs de logos de auspiciadores

  @Prop({ default: true })
  publicada: boolean;

  @Prop({ default: 0 })
  visitas: number;

  // Timestamps automáticos
  createdAt?: Date;
  updatedAt?: Date;
}

export const NoticiaSchema = SchemaFactory.createForClass(Noticia);
