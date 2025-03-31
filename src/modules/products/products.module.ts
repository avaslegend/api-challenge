import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './controller/products.controller';
import { ProductService } from './service/products.service';
import { Product } from './entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductController],
  providers: [
    ProductService,
  ],
  exports: [ProductService],
})
export class ProductModule {}
