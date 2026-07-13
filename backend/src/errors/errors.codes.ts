export const ErrorCode = {
  UNAUTHORIZED: "UNAUTHORIZED",
  CONFLICT: "CONFLICT",
  NOT_FOUND: "NOT_FOUND",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  FORBIDDEN: "FORBIDDEN",
  INTERNAL_SERVER_ERROR: "INTERNAL_SERVER_ERROR"

} as const;

export type ErrorCode = typeof ErrorCode[keyof typeof ErrorCode];

