import pool from "../database/pool.service.js"
import { PostLike } from "./post-likes.types.js"


interface PostLikesRepository {
  createLike(authorId: string, postId: string): Promise<PostLike>
  deleteLike(authorId: string, postId: string): Promise<PostLike | null>
  getLike(authorId: string, postId: string): Promise<PostLike | null>
}

const postLikesRepository: PostLikesRepository = {
  async createLike(authorId, postId) {
    const result = await pool.query<PostLike>(`
      INSERT INTO post_likes
      (author_id, post_id)
      VALUES ($1, $2)
      RETURNING
        author_id AS "authorId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [authorId, postId]);
    return result?.rows[0];
  },
  async getLike(authorId, postId) {
    const result = await pool.query<PostLike>(`
      SELECT
        author_id AS "authorId",
        post_id AS "postId",
        created_at AS "createdAt"
      FROM post_likes
      WHERE author_id = $1
      AND post_id = $2
      `, [authorId, postId]);
    return result?.rows[0] ?? null;
  },
  async deleteLike(authorId, postId) {
    const result = await pool.query<PostLike>(`
      DELETE FROM post_likes
      WHERE author_id = $1
      AND post_id = $2
      RETURNING
        author_id AS "authorId",
        post_id AS "postId",
        created_at AS "createdAt"
      `, [authorId, postId]);
    return result?.rows[0] ?? null;
  }
}
export default postLikesRepository;
