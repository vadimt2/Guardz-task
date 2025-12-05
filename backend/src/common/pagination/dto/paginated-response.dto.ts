import { ApiProperty, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';

export class PaginatedResponseDto<T> {
  @ApiProperty({
    description: 'List of returned items',
    isArray: true,
  })
  items: T[];

  @ApiProperty({
    description: 'Whether more items exist beyond this page',
    example: true,
  })
  hasMore: boolean;

  @ApiProperty({
    description: 'Offset value for the next request, or null',
    example: 30,
    nullable: true,
  })
  nextOffset: number | null;
}
