import { User } from "../users/users.types.js";

export interface SignUpRequest {
  username: string;
  email: string;
  password: string;
}
export interface LoginRequest {
  identifier: string;
  password: string;
}

export interface AuthResponse {
  user: User
  accessToken: string;
}
