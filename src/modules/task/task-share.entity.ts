import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { TaskEntity } from './task.entity';
import { UserEntity } from '../user/user.entity';
import { IsNotEmpty, IsString } from 'class-validator';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { ApiProperty } from '@nestjs/swagger';

const { CREATE } = ValidationGroups;

@Entity('task_shares')
export class TaskShareEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'uuid' })
  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ nullable: false, type: 'uuid' })
  taskId: string;

  @ApiProperty({ example: 'uuid' })
  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE] })
  @Column({ nullable: false, type: 'uuid' })
  userId: string;

  @ManyToOne(() => TaskEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  task: TaskEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  user: UserEntity;
}
