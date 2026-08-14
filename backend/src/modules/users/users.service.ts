import { UserEntity } from "../../database/types/user.entity.js";
import { UserRepository } from "./users.repository.js";
import { CreateUserPayload, User } from "./users.types.js";

export interface UserService {
  findUserForAuth(identifier: string): Promise<UserEntity | null>
  findUserByEmail(email: string): Promise<User | null>;
  findUserById(userId: string): Promise<User | null>;
  findUserByUsername(username: string): Promise<User | null>;
  createUser(createUserPayload: CreateUserPayload): Promise<User>;
}
export interface UserServiceDeps {
  userRepository: {
    findUserById: UserRepository['findUserById'];
    findUserByEmail: UserRepository['findUserByEmail'];
    findUserByUsernameOrEmail: UserRepository['findUserByUsernameOrEmail'];
    findUserByUsername: UserRepository['findUserByUsername'];
    createUser: UserRepository['createUser'];
  }
}
export default function createUserService(deps: UserServiceDeps): UserService {
  return {
    async findUserForAuth(identifier) {
      const userEntity = await deps.userRepository.findUserByUsernameOrEmail(identifier);
      if (!userEntity) {
        return null;
      }
      return userEntity;
    },
    async findUserByEmail(email) {
      const userEntity = await deps.userRepository.findUserByEmail(email);
      if (!userEntity) {
        return null;
      }
      const user = mapUserEntityToUser(userEntity);
      return user;
    },
    async findUserById(userId) {
      const userEntity = await deps.userRepository.findUserById(userId);
      if (!userEntity) {
        return null;
      }
      const user = mapUserEntityToUser(userEntity);
      return user;
    },
    async findUserByUsername(username) {
      const userEntity = await deps.userRepository.findUserByUsername(username);
      if (!userEntity) {
        return null;
      }
      const user = mapUserEntityToUser(userEntity);
      return user;
    },
    async createUser(createUserPayload) {
      const userEntity = await deps.userRepository.createUser(createUserPayload);
      const user = mapUserEntityToUser(userEntity);
      return user;

    }
  }
}

function mapUserEntityToUser(userEntity: UserEntity): User {
  return {
    userId: userEntity.userId,
    username: userEntity.username,
    email: userEntity.email,
    displayName: userEntity.displayName,
    avatarUrl: userEntity.avatarUrl
  }
}
