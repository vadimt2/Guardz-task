import { Module } from '@nestjs/common';
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import * as redisStore from 'cache-manager-redis-store';
import { EntityModule } from './entity/entity.module';
import { LoggingExceptionFilter } from './common/filters/http-exception.filter';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    CacheModule.registerAsync({
      isGlobal: true,
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        store: redisStore,
        host: config.get<string>('REDIS_HOST') || 'redis',
        port: config.get<number>('REDIS_PORT') || 6379,
      }),
    }),

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('POSTGRES_HOST') || 'postgres',
        port: config.get<number>('POSTGRES_PORT') || 5432,
        username: config.get<string>('POSTGRES_USER') || 'user',
        password: config.get<string>('POSTGRES_PASSWORD') || 'password',
        database: config.get<string>('POSTGRES_DB') || 'guardz_db',
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
      }),
    }),

    EntityModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: LoggingExceptionFilter,
    },
  ],
})
export class AppModule {}
