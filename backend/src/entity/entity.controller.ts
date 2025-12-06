import {
  Controller,
  Get,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  UseInterceptors,
  Inject,
  ClassSerializerInterceptor,
  Logger,
  Query,
} from '@nestjs/common';
import { EntityService } from './entity.service';
import { CreateEntityDto } from './dto/create-entity.dto';
import { EntityResponseDto } from './dto/entity-response.dto';
import { CACHE_MANAGER, CacheInterceptor, CacheKey, CacheTTL } from '@nestjs/cache-manager';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiBody,
  ApiQuery,
  ApiOkResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
import type { Cache } from 'cache-manager';
import { OffsetPaginationQueryDto } from 'src/common/pagination/dto/offset-pagination-query.dto';
import { PaginatedResponseDto } from 'src/common/pagination/dto/paginated-response.dto';
import { toEntityResponseDto } from './mappers/entity-response.mapper';

@ApiTags('entities')
@Controller('entities')
@UseInterceptors(ClassSerializerInterceptor)
export class EntityController {
  private readonly logger = new Logger(EntityController.name);

  constructor(
    private readonly entityService: EntityService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Submit new entity data' })
  @ApiBody({ type: CreateEntityDto })
  @ApiResponse({
    status: 201,
    description: 'The entity has been successfully created and saved.',
    type: EntityResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async create(@Body() createEntityDto: CreateEntityDto): Promise<EntityResponseDto> {
    this.logger.log(`Received POST request for entity creation.`);

    const newEntity = await this.entityService.create(createEntityDto);

    this.logger.log(`Invalidating cache key 'all_submitted_entities'`);
    await this.cacheManager.del('all_submitted_entities');

    return toEntityResponseDto(newEntity);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all submitted entities' })
  @ApiOkResponse({
    description: 'Return all entities.',
    type: [EntityResponseDto],
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  @UseInterceptors(CacheInterceptor)
  @CacheKey('all_submitted_entities')
  @CacheTTL(30)
  async findAll(): Promise<EntityResponseDto[]> {
    this.logger.log('Attempting to retrieve all entities.');

    const entities = await this.entityService.findAll();
    return entities.map(toEntityResponseDto);
  }

  @Get('paginated')
  @ApiExtraModels(PaginatedResponseDto, EntityResponseDto)
  @ApiOperation({
    summary: 'Retrieve entities with pagination, sorting, and search',
  })
  @ApiQuery({ name: 'offset', required: false, example: 0 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'order', required: false, enum: ['newest', 'oldest'] })
  @ApiQuery({ name: 'search', required: false, example: 'abc123' })
  @ApiOkResponse({
    description: 'Paginated entity response',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            items: {
              type: 'array',
              items: { $ref: getSchemaPath(EntityResponseDto) },
            },
          },
        },
      ],
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error.',
  })
  async findAllPaginated(
    @Query() query: OffsetPaginationQueryDto,
  ): Promise<PaginatedResponseDto<EntityResponseDto>> {
    this.logger.log('Retrieving paginated entity list.');

    const result = await this.entityService.findAllPaginated(query);

    return {
      ...result,
      items: result.items.map(toEntityResponseDto),
    };
  }
}
