import * as dotenv from 'dotenv';
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Aumentar el límite del body size para permitir imágenes en Base64
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  // Configurar CORS para permitir peticiones desde el frontend
  app.enableCors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(3000);
  console.log('🚀 Servidor corriendo en http://localhost:3000');
  console.log('📊 Base de datos conectada a MongoDB');
  console.log('📦 Body size limit: 10MB');
}

bootstrap();
