import { Repository } from 'typeorm';
import { Product } from '../entity/product.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(
    @InjectRepository(Product)
    repository: Repository<Product>,
  ) {
    super(repository.target, repository.manager, repository.queryRunner);
  }
}
