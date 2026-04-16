import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ProductsModule } from './products.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductsModule);

  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'products_queue', 
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3002); 
  console.log('Products Service is running on: http://localhost:3002 y esperando eventos');
}
bootstrap();