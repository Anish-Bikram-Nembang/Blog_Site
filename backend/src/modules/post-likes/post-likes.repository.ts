import { DatabaseError } from "pg"
import pool from "../../database/pool.service.js"
import { PostLikeEntity } from "../../database/types/post-like.entity.js"
import { ConflictError, NotFoundError } from "../../errors/errors.js"


export interface PostLikesRepository {
  createLike(userId: string, postId: string): Promise<PostLikeEntity>
  deleteLike(userId: string, postId: string): Promise<PostLikeEntity | null>
  getLike(userId: string, postId: string): Promise<PostLikeEntity | null>
}

const postLikesRepository: PostLikesRepository = {
  async createLike(userId, postId) {
    try {
      const result = await pool.query<PostLikeEntity>(`
      INSERT INTO post_likes
      (user_id, post_id)
      VALUES ($1, $2)
      RETURNING
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [userId, postId]);
      return result.rows[0];
    } catch (e) {
      if (e instanceof DatabaseError) {
        if (e.code === "23505" && e.constraint === "post_likes_pkey") {
          throw new ConflictError("Like already exists");
        }
        if (e.code === "23503" && e.constraint === "post_likes_post_id_fkey") {
          throw new NotFoundError("Post not found");
        }
        if (e.code === "23503" && e.constraint === "post_likes_user_id_fkey") {
          throw new NotFoundError("User not found");
        }
      }
      throw e;

    }
  },
  async getLike(userId, postId) {
    const result = await pool.query<PostLikeEntity>(`
      SELECT
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      FROM post_likes
      WHERE user_id = $1
      AND post_id = $2
      `, [userId, postId]);
    return result.rows[0] ?? null;
  },
  async deleteLike(userId, postId) {
    const result = await pool.query<PostLikeEntity>(`
      DELETE FROM post_likes
      WHERE user_id = $1
      AND post_id = $2
      RETURNING
        user_id AS "userId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [userId, postId]);
    return result.rows[0] ?? null;
  }
}
export default postLikesRepository;
