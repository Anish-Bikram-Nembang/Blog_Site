import { AuthResponse, LoginRequest, SignUpRequest } from "./auth.types.js";
import bcrypt from "bcrypt";
import { UserService } from "../users/users.service.js"
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../../errors/errors.js";

export interface AuthService {
  signup(payload: SignUpRequest): Promise<AuthResponse>
  login(payload: LoginRequest): Promise<AuthResponse>

}
export interface AuthDeps {
  userService: {
    findUserForAuth: UserService['findUserForAuth'];
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
      const hashedPassword = await bcrypt.hash(payload.password, deps.config.saltRounds)
      const user = await deps.userService.createUser({ username: payload.username, email: payload.email, hashedPassword });
      const token = jwt.sign(
        { userId: user.userId, username: user.username },
        deps.config.jwtSecret,
        { expiresIn: '7d' })
      return { user, accessToken: token };
    },
    async login(payload) {
      const existingUser = await deps.userService.findUserForAuth(payload.identifier);
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
        user: {
          userId: existingUser.userId,
          username: existingUser.username,
          email: existingUser.email,
          displayName: existingUser.displayName,
          avatarUrl: existingUser.avatarUrl,

        },
        accessToken: token,
      }
    }
  }

}

