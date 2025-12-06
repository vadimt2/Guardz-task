import { Test, TestingModule } from '@nestjs/testing';
import { HealthCheckService, TypeOrmHealthIndicator } from '@nestjs/terminus';
import { AppController } from './app.controller';
import { RedisHealthIndicator } from './health/redis.health';

describe('AppController', () => {
  let appController: AppController;
  const healthCheckService = { check: jest.fn() };
  const dbIndicator = { pingCheck: jest.fn() };
  const redisIndicator = { isHealthy: jest.fn() };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        { provide: HealthCheckService, useValue: healthCheckService },
        { provide: TypeOrmHealthIndicator, useValue: dbIndicator },
        { provide: RedisHealthIndicator, useValue: redisIndicator },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should delegate to HealthCheckService', async () => {
    const expected = { status: 'ok' };
    healthCheckService.check.mockResolvedValue(expected);

    const result = await appController.getHealth();

    expect(healthCheckService.check).toHaveBeenCalledTimes(1);
    expect(typeof healthCheckService.check.mock.calls[0][0][0]).toBe('function');
    expect(result).toEqual(expected);
  });
});
