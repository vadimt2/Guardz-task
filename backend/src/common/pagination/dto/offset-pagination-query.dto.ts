import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationOrder } from '../pagination-order.enum';

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export class OffsetPaginationQueryDto {
  @ApiPropertyOptional({
    description: 'The number of items to skip (offset).',
    example: 0,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset = 0;

  @ApiPropertyOptional({
    description: 'Maximum number of items to return.',
    example: 30,
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_LIMIT)
  limit = DEFAULT_LIMIT;

  @ApiPropertyOptional({
    description: "Sort order of results: 'newest' or 'oldest'.",
    example: PaginationOrder.Newest,
    enum: PaginationOrder,
  })
  @IsOptional()
  @IsEnum(PaginationOrder)
  order: PaginationOrder = PaginationOrder.Newest;

  @ApiPropertyOptional({
    description: 'Text search query to filter results.',
    example: 'hello',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
