
import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from '../../src/modules/reports/controller/report.controller';
import { ReportService } from '../../src/modules/reports/service/report.service';

describe('ReportController', () => {
  let controller: ReportController;

  const mockReportService = {
    calculateDeletedPercentage: jest.fn(),
    calculateActivePercentage: jest.fn(),
    getCategoryDistribution: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        {
          provide: ReportService,
          useValue: mockReportService,
        },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
    module.get<ReportService>(ReportService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getDeletedPercentage', () => {
    it('should return deleted percentage', async () => {
      const result = { deletedPercentage: 10 };
      mockReportService.calculateDeletedPercentage.mockResolvedValue(result);

      expect(await controller.getDeletedPercentage()).toEqual(result);
      expect(mockReportService.calculateDeletedPercentage).toHaveBeenCalled();
    });
  });

  describe('getActivePercentage', () => {
    it('should return active percentage', async () => {
      const withPrice = 'true';
      const startDate = '2024-01-01T00:00:00Z';
      const endDate = '2024-01-31T23:59:59Z';
      const result = { activePercentage: 50 };


      mockReportService.calculateActivePercentage.mockResolvedValue(result);

      expect(await controller.getActivePercentage(withPrice, startDate, endDate)).toEqual(result);
      expect(mockReportService.calculateActivePercentage).toHaveBeenCalledWith({
        withPrice,
        startDate,
        endDate,
      });
    });
  });

  describe('getCategoryDistribution', () => {
    it('should return category distribution', async () => {
      const result = { Smartphone: 5, Smartwatch: 3 };
      mockReportService.getCategoryDistribution.mockResolvedValue(result);

      expect(await controller.getCategoryDistribution()).toEqual(result);
      expect(mockReportService.getCategoryDistribution).toHaveBeenCalled();
    });
  });
});
