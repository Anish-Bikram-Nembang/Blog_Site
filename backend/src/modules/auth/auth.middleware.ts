import { NextFunction, Request, Response } from "express";
import config from "../../config.js";
import { ValidationError, UnauthorizedError } from "../../errors/errors.js";
import jwt from "jsonwebtoken"

export interface JwtPayload {
  userId: string;
  username: string;
}

const authMiddleware = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    throw new ValidationError("Authorization header is missing");
  }
  const secretKey = config.jwtSecret;
  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new ValidationError("Token is missing");
  }
  try {
    const verifiedPayload = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as JwtPayload;
    req.user = verifiedPayload;
    next();
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      throw new UnauthorizedError("Token has expired");
    }
    throw new UnauthorizedError("Invalid token");
  }
}

export default authMiddleware;
