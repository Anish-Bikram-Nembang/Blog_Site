import { JwtPayload } from "../modules/auth/auth.middleware.ts";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload
    }
  }
}
