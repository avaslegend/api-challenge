import { Test, TestingModule } from '@nestjs/testing';
import { ReportService } from '../modules/reports/service/report.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../modules/products/entity/product.entity';
import { Repository } from 'typeorm';

describe('ReportService', () => {
  let service: ReportService;

  const productArray = [
    { 
      id: '1', 
      name: 'Producto A', 
      category: 'Categoria1', 
      price: 10.5, 
      isDeleted: false, 
      createdAt: new Date('2024-01-01T00:00:00Z')
    },
    { 
      id: '2', 
      name: 'Producto B', 
      category: 'Categoria2', 
      price: 20.0, 
      isDeleted: true, 
      createdAt: new Date('2024-01-02T00:00:00Z')
    },
  ];

  const repoMock = {
    count: jest.fn().mockResolvedValue(productArray.length),
    find: jest.fn().mockResolvedValue(productArray),
    createQueryBuilder: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(1),
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportService,
        {
          provide: getRepositoryToken(Product),
          useValue: repoMock,
        },
      ],
    }).compile();

    service = module.get<ReportService>(ReportService);
    module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should calculate deleted percentage', async () => {
    const result = await service.calculateDeletedPercentage();

    expect(result.deletedPercentage).toBeDefined();
  });

  it('should calculate active percentage with price filter and date range', async () => {
    const now = new Date().toISOString();
    const result = await service.calculateActivePercentage({
      withPrice: 'true',
      startDate: now,
      endDate: now,
    });

    expect(result.activePercentage).toEqual(100.00);
  });

  it('should get category distribution', async () => {
    const result = await service.getCategoryDistribution();

    expect(result).toHaveProperty('Categoria1');
    expect(result).toHaveProperty('Categoria2');
  });
});
