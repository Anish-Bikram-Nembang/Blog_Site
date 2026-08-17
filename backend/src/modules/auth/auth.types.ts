import { Request } from "express";
import { User } from "../users/users.types.js";

export interface JwtPayload {
  userId: string;
  username: string;
}

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

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}

export interface RequestAfterAttachUserMiddleware extends Request {
  user?: JwtPayload;
  authFailureReason?: AuthFailureReason;
}

export type AuthFailureReason =
  'Authorization header is missing'
  | 'Token is missing'
  | 'Token has expired'
  | 'Invalid Token';
