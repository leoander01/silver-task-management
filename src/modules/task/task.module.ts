import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TaskEntity } from './task.entity';
import { TaskShareEntity } from './task-share.entity';
import { TaskRepository } from './task.repository';
import { TaskShareRepository } from './task-share.repository';
import { TaskController } from './task.controller';
import { TaskShareController } from './task-share.controller';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TaskEntity, TaskShareEntity]),
    UserModule,
  ],
  providers: [TaskRepository, TaskShareRepository],
  controllers: [TaskController, TaskShareController],
})
export class TaskModule {}
