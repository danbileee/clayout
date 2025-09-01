import { BadRequestException, Injectable } from '@nestjs/common';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(
    user: Pick<UserEntity, 'username' | 'email' | 'password' | 'role'>,
  ) {
    const matchedUsername = await this.usersRepository.exists({
      where: {
        username: user.username,
      },
    });

    if (matchedUsername) {
      throw new BadRequestException('This username already exists.');
    }

    const matchedEmail = await this.usersRepository.exists({
      where: {
        email: user.email,
      },
    });

    if (matchedEmail) {
      throw new BadRequestException('This email already exists.');
    }

    const createdUser = this.usersRepository.create(user);
    return await this.usersRepository.save(createdUser);
  }

  async get(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: user });
  }

  async updtae(updatedUser: UserEntity): Promise<UserEntity> {
    return this.usersRepository.save(updatedUser);
  }
}
