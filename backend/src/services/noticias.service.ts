import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Noticia } from '../models/noticia.model';

@Injectable()
export class NoticiasService {
  constructor(
    @InjectModel(Noticia.name) private noticiaModel: Model<Noticia>
  ) {}

  // Crear noticia (solo admin/superadmin)
  async crear(datosNoticia: Partial<Noticia>): Promise<Noticia> {
    const nuevaNoticia = new this.noticiaModel(datosNoticia);
    return await nuevaNoticia.save();
  }

  // Obtener todas las noticias (público - solo publicadas)
  async obtenerPublicadas(): Promise<Noticia[]> {
    return await this.noticiaModel
      .find({ publicada: true })
      .sort({ fechaPublicacion: -1 })
      .exec();
  }

  // Obtener todas las noticias (admin - incluye no publicadas)
  async obtenerTodas(): Promise<Noticia[]> {
    return await this.noticiaModel
      .find()
      .sort({ fechaPublicacion: -1 })
      .exec();
  }

  // Obtener noticia por ID (público)
  async obtenerPorId(id: string): Promise<Noticia> {
    const noticia = await this.noticiaModel.findById(id).exec();
    if (!noticia) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada`);
    }
    return noticia;
  }

  // Incrementar visitas
  async incrementarVisitas(id: string): Promise<void> {
    await this.noticiaModel.findByIdAndUpdate(
      id,
      { $inc: { visitas: 1 } },
      { new: true }
    ).exec();
  }

  // Obtener últimas noticias (público)
  async obtenerUltimas(limite: number = 5): Promise<Noticia[]> {
    return await this.noticiaModel
      .find({ publicada: true })
      .sort({ fechaPublicacion: -1 })
      .limit(limite)
      .exec();
  }

  // Actualizar noticia (admin/superadmin)
  async actualizar(id: string, datosActualizados: Partial<Noticia>): Promise<Noticia> {
    const noticiaActualizada = await this.noticiaModel
      .findByIdAndUpdate(id, datosActualizados, { new: true })
      .exec();
    
    if (!noticiaActualizada) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada`);
    }
    
    return noticiaActualizada;
  }

  // Eliminar noticia (admin/superadmin)
  async eliminar(id: string): Promise<{ mensaje: string }> {
    const resultado = await this.noticiaModel.findByIdAndDelete(id).exec();
    
    if (!resultado) {
      throw new NotFoundException(`Noticia con ID ${id} no encontrada`);
    }
    
    return { mensaje: 'Noticia eliminada exitosamente' };
  }

  // Alternar publicación (admin/superadmin)
  async alternarPublicacion(id: string): Promise<Noticia> {
    const noticia = await this.obtenerPorId(id);
    noticia.publicada = !noticia.publicada;
    return await noticia.save();
  }
}
