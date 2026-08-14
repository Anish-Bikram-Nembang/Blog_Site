import createAuthService, { AuthService } from './auth.service.js';
import { describe, it, expect, jest } from '@jest/globals';
import { ConflictError, UnauthorizedError } from '../../errors/errors.js';
import { AuthDeps } from './auth.service.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

describe('authService', () => {
  const mockedConfig: AuthDeps['config'] = {
    saltRounds: 4,
    jwtSecret: 'test-secret'
  }
  function makeAuthService(overrides?: Partial<jest.Mocked<AuthDeps['userService']>>): { api: AuthService, mockedUserService: jest.Mocked<AuthDeps['userService']> } {
    const mockedUserService: jest.Mocked<AuthDeps['userService']> = {
      findUserForAuth: jest.fn(() => new Promise(res => res(null))),
      createUser: jest.fn(() => new Promise(res =>
        res({
          userId: '1',
          username: 'USERNAME',
          email: 'EMAIL',
          displayName: 'DISPLAY_NAME',
          avatarUrl: 'AVATAR_URL',
        }))),
      ...overrides
    }
    return { mockedUserService, api: createAuthService({ config: mockedConfig, userService: mockedUserService }) };
  }
  describe('signup', () => {
    it('should hash the password before calling createUser', async () => {
      const { mockedUserService, api } = makeAuthService();
      await api.signup({
        username: 'USERNAME',
        email: 'EMAIL',
        password: 'PASSWORD'
      });
      const calledArgs = mockedUserService.createUser.mock.calls[0][0]
      expect(calledArgs.hashedPassword).not.toBe('PASSWORD');
      const isHashed = await bcrypt.compare('PASSWORD', calledArgs.hashedPassword);
      expect(isHashed).toBe(true);
    });
    it('should create and return the user with an accessToken', async () => {
      const { mockedUserService, api } = makeAuthService();
      const response = await api.signup({
        username: 'USERNAME',
        email: 'EMAIL',
        password: 'PASSWORD'
      });
      expect(mockedUserService.createUser).toHaveBeenCalledWith({
        username: 'USERNAME',
        email: 'EMAIL',
        hashedPassword: expect.any(String)
      });
      expect(response).toEqual({
        user: {
          userId: '1',
          username: 'USERNAME',
          email: 'EMAIL',
          displayName: 'DISPLAY_NAME',
          avatarUrl: 'AVATAR_URL',
        },
        accessToken: expect.any(String)

      })
    })
    it('should propagate conflict error when username or email already exists', async () => {
      const { api } = makeAuthService({
        createUser: jest.fn<AuthDeps['userService']['createUser']>().mockRejectedValue(new ConflictError())
      });
      await expect(api.signup({
        username: 'USERNAME',
        email: 'EMAIL',
        password: 'PASSWORD'
      })).rejects.toThrow(ConflictError);

    })
    it('should correctly sign the access token', async () => {
      const { api } = makeAuthService();
      const response = await api.signup({
        username: 'USERNAME',
        email: 'EMAIL',
        password: 'PASSWORD'
      });
      const tokenPayload = jwt.verify(response.accessToken, mockedConfig.jwtSecret) as { userId: string; username: string; };
      expect(tokenPayload.userId).toEqual('1');
      expect(tokenPayload.username).toEqual('USERNAME');
    })
  });
  describe('login', () => {
    it('should throw UnauthorizedError when user does not exist', async () => {
      const { mockedUserService, api } = makeAuthService()
      await expect(api.login({
        identifier: 'USERNAME',
        password: 'PASSWORD',
      })).rejects.toThrow(UnauthorizedError);

      expect(mockedUserService.findUserForAuth).toHaveBeenCalledWith('USERNAME');

    });
    it('should throw UnauthorizedError when password does not match', async () => {
      const passwordHash = await bcrypt.hash('CORRECT_PASSWORD', mockedConfig.saltRounds)
      const { mockedUserService, api } = makeAuthService({
        findUserForAuth: jest.fn<AuthDeps['userService']['findUserForAuth']>(() => new Promise(res => res({
          userId: '1',
          username: 'USERNAME',
          email: 'EMAIL',
          hashedPassword: passwordHash,
          displayName: 'DISPLAY_NAME',
          avatarUrl: 'AVATAR_URL',
          createdAt: new Date(),
          updatedAt: new Date(),
        })))
      });
      await expect(api.login({
        identifier: 'USERNAME',
        password: 'WRONG_PASSWORD'
      })).rejects.toThrow(UnauthorizedError);
      expect(mockedUserService.findUserForAuth).toHaveBeenCalledWith('USERNAME');

    });
    it('should return user and token on valid credentials', async () => {
      const passwordHash = await bcrypt.hash('PASSWORD', mockedConfig.saltRounds)
      const { mockedUserService, api } = makeAuthService({
        findUserForAuth: jest.fn<AuthDeps['userService']['findUserForAuth']>(() => new Promise(res => res({
          userId: '1',
          username: 'USERNAME',
          email: 'EMAIL',
          hashedPassword: passwordHash,
          displayName: 'DISPLAY_NAME',
          avatarUrl: 'AVATAR_URL',
          createdAt: new Date(),
          updatedAt: new Date(),

        })))
      });
      const response = await api.login({
        identifier: 'USERNAME',
        password: 'PASSWORD'
      });
      expect(mockedUserService.findUserForAuth).toHaveBeenCalledWith('USERNAME');
      expect(response.user).toEqual({
        userId: '1',
        username: 'USERNAME',
        email: 'EMAIL',
        displayName: 'DISPLAY_NAME',
        avatarUrl: 'AVATAR_URL',
      })

      const jwtPayload = jwt.verify(response.accessToken, mockedConfig.jwtSecret) as { userId: string; username: string; }
      expect(jwtPayload.userId).toBe('1');
      expect(jwtPayload.username).toBe('USERNAME');

    })


  });
});


