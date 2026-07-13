import {
  NextFunction, Request, Response
} from "express"
import { AppError } from "./errors.js"
import { ErrorCode } from "./errors.codes.js";

const errorMiddleware = (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message
    })
  }
  console.log(err);
  return res.status(500).json({
    code: ErrorCode.INTERNAL_SERVER_ERROR,
    message: "Internal Server Error"
  })
}
export default errorMiddleware;
