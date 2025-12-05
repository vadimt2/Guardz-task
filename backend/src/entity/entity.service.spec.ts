import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EntityService } from './entity.service';
import { SubmittedEntity } from './submitted-entity.entity';
import { CreateEntityDto } from './dto/create-entity.dto';
import { Repository } from 'typeorm';

const entityStub: SubmittedEntity = {
  id: 'a-b-c-123',
  something: 'Test Data 1',
  createdAt: new Date('2025-01-01T10:00:00.000Z'),
  updatedAt: new Date('2025-01-01T10:00:00.000Z'),
};

const createDtoStub: CreateEntityDto = {
  something: 'Test Data 1',
};

describe('EntityService', () => {
  let service: EntityService;
  let repository: Repository<SubmittedEntity>;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
  };

  beforeEach(async () => {
    mockRepository.create.mockClear();
    mockRepository.save.mockClear();
    mockRepository.find.mockClear();
    mockRepository.findAndCount.mockClear();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EntityService,
        {
          provide: getRepositoryToken(SubmittedEntity),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<EntityService>(EntityService);
    repository = module.get<Repository<SubmittedEntity>>(getRepositoryToken(SubmittedEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should call repository methods and return the saved entity', async () => {
      (mockRepository.create as jest.Mock).mockReturnValue(createDtoStub);
      (mockRepository.save as jest.Mock).mockResolvedValue(entityStub);
      const result = await service.create(createDtoStub);

      expect(repository.create).toHaveBeenCalledWith(createDtoStub);
      expect(repository.save).toHaveBeenCalledWith(createDtoStub);
      expect(result).toEqual(entityStub);
    });
  });

  describe('findAll', () => {
    it('should return an array of all entities, ordered by createdAt DESC', async () => {
      const entitiesArray: SubmittedEntity[] = [
        entityStub,
        {
          ...entityStub,
          id: 'd-e-f-456',
          something: 'Test Data 2',
          createdAt: new Date('2025-01-01T09:00:00.000Z'),
        },
      ];
      (mockRepository.find as jest.Mock).mockResolvedValue(entitiesArray);

      const result = await service.findAll();

      expect(repository.find).toHaveBeenCalledWith({
        order: {
          createdAt: 'DESC',
        },
      });

      expect(result).toEqual(entitiesArray);
      expect(result.length).toBe(2);
    });
  });

  describe('findAllPaginated', () => {
    it('should return paginated entities with metadata using newest order and search', async () => {
      const entitiesArray: SubmittedEntity[] = [
        entityStub,
        {
          ...entityStub,
          id: 'd-e-f-456',
          something: 'Test Data 2',
          createdAt: new Date('2025-01-01T09:00:00.000Z'),
        },
      ];

      const query = {
        offset: 0,
        limit: 2,
        order: 'newest' as const,
        search: 'Test',
      };

      (mockRepository.findAndCount as jest.Mock).mockResolvedValue([entitiesArray, 3]);

      const result = await service.findAllPaginated(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: query.offset,
        take: query.limit,
        order: {
          createdAt: 'DESC',
        },
        where: {
          something: expect.anything(),
        },
      });

      expect(result).toEqual({
        items: entitiesArray,
        hasMore: true,
        nextOffset: 2,
      });
    });

    it('should return paginated entities with oldest order and no search', async () => {
      const singleEntity = [entityStub];
      const query = {
        offset: 2,
        limit: 1,
        order: 'oldest' as const,
      };

      (mockRepository.findAndCount as jest.Mock).mockResolvedValue([singleEntity, 3]);

      const result = await service.findAllPaginated(query);

      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: query.offset,
        take: query.limit,
        order: {
          createdAt: 'ASC',
        },
        where: {},
      });

      expect(result).toEqual({
        items: singleEntity,
        hasMore: false,
        nextOffset: null,
      });
    });
  });
});
