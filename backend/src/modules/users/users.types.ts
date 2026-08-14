export interface User {
  userId: string;
  username: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
}
export interface CreateUserPayload {
  username: string;
  email: string;
  hashedPassword: string;
}
