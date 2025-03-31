import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { Product } from '../entity/product.entity';
import { ProductFilterDto } from '../dto/product-filter.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import axios, { AxiosResponse } from 'axios';
import { ContentfulResponse } from '../interface/contentful-response.interface';
import { ContentfulItemFields } from '../interface/contentful-item-fields.interface';

@Injectable()
export class ProductService {
  private readonly logger = new Logger(ProductService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepo: Repository<Product>,
  ) {}

  async getProducts(filters: ProductFilterDto): Promise<{ data: Product[]; total: number; page: number }> {
    const { name, category, minPrice, maxPrice} = filters;

    const page = filters.page ? Number(filters.page) : 1;
    const limit = filters.limit ? Number(filters.limit) : 5;

    const query = this.productRepo.createQueryBuilder('product').where('product.isDeleted = :isDeleted', { isDeleted: false });
    
    if (name) {
      query.andWhere('product.name ILIKE :name', { name: `%${name}%` });
    }
    if (category) {
      query.andWhere('product.category ILIKE :category', { category: `%${category}%` });
    }
    if (minPrice !== undefined) {
      query.andWhere('product.price >= :minPrice', { minPrice });
    }
    if (maxPrice !== undefined) {
      query.andWhere('product.price <= :maxPrice', { maxPrice });
    }

    query.skip((page - 1) * limit).take(limit);

    const [data, total] = await query.getManyAndCount();

    return { data, total, page };
  }

  async deleteProduct(id: string): Promise<void> {
    const product = await this.productRepo.findOne({ where: { id } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.isDeleted = true;
    await this.productRepo.save(product);
  }

  async syncProductsFromContentful(): Promise<void> {
    try {
      const url = `${process.env.CONTENTFUL_URL}${process.env.CONTENTFUL_SPACE_ID}/environments/${process.env.CONTENTFUL_ENVIRONMENT}/entries?access_token=${process.env.CONTENTFUL_ACCESS_TOKEN}&content_type=${process.env.CONTENTFUL_CONTENT_TYPE}`;
      
      const response: AxiosResponse<ContentfulResponse> = await axios.get(url);

      const data = response.data;

      if (!data || !data.items) {
        this.logger.error('Respuesta no válida de Contentful');
        return;
      }

      for (const item of data.items) {
        const fields: ContentfulItemFields = item.fields;
        const createdAt = item.sys.createdAt;
        const updatedAt = item.sys.updatedAt;
        const productId = item.sys.id;

        let product = await this.productRepo.findOne({ where: { id: productId } });
        if (!product) {

          product = this.productRepo.create({
            id: productId,
            sku: fields.sku,
            name: fields.name,
            brand: fields.brand,
            model: fields.model,
            category: fields.category,
            color: fields.color,
            price: fields.price,
            currency: fields.currency,
            stock: fields.stock,
            isDeleted: false,
            createdAt: new Date(createdAt),
            updatedAt: new Date(updatedAt),
          });
        } else {

          if (!product.isDeleted) {
            product.sku = fields.sku;
            product.name = fields.name;
            product.brand = fields.brand;
            product.model = fields.model;
            product.category = fields.category;
            product.color = fields.color;
            product.price = fields.price;
            product.currency = fields.currency;
            product.stock = fields.stock;
            product.createdAt = new Date(createdAt);
            product.updatedAt = new Date(updatedAt);
          }
        }
        await this.productRepo.save(product);
      }
      this.logger.log('Sincronización con Contentful completada');
    } catch (error) {
      this.logger.error('Error al sincronizar con Contentful', error);
    }
  }
}
