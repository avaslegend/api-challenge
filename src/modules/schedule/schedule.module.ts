import { Module } from '@nestjs/common';
import { ContentfulScheduler } from './contentful.scheduler';
import { ProductModule } from '../products/products.module';

@Module({
  imports: [ProductModule],
  providers: [ContentfulScheduler],
})
export class ScheduleModule {}
