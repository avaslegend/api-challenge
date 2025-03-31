import { Controller, Get, Query, Delete, Param, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { ProductService } from '../service/products.service';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { ApiBearerAuth, ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';


@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'Obtener productos paginados y filtrados' })
  async findAll(@Query() filters: ProductFilterDto) {
    return this.productService.getProducts(filters);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Marcar un producto como eliminado' })
  async remove(@Param('id') id: string) {
    await this.productService.deleteProduct(id);
  }

  @Post('sync')
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  async syncProducts() {
    await this.productService.syncProductsFromContentful();
    return { message: 'Sincronización completada' };
  }
}
