import { Response, NextFunction } from "express";
import { AuthenticatedRequest, RequestAfterAttachUserMiddleware } from "../../modules/auth/auth.types.js";

export default function authenticated(handler: (req: AuthenticatedRequest, res: Response, next: NextFunction) => unknown) {
  return async (req: RequestAfterAttachUserMiddleware, res: Response, next: NextFunction) => {
    return handler(req as AuthenticatedRequest, res, next);
  }
}
