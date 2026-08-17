import { NextFunction, Response } from "express";
import config from "../../config.js";
import { JwtPayload, RequestAfterAttachUserMiddleware } from "./auth.types.js";
import jwt from 'jsonwebtoken';


export default function attachUser(req: RequestAfterAttachUserMiddleware, _res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    req.authFailureReason = 'Authorization header is missing';
    next();
    return;
  }
  const secretKey = config.jwtSecret;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    req.authFailureReason = 'Token is missing';
    next();
    return;
  }
  try {
    const verifiedPayload = jwt.verify(token, secretKey, { algorithms: ["HS256"] }) as JwtPayload;
    req.user = verifiedPayload;
    next();
    return;
  } catch (e) {
    if (e instanceof jwt.TokenExpiredError) {
      req.authFailureReason = 'Token has expired';
      next();
      return;
    }
    req.authFailureReason = 'Invalid Token';
    next();
    return;
  }
}
