import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Noticia, NoticiaSchema } from '../models/noticia.model';
import { NoticiasService } from '../services/noticias.service';
import { NoticiasController } from '../controllers/noticias.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Noticia.name, schema: NoticiaSchema }])
  ],
  controllers: [NoticiasController],
  providers: [NoticiasService],
  exports: [NoticiasService]
})
export class NoticiasModule {}
