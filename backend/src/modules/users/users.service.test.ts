import { describe, it, expect, jest } from '@jest/globals';
import createUserService, { UserService, UserServiceDeps } from "./users.service.js"
import { UserRepository } from './users.repository.js';
import { UserEntity } from '../../database/types/user.entity.js';
import { User } from './users.types.js';
import { ConflictError } from '../../errors/errors.js';

describe('userService', () => {
  const userEntity: UserEntity = {
    userId: '1',
    username: 'USERNAME',
    email: 'EMAIL',
    hashedPassword: "HASHED_PASSWORD",
    displayName: 'DISPLAY_NAME',
    avatarUrl: 'AVATAR_URL',
    createdAt: new Date(),
    updatedAt: new Date(),
  }
  const user: User = {
    userId: '1',
    username: 'USERNAME',
    email: 'EMAIL',
    displayName: 'DISPLAY_NAME',
    avatarUrl: 'AVATAR_URL'
  }
  function makeUserService(overrides?: Partial<jest.Mocked<UserServiceDeps['userRepository']>>): { api: UserService, mockedUserRepository: UserRepository } {
    const mockedUserRepository: jest.Mocked<UserServiceDeps['userRepository']> = {
      createUser: jest.fn(),
      findUserById: jest.fn(),
      findUserByUsername: jest.fn(),
      findUserByEmail: jest.fn(),
      findUserByUsernameOrEmail: jest.fn(),
      ...overrides
    }
    return {
      api: createUserService({ userRepository: mockedUserRepository }),
      mockedUserRepository,
    }
  }
  describe('createUser', () => {
    it('should create and return the user with stripped data', async () => {
      const { api, mockedUserRepository } = makeUserService({
        createUser: jest.fn(() => new Promise(res => res(userEntity)))
      })
      const result = await api.createUser({
        username: userEntity.username,
        email: userEntity.email,
        hashedPassword: userEntity.hashedPassword
      })
      expect(mockedUserRepository.createUser).toHaveBeenCalledWith({
        username: userEntity.username,
        email: userEntity.email,
        hashedPassword: userEntity.hashedPassword
      })
      expect(result).toEqual(user);
    });
    it('should propagate conflict error', async () => {
      const { api } = makeUserService({
        createUser: jest.fn<UserServiceDeps['userRepository']['createUser']>().mockRejectedValue(new ConflictError())
      })
      await expect(api.createUser({
        username: userEntity.username,
        email: userEntity.email,
        hashedPassword: userEntity.hashedPassword,
      })).rejects.toThrow(ConflictError);
    });

  });
  describe('findUserForAuth', () => {
    it('should return UserEntity will all table fields', async () => {
      const { api, mockedUserRepository } = makeUserService({
        findUserByUsernameOrEmail: jest.fn(() => new Promise(res => res(userEntity)))
      });
      const result = await api.findUserForAuth(user.username);
      expect(result).toEqual(userEntity);
      expect(mockedUserRepository.findUserByUsernameOrEmail).toHaveBeenCalledWith(user.username);
    });
    it('should return null if user not found', async () => {
      const { api, mockedUserRepository } = makeUserService();
      const result = await api.findUserForAuth(user.username);
      expect(mockedUserRepository.findUserByUsernameOrEmail).toHaveBeenCalledWith(user.username);
      expect(result).toBe(null);
    });

  });
  describe('findUserById', () => {
    it('should strip unwanted data from UserEntity', async () => {
      const { api, mockedUserRepository } = makeUserService({
        findUserById: jest.fn(() => new Promise(res => res(userEntity)))
      });
      const result = await api.findUserById(user.userId);
      expect(mockedUserRepository.findUserById).toHaveBeenCalledWith(user.userId);
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      const { api, mockedUserRepository } = makeUserService();
      const result = await api.findUserById(user.userId);
      expect(mockedUserRepository.findUserById).toHaveBeenCalledWith(user.userId);
      expect(result).toBe(null);
    })
  });
  describe('findUserByEmail', () => {
    it('should strip unwanted data from UserEntity', async () => {
      const { api, mockedUserRepository } = makeUserService({
        findUserByEmail: jest.fn(() => new Promise(res => res(userEntity)))
      });
      const result = await api.findUserByEmail(user.email);
      expect(mockedUserRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      const { api, mockedUserRepository } = makeUserService();
      const result = await api.findUserByEmail(user.username);
      expect(mockedUserRepository.findUserByEmail).toHaveBeenCalledWith(user.email);
      expect(result).toBe(null);
    });
  });
  describe('findUserByUsername', () => {
    it('should strip unwanted data from UserEntity', async () => {
      const { api, mockedUserRepository } = makeUserService({
        findUserByUsername: jest.fn(() => new Promise(res => res(userEntity)))
      });
      const result = await api.findUserByUsername(user.username);
      expect(mockedUserRepository.findUserByUsername).toHaveBeenCalledWith(user.username);
      expect(result).toEqual(user);
    });
    it('should return null if user not found', async () => {
      const { api, mockedUserRepository } = makeUserService();
      const result = await api.findUserByUsername(user.username);
      expect(mockedUserRepository.findUserByUsername).toHaveBeenCalledWith(user.username);
      expect(result).toBe(null);
    });
  });
})
