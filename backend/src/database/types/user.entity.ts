export interface UserEntity {
  userId: string;
  username: string;
  email: string;
  hashedPassword: string;
  displayName: string | null;
  avatarUrl: string | null
  createdAt: Date;
  updatedAt: Date;
}
