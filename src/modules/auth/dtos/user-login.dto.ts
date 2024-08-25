import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({ example: 'john@doe.com' })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  email: string;

  @ApiProperty({ example: 'my_password' })
  @IsString({ always: true })
  @IsNotEmpty({ always: true })
  password: string;
}
