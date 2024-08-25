import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  ValidationPipe,
  UsePipes,
  BadRequestException,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from './auth.service';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { UserLoginDto } from './dtos/user-login.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';

const { CREATE } = ValidationGroups;

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userRepository: UserRepository,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Access the application',
  })
  async login(@Body() payload: UserLoginDto) {
    const userFromDb = await this.userRepository.findOne({
      where: { email: payload.email },
      select: ['id', 'name', 'email', 'password'],
    });
    const validatePassword = await this.authService.validatePassword(
      payload.password,
      userFromDb,
    );
    if (!userFromDb || !validatePassword) {
      throw new UnauthorizedException('Invalid credentials');
    }
    const { accessToken } = await this.authService.login(userFromDb);
    return {
      ...userFromDb,
      password: undefined,
      accessToken,
    };
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ groups: [CREATE] }))
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Register a new user',
    type: UserEntity,
  })
  async registerNewUser(@Body() payload: UserEntity): Promise<UserEntity> {
    const existsEmail = await this.userRepository.existsEmail(payload.email);
    if (existsEmail) {
      throw new BadRequestException('Email already exists');
    }
    const createdUser = await this.userRepository.createAndSave({
      ...payload,
      password: await bcrypt.hash(payload.password, 10),
    });
    return {
      ...createdUser,
      password: undefined,
    };
  }
}
