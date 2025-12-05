import { ApiProperty } from '@nestjs/swagger';

export class EntityResponseDto {
  @ApiProperty({ description: 'Unique identifier for the submitted entity.' })
  id: string;

  @ApiProperty({ description: 'The primary string value submitted.' })
  something: string;

  @ApiProperty({ description: 'The time the entity was created.', format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'The time the entity was updatedAt.', format: 'date-time' })
  updatedAt: Date;
}
