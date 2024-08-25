import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { UserEntity } from './user.entity';
import { ORMRepository } from '../common/repositories/orm.repository';

@Injectable()
export class UserRepository extends ORMRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly repository: Repository<UserEntity>,
  ) {
    super(repository);
  }

  async existsEmail(email: string, id?: string): Promise<boolean> {
    if (id) {
      return this.repository.exists({ where: { id: Not(id), email } });
    }
    return this.repository.exists({ where: { email } });
  }
}
