import { Test, TestingModule } from '@nestjs/testing';
import { ProductService } from '../modules/products/service/products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from '../modules/products/entity/product.entity';
import { Repository, SelectQueryBuilder } from 'typeorm';
import axios, { AxiosResponse } from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;


const productArray: Product[] = [
  { id: '1', name: 'Producto A', category: 'Categoria1', price: 10.5, isDeleted: false } as Product,
  { id: '2', name: 'Producto B', category: 'Categoria2', price: 20.0, isDeleted: false } as Product,
];

const queryBuilderMock: Partial<SelectQueryBuilder<Product>> = {
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  take: jest.fn().mockReturnThis(),
  getManyAndCount: jest.fn().mockResolvedValue([productArray, productArray.length] as [Product[], number]),
};

const repoMock: Partial<Repository<Product>> = {
  createQueryBuilder: jest.fn().mockReturnValue(queryBuilderMock),
  findOne: jest.fn().mockResolvedValue(productArray[0]),
  save: jest.fn().mockResolvedValue(true),
  create: jest.fn().mockImplementation((dto: Partial<Product>) => dto as Product),
  count: jest.fn().mockResolvedValue(productArray.length),
};

const repoMockTyped = repoMock as Repository<Product>;

describe('ProductService', () => {
  let service: ProductService;
  let repo: Repository<Product>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: getRepositoryToken(Product),
          useValue: repoMockTyped,
        },
      ],
    }).compile();

    service = module.get<ProductService>(ProductService);
    repo = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get products', async () => {
    const filters = {};
    const result = await service.getProducts(filters);
    expect(result.total).toEqual(productArray.length);
  });

  it('should delete a product', async () => {
    await service.deleteProduct('1');

    expect(repo.findOne).toHaveBeenCalledWith({ where: { id: '1' } });
    expect(repo.save).toHaveBeenCalled();
  });

  describe('syncProductsFromContentful', () => {
    const contentfulResponse = {
      items: [
        {
          sys: {
            id: '3',
            createdAt: '2024-01-23T21:47:07.975Z',
            updatedAt: '2024-01-23T21:47:07.975Z',
          },
          fields: {
            sku: 'SKU3',
            name: 'Producto C',
            brand: 'Marca C',
            model: 'Modelo C',
            category: 'Categoria C',
            color: 'Red',
            price: 30.0,
            currency: 'USD',
            stock: 5,
          },
        },
      ],
    };

    it('should sync products from Contentful when product does not exist', async () => {

      mockedAxios.get.mockResolvedValueOnce({ data: contentfulResponse } as AxiosResponse);

      (repo.findOne as jest.Mock).mockResolvedValueOnce(null);
      await service.syncProductsFromContentful();
      expect(repo.save).toHaveBeenCalled();
    });

    it('should update existing product if not deleted', async () => {
      const existingProduct: Product = { 
        id: '3', 
        sku: 'OldSKU', 
        name: 'Old Product', 
        brand: 'OldBrand', 
        model: 'OldModel', 
        category: 'OldCategory', 
        color: 'Blue', 
        price: 25.0, 
        currency: 'USD', 
        stock: 10, 
        isDeleted: false,
        createdAt: new Date('2024-01-01T00:00:00Z'),
        updatedAt: new Date('2024-01-01T00:00:00Z'),
      } as Product;
      (repo.findOne as jest.Mock).mockResolvedValueOnce(existingProduct);
      mockedAxios.get.mockResolvedValueOnce({ data: contentfulResponse } as AxiosResponse);
      await service.syncProductsFromContentful();
      expect(repo.save).toHaveBeenCalled();
    });
  });
});
