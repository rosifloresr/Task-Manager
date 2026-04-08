import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { RemoteAuthGuard } from '@app/common/guards/remote-auth.guard';
import { fromEventPattern } from 'rxjs';

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(RemoteAuthGuard)
  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', new ParseUUIDPipe()) id: string) {
    return this.productsService.findOne(id);
  }
  
  @EventPattern('order_created')
  async handleOrderCreated(data: any) {
    console.log('📦 Evento recibido: Descontando stock para', data.productId);
    await this.productsService.decreaseStock(data.productId, data.quantity);
  }

}