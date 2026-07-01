import pool from "../database/pool.service.js"
import { PostLike } from "./post-likes.types.js"


interface PostLikesRepository {
  createLike(userId: string, postId: string): Promise<PostLike>
  deleteLike(userId: string, postId: string): Promise<PostLike | null>
  getLike(userId: string, postId: string): Promise<PostLike | null>
}

const postLikesRepository: PostLikesRepository = {
  async createLike(userId, postId) {
    const result = await pool.query<PostLike>(`
      INSERT INTO post_likes
      (user_id, post_id)
      VALUES ($1, $2)
      RETURNING
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [userId, postId]);
    return result?.rows[0];
  },
  async getLike(userId, postId) {
    const result = await pool.query<PostLike>(`
      SELECT
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      FROM post_likes
      WHERE user_id = $1
      AND post_id = $2
      `, [userId, postId]);
    return result?.rows[0] ?? null;
  },
  async deleteLike(userId, postId) {
    const result = await pool.query<PostLike>(`
      DELETE FROM post_likes
      WHERE user_id = $1
      AND post_id = $2
      RETURNING
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [userId, postId]);
    return result?.rows[0] ?? null;
  }
}
export default postLikesRepository;
