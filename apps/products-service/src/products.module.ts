import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from './prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: 'apps/products-service/.env',
    }),
    HttpModule, 
    PrismaModule, 
     ClientsModule.register([
      {
        name: 'PRODUCTS_SERVICE', 
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'],
          queue: 'orders_queue', 
          queueOptions: { durable: true },
        },
      },
    ]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  
})
export class ProductsModule {}