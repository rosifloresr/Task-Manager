import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);
  app.useGlobalPipes(new ValidationPipe({
  whitelist: true,
  forbidNonWhitelisted: true,
  transform: true, 
}));
  await app.listen(3002); 
  console.log('Products Service is running on: http://localhost:3002');
}

bootstrap();