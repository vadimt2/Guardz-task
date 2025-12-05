import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EntityController } from './entity.controller';
import { EntityService } from './entity.service';
import { SubmittedEntity } from './submitted-entity.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubmittedEntity])],
  controllers: [EntityController],
  providers: [EntityService],
})
export class EntityModule {}