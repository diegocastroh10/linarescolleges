import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Entrenamiento, EntrenamientoDocument } from '../models/entrenamiento.model';
import { DiaSemana } from '../enums/entrenamientos.enum';

@Injectable()
export class EntrenamientosService {
  constructor(
    @InjectModel(Entrenamiento.name) private entrenamientoModel: Model<EntrenamientoDocument>,
  ) {}

  // Obtener todos los entrenamientos
  async obtenerTodos(): Promise<Entrenamiento[]> {
    return await this.entrenamientoModel.find().exec();
  }

  // Obtener entrenamientos por día
  async obtenerPorDia(dia: DiaSemana): Promise<Entrenamiento[]> {
    return await this.entrenamientoModel.find({ dia }).exec();
  }

  // Obtener entrenamiento por ID
  async obtenerPorId(id: string): Promise<Entrenamiento> {
    const entrenamiento = await this.entrenamientoModel.findById(id).exec();
    
    if (!entrenamiento) {
      throw new NotFoundException(`Entrenamiento con ID ${id} no encontrado`);
    }

    return entrenamiento;
  }

  // Crear nuevo entrenamiento
  async crear(entrenamientoData: any): Promise<Entrenamiento> {
    const nuevoEntrenamiento = new this.entrenamientoModel(entrenamientoData);
    return await nuevoEntrenamiento.save();
  }

  // Actualizar entrenamiento por ID
  async actualizar(id: string, datosActualizados: any): Promise<Entrenamiento> {
    datosActualizados.fechaActualizacion = new Date();

    const entrenamientoActualizado = await this.entrenamientoModel
      .findByIdAndUpdate(id, datosActualizados, { new: true })
      .exec();

    if (!entrenamientoActualizado) {
      throw new NotFoundException(`Entrenamiento con ID ${id} no encontrado`);
    }

    return entrenamientoActualizado;
  }

  // Eliminar entrenamiento por ID
  async eliminar(id: string): Promise<{ mensaje: string }> {
    const entrenamiento = await this.entrenamientoModel.findByIdAndDelete(id);

    if (!entrenamiento) {
      throw new NotFoundException(`Entrenamiento con ID ${id} no encontrado`);
    }

    return { mensaje: `Entrenamiento eliminado exitosamente` };
  }
}
