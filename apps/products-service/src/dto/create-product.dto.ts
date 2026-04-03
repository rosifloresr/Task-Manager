import { IsString, IsNumber, IsPositive, IsOptional, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres' })
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  @IsPositive({ message: 'El precio debe ser un número positivo' })
  price: number;

  @IsNumber()
  @IsOptional()
  stock?: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;
}