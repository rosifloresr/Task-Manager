import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { PrismaModule } from './prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule,PrismaModule],
  providers: [ProductsService],
  controllers: [ProductsController]
})
export class ProductsModule {}
