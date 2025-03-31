import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Product } from '../../products/entity/product.entity';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async calculateDeletedPercentage(): Promise<{ deletedPercentage: number }> {
    const total = await this.productRepo.count();
    if (total === 0) {
      return { deletedPercentage: 0 };
    }
    const deletedCount = await this.productRepo.count({ where: { isDeleted: true } });
    const percentage = (deletedCount / total) * 100;
    return { deletedPercentage: parseFloat(percentage.toFixed(2)) };
  }

  async calculateActivePercentage(params: { withPrice: string; startDate: string; endDate: string }): Promise<{ activePercentage: number }> {
    const { withPrice, startDate, endDate } = params;
    let total = await this.productRepo.createQueryBuilder('product').getCount();

    let query = this.productRepo.createQueryBuilder('product')
      .where('product.isDeleted = :isDeleted', { isDeleted: false });
    
    if (withPrice === 'true') {
      query = query.andWhere('product.price IS NOT NULL');
    } else if (withPrice === 'false') {
      query = query.andWhere('product.price IS NULL');
    }

    if (startDate && endDate) {
      query = query.andWhere('product.createdAt BETWEEN :startDate AND :endDate', { startDate, endDate });
    }

    const filteredCount = await query.getCount();
    const percentage = total > 0 ? (filteredCount / total) * 100 : 0;

    return { activePercentage: parseFloat(percentage.toFixed(2)) };
  }

  async getCategoryDistribution(): Promise<{ [key: string]: number }> {
    const products = await this.productRepo.find({ where: { isDeleted: false } });
    const distribution = products.reduce((acc, product) => {
      acc[product.category] = (acc[product.category] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    return distribution;
  }

  async getInventoryReportByBrand(): Promise<{ [brand: string]: number }> {
    const products = await this.productRepo.find({ where: { isDeleted: false } });
    
    const report = products.reduce((acc, product) => {
      if (product.brand) {
        acc[product.brand] = (acc[product.brand] || 0) + product.stock;
      }
      return acc;
    }, {} as { [brand: string]: number });
    
    return report;
  }
}
