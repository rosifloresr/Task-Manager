import { Controller, Get, UseGuards,Body, Post, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { RemoteAuthGuard } from '@app/common';
import { EventPattern, MessagePattern, Payload } from '@nestjs/microservices';
import { OrderStatus } from './prisma/client';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(RemoteAuthGuard)
    @Post()
    async create(@Body() body: {productId: string, quantity: number}, @Request() req){
      const userId = req.user.id;
      return this.ordersService.createOrder(userId, body.productId, body.quantity);
    }

    @EventPattern('order_confirmed')
    async handleOrderConfirmed(@Payload() data: {orderId: string}){
      await this.ordersService.updateStatus(data.orderId, OrderStatus.COMPLETED);
    }

    @EventPattern('order_failed')
    async handleOrderFailed(@Payload() data: {orderId: string, reason: string}){
      await this.ordersService.updateStatus(data.orderId, OrderStatus.CANCELLED);
    }

    @MessagePattern({ cmd: 'get_all_orders'})
    async findAll() {
      return this.ordersService.findAll();
    }

    @MessagePattern({cmd: 'get_order_by_id'})
    async findOne(@Payload() data: {id: string}){
        return this.ordersService.findOne(data.id);
    }
    


}
