import pool from "../../database/pool.service.js"

interface Comment {
  commentId: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;

}
interface CommentRepository {
  getCommentsByPostId(postId: string, limit: number, offset: number): Promise<Comment[]>;
  postComment({ postId, authorId, content }: { postId: string, authorId: string, content: string }): Promise<Comment>;
  removeComment(commentId: string, authorId: string): Promise<Comment | null>;
}
const commentRepository: CommentRepository = {
  async getCommentsByPostId(postId, limit, offset) {
    const result = await pool.query<Comment>(`
        SELECT comment_id as "commentId", post_id AS "postId", author_id AS "authorId", content, created_at AS "createdAt", updated_at AS "updatedAt"
        FROM comments
        WHERE post_id = $1
        ORDER BY created_at ASC
        LIMIT $2 OFFSET $3
    `, [postId, limit, offset]);
    return result.rows;

  },
  async postComment({ postId, authorId, content }) {
    const result = await pool.query<Comment>(`
      INSERT INTO comments (post_id, author_id, content)
      VALUES ($1, $2, $3)
      RETURNING comment_id as "commentId", post_id AS "postId", author_id AS "authorId", content, created_at AS "createdAt", updated_at AS "updatedAt"
      `, [postId, authorId, content])
    return result.rows[0];
  },
  async removeComment(commentId, authorId) {
    const result = await pool.query<Comment>(`
      DELETE FROM comments WHERE comment_id = $1 AND author_id = $2
      RETURNING comment_id as "commentId", post_id AS "postId", author_id AS "authorId", content, created_at AS "createdAt", updated_at AS "updatedAt"
      `, [commentId, authorId]);
    return result.rows[0] ?? null;

  }
}
export default commentRepository;
