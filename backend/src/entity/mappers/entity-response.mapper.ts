import { EntityResponseDto } from '../dto/entity-response.dto';
import { SubmittedEntity } from '../submitted-entity.entity';

export function toEntityResponseDto(entity: SubmittedEntity): EntityResponseDto {
  return {
    id: entity.id,
    something: entity.something,
    createdAt: entity.createdAt,
    updatedAt: entity.updatedAt,
  };
}
