import { DatabaseError } from "pg";
import { CreateUserPayload } from "./users.types.js"
import { ConflictError } from "../../errors/errors.js";
import { UserEntity } from "../../database/types/user.entity.js";
import { Queryable } from "../../shared/types/queryable.js";

export interface UserRepository {
  findUserByEmail(email: string): Promise<UserEntity | null>
  createUser(createUserPayload: CreateUserPayload): Promise<UserEntity>
  findUserById(userId: string): Promise<UserEntity | null>;
  findUserByUsername(username: string): Promise<UserEntity | null>
  findUserByUsernameOrEmail(userNameOrEmail: string): Promise<UserEntity | null>
}
export default function createUserRepository(deps: {
  db: Queryable
}): UserRepository {
  return {
    async createUser(createUserPayload) {
      try {
        const result = await deps.db.query<UserEntity>(`
        INSERT INTO users (username, email, hashed_password)
        VALUES ($1, $2, $3)
        RETURNING
        user_id AS "userId",
        username,
        email,
        hashed_password AS "hashedPassword",
        display_name AS "displayName",
        avatar_url AS "avatarUrl",
        created_at AS "createdAt",
        updated_at AS "updatedAt"`
          , [createUserPayload.username.toLowerCase(), createUserPayload.email, createUserPayload.hashedPassword]);
        const user = result.rows[0];
        return user;
      } catch (e) {
        if (e instanceof DatabaseError && e.code === "23505") {
          if (e.constraint === "users_username_key") {
            throw new ConflictError("Username already exists");
          }

          if (e.constraint === "users_email_key") {
            throw new ConflictError("Email already exists");
          }
        }
        throw e;

      }
    },
    async findUserByUsernameOrEmail(userNameOrEmail) {
      const result = await deps.db.query<UserEntity>(`
      SELECT
      user_id AS "userId",
      username,
      email,
      hashed_password AS "hashedPassword",
      display_name AS "displayName",
      avatar_url AS "avatarUrl",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      FROM users WHERE user_id = $1 OR email = $1 LIMIT 1`, [userNameOrEmail]
      );
      return result.rows[0] ?? null;
    },
    async findUserById(userId) {
      const result = await deps.db.query<UserEntity>(`
      SELECT
      user_id AS "userId",
      username,
      email,
      hashed_password AS "hashedPassword",
      display_name AS "displayName",
      avatar_url AS "avatarUrl",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      FROM users WHERE user_id = $1 LIMIT 1`, [userId]
      );
      return result.rows[0] ?? null;
    },
    async findUserByEmail(email) {
      const result = await deps.db.query<UserEntity>(`
      SELECT
      user_id AS "userId",
      username,
      email,
      hashed_password AS "hashedPassword",
      display_name AS "displayName",
      avatar_url AS "avatarUrl",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      FROM users WHERE email = $1 LIMIT 1`, [email]
      );
      return result.rows[0] ?? null;
    },
    async findUserByUsername(username) {
      const result = await deps.db.query<UserEntity>(`
      SELECT
      user_id AS "userId",
      username,
      email,
      hashed_password AS "hashedPassword",
      display_name AS "displayName",
      avatar_url AS "avatarUrl",
      created_at AS "createdAt",
      updated_at AS "updatedAt"
      FROM users WHERE username = $1 LIMIT 1`, [username]
      );
      return result.rows[0] ?? null;
    }

  }
}
