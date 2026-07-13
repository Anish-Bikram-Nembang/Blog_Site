import { ErrorCode } from "./errors.codes.js";

export class AppError extends Error {
  constructor(
    public code: ErrorCode,
    message: string,
    public statusCode: number) {
    super(message);
    this.name = this.constructor.name;
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = "Unauthorized", code: ErrorCode = ErrorCode.UNAUTHORIZED) {
    super(code, message, 401);
  }
}

export class ConflictError extends AppError {
  constructor(message = "Conflict", code: ErrorCode = ErrorCode.CONFLICT) {
    super(code, message, 409);
  }
}
export class ForbiddenError extends AppError {
  constructor(message = "Forbidden", code: ErrorCode = ErrorCode.FORBIDDEN) {
    super(code, message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Not found", code: ErrorCode = ErrorCode.NOT_FOUND) {
    super(code, message, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = "Invalid input", code: ErrorCode = ErrorCode.VALIDATION_ERROR) {
    super(code, message, 400);
  }
}
