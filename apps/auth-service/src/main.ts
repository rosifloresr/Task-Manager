import { NestFactory } from '@nestjs/core';
import { AuthModule } from './auth.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthModule); // Asegúrate de que el nombre del módulo coincida
  await app.listen(3001); // Puerto 3001 para Auth
}
