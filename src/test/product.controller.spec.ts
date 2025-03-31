import { Test, TestingModule } from '@nestjs/testing';
import { ProductController } from '../../src/modules/products/controller/products.controller';
import { ProductService } from '../../src/modules/products/service/products.service';
import { ProductFilterDto } from '../../src/modules/products/dto/product-filter.dto';

describe('ProductController', () => {
  let controller: ProductController;

  const mockProductService = {
    getProducts: jest.fn(),
    deleteProduct: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductController],
      providers: [
        {
          provide: ProductService,
          useValue: mockProductService,
        },
      ],
    }).compile();

    controller = module.get<ProductController>(ProductController);
    module.get<ProductService>(ProductService);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated products', async () => {
      const filters: ProductFilterDto = { page: 1, limit: 5, name: 'Test' };
      const result = { data: [{ id: '1', name: 'Test Product', category: 'Test' }], total: 1, page: 1 };

      mockProductService.getProducts.mockResolvedValue(result);

      expect(await controller.findAll(filters)).toEqual(result);
      expect(mockProductService.getProducts).toHaveBeenCalledWith(filters);
    });
  });

  describe('remove', () => {
    it('should call productService.deleteProduct with id', async () => {
      const id = '1';
      mockProductService.deleteProduct.mockResolvedValue(undefined);

      await controller.remove(id);

      expect(mockProductService.deleteProduct).toHaveBeenCalledWith(id);
    });
  });
});
