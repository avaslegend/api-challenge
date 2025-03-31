import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ProductService } from '../products/service/products.service';

@Injectable()
export class ContentfulScheduler {
  private readonly logger = new Logger(ContentfulScheduler.name);

  constructor(private readonly productService: ProductService) {}

  @Cron(CronExpression.EVERY_HOUR)
  async handleCron() {
    this.logger.log('Iniciando sincronización con Contentful');
    try {
      await this.productService.syncProductsFromContentful();
      this.logger.log('Sincronización completada');
    } catch (error) {
      this.logger.error('Error durante la sincronización', error);
    }
  }
}
