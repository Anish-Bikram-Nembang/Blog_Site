import { PoolClient } from "pg";
import { UserEntity } from "../types/user.entity.js";
import bcrypt from "bcrypt";

export default async function seedAdmin({ pg }: { pg: PoolClient }): Promise<UserEntity> {
  const password = 'password';
  const hashedPassword = await bcrypt.hash(password, 10);
  const admin: Omit<UserEntity, 'createdAt' | 'updatedAt'> = {
    userId: 'd071a92f-2f7f-499d-9200-bc32595291c0',
    username: 'theadmin',
    displayName: 'Admin',
    avatarUrl: 'admin.jpg',
    email: 'admin@chad.com',
    hashedPassword,
  }
  const result = await pg.query<UserEntity>(`
    INSERT INTO users
    (user_id, username, display_name, avatar_url, email, hashed_password)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING
    user_id AS "userId",
    username,
    email,
    display_name AS "displayName",
    avatar_url AS "avatarUrl",
    hashed_password AS "hashedPassword",
    created_at AS "createdAt",
    updated_at AS "updatedAt"
  `, [admin.userId, admin.username, admin.displayName, admin.avatarUrl, admin.email, admin.hashedPassword]);

  return result.rows[0];
}
