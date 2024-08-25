import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TaskRepository } from './task.repository';
import { TaskEntity } from './task.entity';
import { UserEntity } from '../user/user.entity';
import { CurrentUser } from '../user/decorators/current-user.decorator';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

const { CREATE, UPDATE } = ValidationGroups;

@Controller('tasks')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Tasks')
@ApiBearerAuth()
export class TaskController {
  constructor(private readonly repository: TaskRepository) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ groups: [CREATE], transform: true }))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Create a task',
    type: TaskEntity,
  })
  async create(
    @Body() payload: TaskEntity,
    @CurrentUser() user: UserEntity,
  ): Promise<TaskEntity> {
    payload.createdByUserId = user.id;
    return this.repository.createAndSave(payload);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all tasks',
    type: Array<TaskEntity>,
  })
  async findAll(@CurrentUser() user: UserEntity): Promise<TaskEntity[]> {
    return this.repository.find({ where: { createdByUserId: user.id } });
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find a task',
    type: TaskEntity,
  })
  async findOne(@Param('id') id: string): Promise<TaskEntity> {
    const dataFromDb = await this.repository.findOne({ where: { id } });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    return dataFromDb;
  }

  @Put(':id')
  @UsePipes(new ValidationPipe({ groups: [UPDATE], transform: true }))
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Update a task',
    type: TaskEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: TaskEntity,
  ): Promise<TaskEntity> {
    let dataFromDb = await this.repository.findOne({ where: { id } });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    dataFromDb = Object.assign(dataFromDb, payload);
    return this.repository.save(dataFromDb);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete a task',
  })
  async delete(@Param('id') id: string): Promise<void> {
    const dataFromDb = await this.repository.findOne({ where: { id } });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    return this.repository.delete(id);
  }
}
