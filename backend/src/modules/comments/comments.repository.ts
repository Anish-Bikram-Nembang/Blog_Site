import { CommentEntity } from "../../database/types/comment.entity.js";
import { Queryable } from "../../shared/types/queryable.js";
import { CommentRow } from "./comments.types.js";

export interface CommentRepository {
  getCommentsByPostId({ postId, limit, offset }: { postId: string, limit: number, offset: number }, currentUserId: string | undefined): Promise<CommentRow[]>;
  postComment({ postId, authorId, content }: { postId: string, authorId: string, content: string }): Promise<CommentEntity>;
  deleteComment(commentId: string, authorId: string): Promise<CommentEntity | null>;
}
export default function createCommentRepository(deps: {
  db: Queryable
}): CommentRepository {
  return {
    async getCommentsByPostId({ postId, limit, offset }, currentUserId) {
      const result = await deps.db.query<CommentRow>(`
        SELECT
          c.comment_id as "commentId",
          c.post_id AS "postId",
          c.author_id AS "authorId",
          u.username,
          c.parent_comment_id AS "parentCommentId",
          c.content,
          c.created_at AS "createdAt",
          c.updated_at AS "updatedAt",
          EXISTS (SELECT 1 FROM comment_likes WHERE comment_id = c.comment_id AND user_id = $4) AS "isLiked",
          COALESCE(COUNT(DISTINCT(cl.user_id)), 0)::int as likeCount,
          COUNT(*) OVER() AS "total"
        FROM comments c
        LEFT JOIN users u ON u.user_id = c.author_id
        LEFT JOIN comment_likes cl ON c.comment_id = cl.comment_id
        WHERE post_id = $1
        GROUP BY (c.comment_id, u.username)
        ORDER BY created_at ASC
        LIMIT $2 OFFSET $3
    `, [postId, limit, offset, currentUserId ?? null]);
      return result.rows;

    },
    async postComment({ postId, authorId, content }) {
      const result = await deps.db.query<CommentEntity>(`
      INSERT INTO comments (post_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING
        comment_id as "commentId",
        parent_comment_id AS "parentCommentId",
        post_id AS "postId",
        author_id AS "authorId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      `, [postId, authorId, content])
      return result.rows[0];

    },
    async deleteComment(commentId, authorId) {
      const result = await deps.db.query<CommentEntity>(`
      DELETE FROM comments WHERE comment_id = $1 AND author_id = $2
      RETURNING
        comment_id as "commentId",
        parent_comment_id AS "parentCommentId",
        post_id AS "postId",
        author_id AS "authorId",
        content,
        created_at AS "createdAt",
        updated_at AS "updatedAt"
      `, [commentId, authorId]);
      return result.rows[0] ?? null;

    }
  }
}
