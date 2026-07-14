import { ValidationError } from "../errors/errors.js";

export function asString(value: unknown): string | undefined {
  return typeof value === 'string' ? value : undefined;
}
export function requireString(value: unknown, identifier = 'param'): string {
  if (typeof value !== 'string') {
    throw new ValidationError(`${identifier} must be a string`);
  };
  return value;
}
export function asNumber(value: unknown): number | undefined {
  return typeof value === 'number' ? value : undefined;
}
