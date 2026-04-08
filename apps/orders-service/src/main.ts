// apps/orders-service/src/main.ts
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  const app = await NestFactory.create(OrdersModule);
  
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://user:password@localhost:5672'],
      queue: 'orders_queue',
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();
  await app.listen(3003); 
  console.log('Orders-Service is running on: http://localhost:3003');
}
bootstrap();