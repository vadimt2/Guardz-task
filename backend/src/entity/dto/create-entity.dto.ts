import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateEntityDto {
  @ApiProperty({
    description: 'The string value to be submitted and saved.',
    example: 'New entity data from the form',
    type: 'string',
  })
  @IsString()
  @IsNotEmpty()
  something: string;
}
