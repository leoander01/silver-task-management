import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskShareEntity } from './task-share.entity';
import { ORMRepository } from '../common/repositories/orm.repository';

@Injectable()
export class TaskShareRepository extends ORMRepository<TaskShareEntity> {
  constructor(
    @InjectRepository(TaskShareEntity)
    private readonly repository: Repository<TaskShareEntity>,
  ) {
    super(repository);
  }
}
