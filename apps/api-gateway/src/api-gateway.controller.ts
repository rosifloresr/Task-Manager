import { Controller, Get, Inject } from '@nestjs/common';
import { ApiGatewayService } from './api-gateway.service';
import { ClientProxy } from '@nestjs/microservices';

@Controller()
export class ApiGatewayController {
  constructor(
    @Inject('ORDERS_SERVICE') private readonly ordersClient : ClientProxy,
  ) {}

  @Get('view-orders')
  findAllOrders(){
    return this.ordersClient.send({cmd: 'get_all_orders'}, {});
  }
  @Get('view-orders')
  findOne(){
    return this.ordersClient.send({cmd: 'get_order_by_id'}, {});
  }

}
