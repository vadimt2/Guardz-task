import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('submitted_entities')
export class SubmittedEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  something: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
