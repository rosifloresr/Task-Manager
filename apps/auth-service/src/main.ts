import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module'; // <--- ¡OJO AQUÍ! Debe ser el de esta carpeta
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule); // O el módulo raíz que definiste
  app.useGlobalPipes(new ValidationPipe());
  
  await app.listen(3001); // Verifica que el puerto sea el 3001
  console.log('Auth-Service is running on: http://localhost:3001');
}
bootstrap();