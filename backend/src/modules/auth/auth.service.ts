import { LoginRequest, SignUpRequest } from "./auth.types.js";
import bcrypt from "bcrypt";
import { UserService } from "../users/users.service.js"
import jwt from "jsonwebtoken"
import { User } from "../users/users.types.js";
import { ConflictError, UnauthorizedError } from "../../errors/errors.js";

export interface AuthService {
  signup(payload: SignUpRequest): Promise<{ user: User, accessToken: string }>
  login(payload: LoginRequest): Promise<{ user: User, accessToken: string }>

}
export interface AuthDeps {
  userService: {
    findUserByUsername: UserService['findUserByUsername'];
    createUser: UserService['createUser'];
  };
  config: {
    saltRounds: number;
    jwtSecret: string;
  }

}
export default function createAuthService(deps: AuthDeps): AuthService {
  return {
    async signup(payload) {
      const existingUser = await deps.userService.findUserByUsername(payload.username);
      if (existingUser) {
        throw new ConflictError("Username already exists")
      }
      const hashedPassword = await bcrypt.hash(payload.password, deps.config.saltRounds)
      const user = await deps.userService.createUser({ username: payload.username, hashedPassword });
      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        deps.config.jwtSecret,
        { expiresIn: '7d' })
      return { user, accessToken: token };
    },
    async login(payload) {
      const existingUser = await deps.userService.findUserByUsername(payload.username);
      if (!existingUser) {
        throw new UnauthorizedError("Invalid credentials");
      }
      const match = await bcrypt.compare(payload.password, existingUser.hashedPassword);
      if (!match) {
        throw new UnauthorizedError("Invalid credentials");
      }
      const token = jwt.sign(
        { userId: existingUser.userId, username: existingUser.username },
        deps.config.jwtSecret,
        { expiresIn: '7d' })

      return {
        user: { userId: existingUser.userId, username: existingUser.username },
        accessToken: token,
      }
    }
  }

}

