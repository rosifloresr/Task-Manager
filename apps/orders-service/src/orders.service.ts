import { Injectable, Inject } from '@nestjs/common';
import {ClientProxy} from '@nestjs/microservices';
import { PrismaService } from './prisma/prisma.service';
import { OrderStatus } from './prisma/client';
import { throwError } from 'rxjs';

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

  async updateStatus(orderId: string, status: OrderStatus){
    try{
      return await this.prisma.order.update({
        where: {id: orderId},
        data: { status: status },
      });
    } catch (error) {
      console.error(`Error al actualizar la order ${orderId}:`, error.message);
    }
  }

  async findAll(){
    try {
      return await this.prisma.order.findMany({
        orderBy: {
          createdAt: 'desc',
        }
      });
    } catch (error) {
      console.error('Error al obtener las órdenes:', error.message);
      throw error;
    }
  }

  async findOne(id: string){
    try{
      return await this.prisma.order.findUnique({
        where: {id},
      });
    } catch (error){
      console.error(`Orden con ID ${id} no encontrada`, error.message);
      throw error;
    }
  }
}
