import pool from "../../database/pool.service.js"
import { CreateUserPayload, User, UserSchema } from "./users.types.js"

interface UserRepository {
  createUser(createUserPayload: CreateUserPayload): Promise<User>
  findUserById(userId: string): Promise<User>;
  findUserByUsername(username: string): Promise<UserSchema | null>
}
const userRepository: UserRepository = {
  async createUser(createUserPayload) {
    const result = await pool.query(
      `INSERT INTO users (username, hashed_password)
       VALUES ($1, $2) RETURNING user_id, username`
      , [createUserPayload.username.toLowerCase(), createUserPayload.hashedPassword]);
    const user = result.rows[0];
    return user as User;
  },
  async findUserById(userId) {
    const result = await pool.query(
      `SELECT username, user_id AS "userId", hashed_password AS "hashedPassword" FROM users WHERE user_id = $1 LIMIT 1`, [userId]
    );
    return result.rows[0] as User;
  },
  async findUserByUsername(username) {
    const lowercasedUsername = username.toLowerCase();
    const result = await pool.query(
      `SELECT username, user_id AS "userId", hashed_password AS "hashedPassword" FROM users WHERE username = $1 LIMIT 1`
      , [lowercasedUsername]
    )
    const user: UserSchema = result.rows[0];
    return user ?? null;
  }

}
export default userRepository;
