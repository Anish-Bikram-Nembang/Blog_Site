import { Response, NextFunction } from "express";
import { ForbiddenError } from "../../errors/errors.js";
import config from "../../config.js";
import { AuthenticatedRequest } from "../../modules/auth/auth.types.js";

export default function requireAdmin(req: AuthenticatedRequest, _res: Response, next: NextFunction) {
  const userId = req.user?.userId;
  if (userId !== config.adminId) {
    throw new ForbiddenError("Admin status is required for this action");
  }
  next();
}
