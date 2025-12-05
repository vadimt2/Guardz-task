import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsIn, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

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
  limit = 10;

  @ApiPropertyOptional({
    description: "Sort order of results: 'newest' or 'oldest'.",
    example: 'newest',
    enum: ['newest', 'oldest'],
  })
  @IsOptional()
  @IsIn(['newest', 'oldest'])
  order: 'newest' | 'oldest' = 'newest';

  @ApiPropertyOptional({
    description: 'Text search query to filter results.',
    example: 'hello',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
