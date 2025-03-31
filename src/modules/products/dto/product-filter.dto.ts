import { IsOptional, IsString, IsNumber, IsPositive, Max } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Página actual', default: 1 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Type( () => Number )
  page?: number = 1;

  @ApiPropertyOptional({ description: 'Límite de elementos por página', default: 5 })
  @IsOptional()
  @IsNumber()
  @IsPositive()
  @Max(5, { message: 'The max value of field limit equal to 5' })
  @Type( () => Number )
  limit?: number = 5;

  @ApiPropertyOptional({ description: 'Filtro por nombre' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Filtro por categoría' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Precio mínimo' })
  @IsOptional()
  @IsNumber()
  @Type( () => Number )
  minPrice?: number;

  @ApiPropertyOptional({ description: 'Precio máximo' })
  @IsOptional()
  @IsNumber()
  @Type( () => Number )
  maxPrice?: number;
}
