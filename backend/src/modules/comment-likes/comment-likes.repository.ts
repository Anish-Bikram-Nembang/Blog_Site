import pool from "../database/pool.service.js"
import { CommentLike } from "./comment-likes.types.js"


interface CommentLikesRepository {
  createLike(authorId: string, commentId: string): Promise<CommentLike>
  deleteLike(authorId: string, commentId: string): Promise<CommentLike | null>
  getLike(authorId: string, commentId: string): Promise<CommentLike | null>
}

const commentLikesRepository: CommentLikesRepository = {
  async createLike(authorId, commentId) {
    const result = await pool.query<CommentLike>(`
      INSERT INTO comment_likes
      (author_id, comment_id)
      VALUES ($1, $2)
      RETURNING
        author_id AS "authorId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      `, [authorId, commentId]);
    return result?.rows[0];
  },
  async getLike(authorId, commentId) {
    const result = await pool.query<CommentLike>(`
      SELECT
        author_id AS "authorId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      FROM comment_likes
      WHERE author_id = $1
      AND comment_id = $2
      `, [authorId, commentId]);
    return result?.rows[0] ?? null;
  },
  async deleteLike(authorId, commentId) {
    const result = await pool.query<CommentLike>(`
      DELETE FROM comment_likes
      WHERE author_id = $1
      AND comment_id = $2
      RETURNING
        author_id AS "authorId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      `, [authorId, commentId]);
    return result?.rows[0] ?? null;
  }
}
export default commentLikesRepository;
