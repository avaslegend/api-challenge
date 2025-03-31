import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ReportService } from '../service/report.service';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
@UseGuards(JwtAuthGuard)
export class ReportController {
  constructor(private readonly reportService: ReportService) {}

  @Get('deleted-percentage')
  async getDeletedPercentage() {
    return this.reportService.calculateDeletedPercentage();
  }

  @Get('active-percentage')
  async getActivePercentage(
    @Query('withPrice') withPrice: string,
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.reportService.calculateActivePercentage({ withPrice, startDate, endDate });
  }

  @Get('category-distribution')
  async getCategoryDistribution() {
    return this.reportService.getCategoryDistribution();
  }

  @Get('inventory-by-brand')
  async getInventoryByBrand() {
    return this.reportService.getInventoryReportByBrand();
  }
}
