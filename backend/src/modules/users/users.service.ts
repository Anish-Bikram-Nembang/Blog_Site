import userRepository from "./users.repository.js";
import { CreateUserPayload, User, UserSchema } from "./users.types.js";

interface UserService {
  findUserByUsername(username: string): Promise<UserSchema | null>;
  createUser(createUserPayload: CreateUserPayload): Promise<User>;
}
const userService: UserService = {
  async findUserByUsername(username) {
    return userRepository.findUserByUsername(username);
  },
  async createUser(createUserPayload) {
    return userRepository.createUser(createUserPayload);
  }
}
export default userService
