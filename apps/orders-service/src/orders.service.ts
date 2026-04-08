import { Injectable, Inject } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(
    private prisma: PrismaService,
    @Inject('ORDERS_SERVICE') private client: ClientProxy,
  ){}

  async createOrder(userId: string, productId: string, quantity: number){
    const order = await this.prisma.order.create({
      data: {
        userId,
        productId,
        quantity,
        total: 1000 * quantity, //solo de pruebo asumo que el precio es 1000
        status : 'PENDING',
      },
    });

    this.client.emit('order_created', {
      orderId: order.id,
      productId: order.productId,
      quantity: order.quantity,
    })
    return order;
  }
}
