import { Repository, FindManyOptions, FindOneOptions } from 'typeorm';

export class ORMRepository<T> {
  constructor(private readonly ORMRepository: Repository<T>) {}

  async create(entity: T): Promise<T> {
    return this.ORMRepository.create(entity);
  }

  async createAndSave(entity: T): Promise<T> {
    const createData = this.ORMRepository.create(entity);
    return this.ORMRepository.save(createData);
  }

  async save(entity: T): Promise<T> {
    return this.ORMRepository.save(entity);
  }

  async find(options?: FindManyOptions): Promise<T[]> {
    return this.ORMRepository.find(options);
  }

  async findOne(options: FindOneOptions): Promise<T | null> {
    return this.ORMRepository.findOne(options);
  }

  async delete(id: string): Promise<void> {
    await this.ORMRepository.delete(id);
  }
}
