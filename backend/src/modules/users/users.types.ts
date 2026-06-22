export interface User {
  userId: string;
  username: string;
}
export interface UserSchema extends User {
  hashedPassword: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
}
export interface CreateUserPayload {
  username: string;
  hashedPassword: string;
}
