import {
  Controller,
  Post,
  Delete,
  Body,
  Param,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
  Get,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskRepository } from './task.repository';
import { TaskShareRepository } from './task-share.repository';
import { TaskShareEntity } from './task-share.entity';
import { UserRepository } from '../user/user.repository';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { UserEntity } from '../user/user.entity';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

const { CREATE } = ValidationGroups;

@Controller('tasks/share')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Task Share')
@ApiBearerAuth()
export class TaskShareController {
  constructor(
    private readonly repository: TaskShareRepository,
    private readonly taskRepository: TaskRepository,
    private readonly userRepository: UserRepository,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ groups: [CREATE], transform: true }))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a task share',
    type: TaskShareEntity,
  })
  async createTaskShare(
    @Body() body: TaskShareEntity,
  ): Promise<TaskShareEntity> {
    const task = await this.taskRepository.findOne({
      where: { id: body.taskId },
    });
    const user = await this.userRepository.findOne({
      where: { id: body.userId },
    });
    if (!task || !user) {
      throw new NotFoundException('Task or User not found');
    }
    return this.repository.save({
      taskId: task.id,
      userId: user.id,
    } as TaskShareEntity);
  }

  @Get('all')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Get a task share',
    type: TaskShareEntity,
  })
  async findAll(@CurrentUser() user: UserEntity): Promise<TaskShareEntity[]> {
    return this.repository.find({
      where: { userId: user.id },
      relations: ['task'],
    });
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete a task share',
  })
  async deleteTaskShare(@Param('id') id: string): Promise<void> {
    const dataFromDb = await this.repository.findOne({
      where: { id },
    });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    return this.repository.delete(id);
  }
}
