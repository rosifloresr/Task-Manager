import { Controller, Get, UseGuards,Body, Post, Request } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { RemoteAuthGuard } from '@app/common';

@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

    @UseGuards(RemoteAuthGuard)
    @Post()
    async create(@Body() body: {productId: string, quantity: number}, @Request() req){
      const userId = req.user.sub;
      return this.ordersService.createOrder(userId, body.productId, body.quantity);
    }
}
