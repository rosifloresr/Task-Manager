import { Injectable, InternalServerErrorException, NotFoundException , Inject} from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { CreateProductDto } from './dto/create-product.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService,
    @Inject('PRODUCTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  async create(dto: CreateProductDto) {
    try {
      return await this.prisma.product.create({ data: dto });
    } catch (error) {
      throw new InternalServerErrorException('Error al crear el producto en el catálogo.');
    }
  }
 
  async findAll() {
    return await this.prisma.product.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException(`Producto con ID ${id} no encontrado`);
    return product;
  }

  async decreaseStock(productId: string, quantity: number){
    return await this.prisma.product.update({
      where: {id: productId},
      data: {
        stock: {
          decrement: quantity,
        },
      },
    });
  }

  async handleOrderCreated(data: { productId: string; quantity: number; orderId: string }) {
    const { productId, quantity, orderId } = data;

    if (!productId || !quantity || !orderId) {
      throw new Error('Datos incompletos');
    }

    try {
      const product = await this.findOne(productId);

      if (product.stock >= quantity) {
        await this.decreaseStock(productId, quantity);

        this.client.emit('order_confirmed', { orderId });

        return;
      }

      this.client.emit('order_failed', {
        orderId,
        reason: 'Stock insuficiente',
      });

    } catch (error) {
      this.client.emit('order_failed', {
        orderId,
        reason: error.message || 'Error interno',
      });
    }
  }
}