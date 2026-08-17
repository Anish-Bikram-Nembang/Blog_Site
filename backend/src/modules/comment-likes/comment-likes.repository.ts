import { DatabaseError } from "pg"
import { ConflictError, NotFoundError } from "../../errors/errors.js"
import { CommentLikeEntity } from "../../database/types/comment-like.entity.js"
import { Queryable } from "../../shared/types/queryable.js"


export interface CommentLikesRepository {
  createLike(authorId: string, commentId: string): Promise<CommentLikeEntity>
  deleteLike(authorId: string, commentId: string): Promise<CommentLikeEntity | null>
  getLike(authorId: string, commentId: string): Promise<CommentLikeEntity | null>
}

export default function createCommentLikesRepository(deps: {
  db: Queryable
}): CommentLikesRepository {
  return {
    async createLike(authorId, commentId) {
      try {
        const result = await deps.db.query<CommentLikeEntity>(`
      INSERT INTO comment_likes
      (user_id, comment_id)
      VALUES ($1, $2)
      RETURNING
        user_id AS "userId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      `, [authorId, commentId]);
        return result.rows[0];
      } catch (e) {
        if (e instanceof DatabaseError) {
          if (e.code === "23505" && e.constraint === "comment_likes_pkey") {
            throw new ConflictError("Like already exists");
          }
          if (e.code === "23503" && e.constraint === "comment_likes_comment_id_fkey") {
            throw new NotFoundError("Comment not found");
          }
          if (e.code === "23503" && e.constraint === "comment_likes_user_id_fkey") {
            throw new NotFoundError("User not found");
          }
        }
        throw e;

      }
    },
    async getLike(authorId, commentId) {
      const result = await deps.db.query<CommentLikeEntity>(`
      SELECT
        user_id AS "userId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      FROM comment_likes
      WHERE user_id = $1
      AND comment_id = $2
      `, [authorId, commentId]);
      return result.rows[0] ?? null;
    },
    async deleteLike(authorId, commentId) {
      const result = await deps.db.query<CommentLikeEntity>(`
      DELETE FROM comment_likes
      WHERE user_id = $1
      AND comment_id = $2
      RETURNING
        user_id AS "userId",
        comment_id AS "commentId",
        created_at AS "createdAt"
      `, [authorId, commentId]);
      return result.rows[0] ?? null;
    }
  }
}
