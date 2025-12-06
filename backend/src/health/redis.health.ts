import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthIndicatorService } from '@nestjs/terminus';

@Injectable()
export class RedisHealthIndicator {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
    private readonly healthIndicatorService: HealthIndicatorService,
  ) {}

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const check = this.healthIndicatorService.check(key);

    try {
      await this.pingRedis();
      return check.up();
    } catch (error) {
      return check.down((error as Error).message);
    }
  }

  private async pingRedis() {
    const client = this.getClient();

    if (client?.ping) {
      await client.ping();
      return;
    }

    const cacheKey = 'health:redis';
    await this.cacheManager.set(cacheKey, 'ok', 1);
    const value = await this.cacheManager.get<string>(cacheKey);
    if (value !== 'ok') {
      throw new Error('Redis cache read/write failed');
    }
  }

  private getClient(): { ping?: () => Promise<unknown> | unknown } | undefined {
    const store = (this.cacheManager as unknown as { store?: { getClient?: () => unknown } }).store;
    return store?.getClient?.() as
      | { ping?: () => Promise<unknown> | unknown }
      | undefined;
  }
}
