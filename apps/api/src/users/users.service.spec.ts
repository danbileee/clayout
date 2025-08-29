import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { createMockRepositoryProvider } from '../../test/test-utils';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BadRequestException } from '@nestjs/common';
import { UserRoles } from '@clayout/interface';

describe('UsersService', () => {
  let service: UsersService;
  let usersRepository: jest.Mocked<Repository<UserEntity>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, createMockRepositoryProvider(UserEntity)],
    }).compile();

    service = module.get<UsersService>(UsersService);
    usersRepository = module.get(getRepositoryToken(UserEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createUser', () => {
    const userData = {
      username: 'testuser',
      email: 'test@example.com',
      password: 'hashedPassword',
      role: UserRoles.User,
    };

    it('should create user successfully when username and email are unique', async () => {
      const mockUser = { id: 1, ...userData } as unknown as UserEntity;

      usersRepository.exists.mockResolvedValue(false);
      usersRepository.create.mockReturnValue(mockUser);
      usersRepository.save.mockResolvedValue(mockUser);

      const result = await service.createUser(userData);

      expect(usersRepository.exists).toHaveBeenCalledWith({
        where: { username: userData.username },
      });
      expect(usersRepository.exists).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(usersRepository.create).toHaveBeenCalledWith(userData);
      expect(usersRepository.save).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw BadRequestException when username already exists', async () => {
      // Reset mocks
      jest.clearAllMocks();

      usersRepository.exists
        .mockResolvedValueOnce(true) // Username exists
        .mockResolvedValueOnce(false); // Email doesn't exist

      try {
        await service.createUser(userData);
        // If we reach here, no exception was thrown
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('This username already exists.');
      }

      expect(usersRepository.exists).toHaveBeenCalledWith({
        where: { username: userData.username },
      });
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when email already exists', async () => {
      // Reset mocks
      jest.clearAllMocks();

      usersRepository.exists
        .mockResolvedValueOnce(false) // Username doesn't exist
        .mockResolvedValueOnce(true); // Email exists

      try {
        await service.createUser(userData);
        // If we reach here, no exception was thrown
        expect(true).toBe(false); // This should not be reached
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
        expect(error.message).toBe('This email already exists.');
      }

      expect(usersRepository.exists).toHaveBeenCalledWith({
        where: { username: userData.username },
      });
      expect(usersRepository.exists).toHaveBeenCalledWith({
        where: { email: userData.email },
      });
      expect(usersRepository.create).not.toHaveBeenCalled();
      expect(usersRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('getUser', () => {
    it('should find user by email', async () => {
      const email = 'test@example.com';
      const mockUser = {
        id: 1,
        email,
        username: 'testuser',
      } as unknown as UserEntity;

      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUser({ email });

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toEqual(mockUser);
    });

    it('should find user by username', async () => {
      const username = 'testuser';
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username,
      } as unknown as UserEntity;

      usersRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.getUser({ username });

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { username },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      const email = 'nonexistent@example.com';

      usersRepository.findOne.mockResolvedValue(null);

      const result = await service.getUser({ email });

      expect(usersRepository.findOne).toHaveBeenCalledWith({
        where: { email },
      });
      expect(result).toBeNull();
    });
  });

  describe('updateUser', () => {
    it('should update user successfully', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
        role: UserRoles.User,
      } as unknown as UserEntity;

      const updatedUser = {
        ...mockUser,
        username: 'updateduser',
      } as unknown as UserEntity;

      usersRepository.save.mockResolvedValue(updatedUser);

      const result = await service.updateUser(updatedUser);

      expect(usersRepository.save).toHaveBeenCalledWith(updatedUser);
      expect(result).toEqual(updatedUser);
    });
  });
});
