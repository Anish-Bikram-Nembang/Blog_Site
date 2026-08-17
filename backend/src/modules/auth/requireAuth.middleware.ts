import { NextFunction, Response } from "express";
import { RequestAfterAttachUserMiddleware } from "./auth.types.js";
import { UnauthorizedError } from "../../errors/errors.js";

export default function requireAuth(req: RequestAfterAttachUserMiddleware, _res: Response, next: NextFunction) {
  if (req.user) {
    next();
    return;
  }
  throw new UnauthorizedError(req.authFailureReason);
}

