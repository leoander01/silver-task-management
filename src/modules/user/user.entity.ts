import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import { ValidationGroups } from '../common/enums/validation-group.enum';
import { ApiProperty } from '@nestjs/swagger';

const { CREATE, UPDATE } = ValidationGroups;

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString({ always: true })
  @IsNotEmpty({ groups: [CREATE], message: 'Name is required' })
  @IsOptional({ groups: [UPDATE] })
  @MaxLength(50, { always: true })
  @Column({ type: 'varchar', nullable: false, length: 50 })
  name: string;

  @ApiProperty({ uniqueItems: true, example: 'john@doe.com' })
  @IsEmail({}, { message: 'Email must be valid' })
  @IsNotEmpty({ groups: [CREATE], message: 'Email is required' })
  @IsOptional({ groups: [UPDATE] })
  @MaxLength(50, { always: true })
  @Column({ type: 'varchar', nullable: false, unique: true, length: 50 })
  email: string;

  @ApiProperty({ example: 'my_password' })
  @MinLength(8, { message: 'Password must be at least 8 characters' })
  @MaxLength(15, { message: 'Password must be less than 15 characters' })
  @IsNotEmpty({ groups: [CREATE], message: 'Password is required' })
  @IsOptional({ groups: [UPDATE] })
  @IsString({ always: true })
  @Column({
    type: 'varchar',
    nullable: false,
    select: false,
    length: 255,
  })
  password: string;
}
