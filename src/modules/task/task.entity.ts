import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import {
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsDateString,
  IsString,
  MaxLength,
  IsEmpty,
  IsBoolean,
} from 'class-validator';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { UserEntity } from '../user/user.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const { CREATE, UPDATE } = ValidationGroups;

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

@Entity('tasks')
export class TaskEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'Title for the task' })
  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE], message: 'Title is required' })
  @IsOptional({ groups: [UPDATE] })
  @MaxLength(50, { always: true })
  @Column({ type: 'varchar', nullable: false, length: 50 })
  title: string;

  @ApiPropertyOptional({ example: 'Description for the task' })
  @IsString({ always: true })
  @IsOptional({ always: true })
  @MaxLength(100, { always: true })
  @Column({ type: 'varchar', nullable: true, length: 100 })
  description: string;

  @ApiProperty({ example: '2024-06-30 19:10:20' })
  @IsDateString({}, { message: 'Due Date must be valid' })
  @IsNotEmpty({ groups: [CREATE] })
  @IsOptional({ groups: [UPDATE] })
  @Column({ type: 'timestamp', nullable: false })
  dueDate: Date;

  @ApiPropertyOptional({ example: false })
  @IsBoolean({ always: true })
  @IsOptional({ always: true })
  @Column({ type: 'boolean', nullable: true, default: false })
  finished: boolean;

  @ApiPropertyOptional({ example: TaskPriority.LOW })
  @IsEnum(TaskPriority, { always: true })
  @IsOptional({ always: true })
  @Column({
    type: 'enum',
    nullable: true,
    enum: TaskPriority,
    default: TaskPriority.LOW,
  })
  priority: TaskPriority;

  @IsEmpty({ always: true })
  @Column({ nullable: false, type: 'uuid' })
  createdByUserId: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  createdByUser: UserEntity;
}
