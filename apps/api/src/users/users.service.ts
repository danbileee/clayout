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

  async createUser(user: Pick<UserEntity, 'nickname' | 'email' | 'password'>) {
    const matchedNickname = await this.usersRepository.exists({
      where: {
        nickname: user.nickname,
      },
    });

    if (matchedNickname) {
      throw new BadRequestException('This nickname already exists.');
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

  async getUser(user: Partial<UserEntity>): Promise<UserEntity> {
    return this.usersRepository.findOne({ where: user });
  }
}
