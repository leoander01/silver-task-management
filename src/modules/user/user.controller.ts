import {
  Controller,
  Get,
  Put,
  Delete,
  Body,
  Param,
  NotFoundException,
  UsePipes,
  ValidationPipe,
  BadRequestException,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserRepository } from './user.repository';
import { UserEntity } from './user.entity';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';

const { UPDATE } = ValidationGroups;

@Controller('users')
@UseGuards(AuthGuard('jwt'))
@ApiTags('Users')
@ApiBearerAuth()
export class UserController {
  constructor(private readonly repository: UserRepository) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find all users',
    type: Array<UserEntity>,
  })
  async findAll(): Promise<UserEntity[]> {
    return this.repository.find();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Find a user',
    type: UserEntity,
  })
  async findOne(@Param('id') id: string): Promise<UserEntity> {
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
    description: 'Update a user',
    type: UserEntity,
  })
  async update(
    @Param('id') id: string,
    @Body() payload: UserEntity,
  ): Promise<UserEntity> {
    let dataFromDb = await this.repository.findOne({ where: { id } });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    const existsEmail = await this.repository.existsEmail(payload.email, id);
    if (existsEmail) {
      throw new BadRequestException('Email already exists');
    }
    dataFromDb = Object.assign(dataFromDb, payload);
    return this.repository.save(dataFromDb);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Delete a user',
  })
  async delete(@Param('id') id: string): Promise<void> {
    const dataFromDb = await this.repository.findOne({ where: { id } });
    if (!dataFromDb) {
      throw new NotFoundException('Entity not found');
    }
    return this.repository.delete(id);
  }
}
