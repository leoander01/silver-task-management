import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from './task.entity';
import { ORMRepository } from '../common/repositories/orm.repository';

@Injectable()
export class TaskRepository extends ORMRepository<TaskEntity> {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repository: Repository<TaskEntity>,
  ) {
    super(repository);
  }
}
