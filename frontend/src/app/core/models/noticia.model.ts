export interface Noticia {
  _id?: string;
  titulo: string;
  contenido: string;
  imagenPortada: string;
  orientacionImagen: 'horizontal' | 'vertical';
  autor: string;
  fechaPublicacion: Date;
  urlInstagram?: string;
  auspiciadores: string[];
  publicada: boolean;
  visitas: number;
  createdAt?: Date;
  updatedAt?: Date;
}
