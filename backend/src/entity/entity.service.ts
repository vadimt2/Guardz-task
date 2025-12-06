import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsOrderValue, ILike } from 'typeorm';
import { SubmittedEntity } from './submitted-entity.entity';
import { CreateEntityDto } from './dto/create-entity.dto';
import { OffsetPaginationQueryDto } from 'src/common/pagination/dto/offset-pagination-query.dto';
import { PaginationOrder } from 'src/common/pagination/pagination-order.enum';

@Injectable()
export class EntityService {
  constructor(
    @InjectRepository(SubmittedEntity)
    private readonly entityRepository: Repository<SubmittedEntity>,
  ) {}
  async create(createEntityDto: CreateEntityDto): Promise<SubmittedEntity> {
    const newEntity = this.entityRepository.create(createEntityDto);
    return this.entityRepository.save(newEntity);
  }

  async findAllPaginated(query: OffsetPaginationQueryDto): Promise<{
    items: SubmittedEntity[];
    hasMore: boolean;
    nextOffset: number | null;
  }> {
    const { offset, limit, order, search } = query;

    const direction: FindOptionsOrderValue =
      order === PaginationOrder.Newest ? 'DESC' : 'ASC';

    const where = search ? { something: ILike(`%${search}%`) } : {};

    const [items, total] = await this.entityRepository.findAndCount({
      skip: offset,
      take: limit,
      order: {
        createdAt: direction,
      },
      where,
    });

    const hasMore = offset + items.length < total;
    const nextOffset = hasMore ? offset + items.length : null;

    return {
      items,
      hasMore,
      nextOffset,
    };
  }

  async findAll(): Promise<SubmittedEntity[]> {
    return this.entityRepository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }
}
