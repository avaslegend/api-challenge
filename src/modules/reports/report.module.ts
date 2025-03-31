import { Module } from '@nestjs/common';
import { ReportController } from './controller/report.controller';
import { ReportService } from './service/report.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../products/entity/product.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ReportController],
  providers: [ReportService],
})
export class ReportModule {}
