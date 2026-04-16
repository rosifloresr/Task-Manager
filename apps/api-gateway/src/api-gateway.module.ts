import { Module } from '@nestjs/common';
import { ApiGatewayController } from './api-gateway.controller';
import { ApiGatewayService } from './api-gateway.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [ClientsModule.register([
      {
        name: 'ORDERS_SERVICE', 
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://user:password@localhost:5672'], 
          queue: 'orders_queue', 
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),],
  controllers: [ApiGatewayController],
  providers: [ApiGatewayService],
})
export class ApiGatewayModule {}
