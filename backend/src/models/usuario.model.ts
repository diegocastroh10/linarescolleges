import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { UserRole } from '../enums/roles.enum';

export type UsuarioDocument = Usuario & Document;

@Schema({ collection: 'usuarios' })
export class Usuario {
  @Prop({ type: String, default: () => uuidv4() })
  _id: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: true })
  nombrePersonal: string;

  @Prop({ required: true, unique: true })
  nombreUsuario: string;

  @Prop({ required: true, unique: true })
  rut: string;

  @Prop({ required: true })
  fechaNacimiento: Date;

  @Prop({ required: true })
  posicion: string; // Posición en el baloncesto

  @Prop({ required: true })
  telefono: string;

  @Prop({ required: true })
  direccion: string;

  @Prop({ required: false })
  nombreApoderado: string;

  @Prop({ required: false })
  telefonoApoderado: string;

  @Prop({ default: Date.now })
  fechaCreacion: Date;

  @Prop({ default: Date.now })
  fechaActualizacion: Date;

  @Prop({ default: true })
  activo: boolean;

  @Prop({ type: String, enum: UserRole, default: UserRole.PERSONA })
  rol: UserRole;

  @Prop({ required: false })
  fotoPerfil: string; // URL o base64 de la foto de perfil

  @Prop({ required: false })
  resetPasswordToken: string;

  @Prop({ required: false })
  resetPasswordExpires: Date;
}

export const UsuarioSchema = SchemaFactory.createForClass(Usuario);
