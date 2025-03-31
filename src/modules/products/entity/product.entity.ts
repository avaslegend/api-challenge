import { Entity, Column, PrimaryColumn } from 'typeorm';

@Entity()
export class Product {

  @PrimaryColumn()
  id: string;

  @Column({ nullable: true })
  sku: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: true })
  brand: string;

  @Column({ nullable: true })
  model: string;

  @Column({ nullable: false })
  category: string;

  @Column({ nullable: true })
  color: string;

  @Column('decimal', { nullable: true })
  price: number;

  @Column({ nullable: true })
  currency: string;

  @Column({ type: 'int', nullable: true })
  stock: number;

  @Column({ default: false })
  isDeleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  createdAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date;
}
